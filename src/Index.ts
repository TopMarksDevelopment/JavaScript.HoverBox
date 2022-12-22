import { position } from '@topmarksdevelopment/position';
import { HoverOptions } from './Interfaces/HoverOptions';

export class HoverBox {
    private _listening = false;
    private _selector: string;
    private _options: HoverOptions;
    private _timeouts: { [key: string]: ReturnType<typeof setTimeout> | null };

    /**
     * Setup hoverbox events and start listening
     * @param selector The selector to find the child that contains the text to show
     * @param options The default options to apply
     */
    constructor(selector: string, options?: HoverOptions) {
        this._selector = selector;
        this._options = Object.assign({}, options);
        this._timeouts = {};

        this.startListening();
    }

    /** # Public methods */

    /**
     * Start listening for hoverbox events
     */
    startListening(): void {
        if (!this._listening) {
            document.addEventListener(
                'mouseenter',
                this._callHoverbox('show'),
                true,
            );

            document.addEventListener(
                'mouseleave',
                this._callHoverbox('hide'),
                true,
            );

            this._listening = true;
        }
    }

    /**
     * Stop listening for hoverbox events
     */
    stopListening(): void {
        if (this._listening) {
            document.removeEventListener(
                'mouseenter',
                this._callHoverbox('show'),
                true,
            );

            document.removeEventListener(
                'mouseleave',
                this._callHoverbox('hide'),
                true,
            );

            this._listening = false;
        }
    }

    /** # Private methods */

    /** ## HoverBox handlers & fetchers */

    /**
     * Handle the hover box animation
     * @param t The containing element
     * @param showOrHide Should we show or hide the hoverBox
     */
    private _handleHoverBoxAnimation(
        t: HTMLElement,
        showOrHide: 'show' | 'hide',
    ) {
        const hoverBox = this._getHoverBox(t, showOrHide);

        if (!hoverBox) {
            return;
        }

        if (showOrHide === 'show') {
            const tId = `${hoverBox.id}_${showOrHide}`;

            hoverBox.style.display = 'none';

            const pos = position({
                my: this._options.setMy ?? 'top center',
                at: this._options.at ?? 'bottom center',
                anchor: t,
                target: hoverBox,
                collision: this._options.collision,
                bestFitPreference: this._options.bestFitPreference,
                defaults: this._options.defaults,
            });

            // apply new position
            hoverBox.style.top = pos.top;
            hoverBox.style.left = pos.left;

            let timeoutId = this._timeouts[tId];

            if (timeoutId && timeoutId !== null) {
                this._timeouts[tId] = null;

                clearTimeout(timeoutId);
            } else {
                timeoutId = setTimeout(() => {
                    this._timeouts[tId] = null;

                    hoverBox.dataset.state = 'shown';
                    hoverBox.style.display = 'block';
                    hoverBox.style.opacity = '1';
                }, this._options.transitionDelay ?? 333);

                this._timeouts[tId] = timeoutId;
            }
        } else {
            this._registerHideTimeout(hoverBox);
        }
    }

    private _getHoverBox(
        t: HTMLElement,
        showOrHide: 'show' | 'hide',
    ): HTMLElement | undefined {
        const inlineData: HoverOptions & { hoverData?: string } = Object.assign(
            this._options,
            t.dataset,
        );

        if (inlineData.hoverData ?? t.querySelectorAll('.HoverData').item(0)) {
            let foundHoverBox: HTMLElement | null = null;

            if (t.dataset?.hoverBoxId) {
                foundHoverBox = document.getElementById(t.dataset.hoverBoxId);
            }

            if (foundHoverBox) {
                // Dont fire the same event again
                if (
                    (foundHoverBox.dataset.state === 'shown' &&
                        showOrHide === 'show') ||
                    (foundHoverBox.dataset.state === 'hidden' &&
                        showOrHide === 'hide')
                ) {
                    const idToFind = `${foundHoverBox.id}_${
                            showOrHide === 'hide' ? 'show' : 'hide'
                        }`,
                        timeoutId = this._timeouts[idToFind];

                    if (timeoutId && timeoutId !== null) {
                        this._timeouts[idToFind] = null;

                        clearTimeout(timeoutId);
                    }

                    return undefined;
                }

                return foundHoverBox;
            }

            return this._createHoverBox(t, inlineData);
        }

        return undefined;
    }

    private _createHoverBox(
        t: HTMLElement,
        inlineData: HoverOptions & { hoverData?: string | undefined },
    ): HTMLElement {
        const id = 'hB_' + Math.random().toString().substr(2);

        t.dataset.hoverBoxId = id;

        const hoverBox = document.createElement('div');
        hoverBox.id = id;
        hoverBox.classList.add('HoverData');
        hoverBox.dataset.state = 'shown';

        if (this._options.allowHtml) {
            hoverBox.innerHTML =
                inlineData.hoverData ??
                t.querySelectorAll('.HoverData').item(0)?.innerHTML ??
                '';
        } else {
            hoverBox.innerText =
                inlineData.hoverData ??
                t.querySelectorAll('.HoverData').item(0)?.textContent ??
                '';
        }

        document.body.insertAdjacentElement('beforeend', hoverBox);

        if (this._options.keepOpen ?? true) {
            const that = this;

            hoverBox.addEventListener(
                'mouseenter',
                function (this: HTMLElement) {
                    const timeoutId = that._timeouts[`${hoverBox.id}_hide`];

                    if (timeoutId && timeoutId !== null) {
                        that._timeouts[`${hoverBox.id}_hide`] = null;

                        clearTimeout(timeoutId);
                    }
                },
            );
            hoverBox.addEventListener(
                'mouseleave',
                function (this: HTMLElement) {
                    that._registerHideTimeout(this);
                },
            );
        }

        return hoverBox;
    }

    /** ## Timeout handlers */

    private _registerHideTimeout(hoverBox: HTMLElement) {
        let timeoutId = this._timeouts[`${hoverBox.id}_hide`];

        if (timeoutId && timeoutId !== null) {
            this._timeouts[`${hoverBox.id}_hide`] = null;

            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            hoverBox.dataset.state = 'hidden';
            hoverBox.style.opacity = '0';

            this._timeouts[`${hoverBox.id}_hide`] = setTimeout(() => {
                this._timeouts[`${hoverBox.id}_hide`] = null;

                hoverBox.style.display = 'none';
            }, this._options.transitionDuration ?? 333);
        }, this._options.transitionDelay ?? 333);

        this._timeouts[`${hoverBox.id}_hide`] = timeoutId;
    }

    /** ## Event handlers */

    private _callHoverbox(
        action: 'show' | 'hide',
    ): EventListenerOrEventListenerObject {
        const that = this;

        return function (this: HTMLElement, e) {
            const target = <HTMLElement>e.target;

            if (target && target !== this && target.matches(that._selector)) {
                that._handleHoverBoxAnimation(target, action);
            }
        };
    }

    /** ## Unusable `.animate` (for now) */

    // Can't use it - see: https://bugs.chromium.org/p/chromium/issues/detail?id=1141935&q=&can=5
    // Note: `play` or `reverse` depends on `playspeed`?? which is 1 or -1
    /*private setupAnimation(hoverBox: HTMLElement) {
        const anim =
            hoverBox.animate(
                [{ ["opacity"]: 0 }, { ["opacity"]: 1 }],
                {
                    id: "hoverBox",
                    delay: this._options.hoverDelay,
                    duration: 1000,
                }
            );

        anim.pause();

        anim.onfinish = () => {
            if (hoverBox) {
                console.log(`Finish fire - ${hoverBox.dataset.showOrHide}`);

                if (hoverBox.dataset.showOrHide === "hide") {
                    hoverBox.style.display = "none";
                    hoverBox.style.opacity = "0";
                }
            }
        };

        return anim;
    }*/
}

export { HoverOptions };
