import { CombinedAlignment, HoverPosition, PositionAlignment, PositionCollision } from "hover-position";

export class HoverBox {
    private _selector: string;
    private _options: HoverOptions;
    private _timeouts: { [key: string]: ReturnType<typeof setTimeout> | null };

    constructor(selector: string, defaultOptions?: HoverOptions) {
        this._selector = selector;
        this._options = Object.assign({}, defaultOptions);
        this._timeouts = {};

        this.start();
    }

    start() {
        const that = this;

        HoverBox.addHoverListener("mouseenter", that._selector, function (this: HTMLElement) { that.showHoverBox(this); });
        HoverBox.addHoverListener("mouseleave", that._selector, function (this: HTMLElement) { that.hideHoverBox(this); });
    }

    stop() {
        const that = this;

        HoverBox.removeHoverListener("mouseenter", that._selector, function (this: HTMLElement) { that.showHoverBox(this); });
        HoverBox.removeHoverListener("mouseleave", that._selector, function (this: HTMLElement) { that.hideHoverBox(this); });
    }

    private static addHoverListener(eventType: string, delegateSelector: string, handler: Function) {
        document.addEventListener(eventType, function (this: HTMLElement, e) {
            const target = <HTMLElement>e.target;

            if (target && target !== this && target.matches(delegateSelector)) {
                handler.call(target, e);
            }
        }, true);
    }

    private static removeHoverListener(eventType: string, delegateSelector: string, handler: Function) {
        document.removeEventListener(eventType, function (this: HTMLElement, e) {
            const target = <HTMLElement>e.target;

            if (target && target !== this && target.matches(delegateSelector)) {
                handler.call(target, e);
            }
        }, true);
    }

    private getHoverData(t: HTMLElement, showOrHide: "show" | "hide"): void {
        const inlineData: HoverOptions & { hoverData?: string } =
            Object.assign(this._options, t.dataset);

        let foundHoverBox: HTMLElement | null = null;
        let hoverBox: HTMLElement;

        if (t.dataset?.hoverBoxId) {
            foundHoverBox = document.getElementById(t.dataset.hoverBoxId);
        }

        if (foundHoverBox) {
            hoverBox = foundHoverBox;

            // Dont fire the same event again
            if (
                hoverBox.style.display === "block" && showOrHide === "show" ||
                hoverBox.style.display === "none" && showOrHide === "hide"
            ) {
                return;
            }
        } else {
            hoverBox = this.createHoverBox(t, inlineData);
        }

        if (showOrHide === "show") {
            hoverBox.style.display = "none";

            const pos =
                new HoverPosition(
                    {
                        my: this._options.setMy ?? "top center",
                        at: this._options.at ?? "bottom center",
                        anchor: t,
                        hoverBox: hoverBox,
                        collision: this._options?.collision,
                        bestFitPreference: this._options?.bestFitPreference,
                        defaults: this._options?.defaults
                    }
                );

            // apply new position
            hoverBox.style.top = pos.top;
            hoverBox.style.left = pos.left;
        }

        if (showOrHide === "show") {
            let timeoutId = this._timeouts[hoverBox.id];

            if (timeoutId && timeoutId !== null) {
                this._timeouts[hoverBox.id] = null;

                clearTimeout(timeoutId);
            } else {
                timeoutId = setTimeout(
                    () => {
                        this._timeouts[hoverBox.id] = null;

                        hoverBox.style.display = "block";
                        hoverBox.style.opacity = "1";
                    },
                    this._options.transitionDelay ?? 333
                );

                this._timeouts[hoverBox.id] = timeoutId;
            }
        } else {
            this.registerHideTimeout(hoverBox);
        }
    }

    private createHoverBox(t: HTMLElement, inlineData: HoverOptions & { hoverData?: string | undefined; }) {
        const id = "hB_" + (Math.random()).toString().substr(2);

        t.dataset.hoverBoxId = id;

        const hoverBox = document.createElement("div");
        hoverBox.id = id;
        hoverBox.classList.add("HoverData");

        if (this._options.allowHtml) {
            hoverBox.innerHTML = inlineData.hoverData ?? t.querySelectorAll(".HoverData").item(0)?.innerHTML;
        } else {
            hoverBox.innerText = inlineData.hoverData ?? t.querySelectorAll(".HoverData").item(0)?.textContent ?? "";
        }

        document.body.insertAdjacentElement("beforeend", hoverBox);

        if (this._options.keepOpen !== false) {
            const that = this;

            hoverBox.addEventListener(
                "mouseenter",
                function (this: HTMLElement) {
                    let timeoutId = that._timeouts[hoverBox.id];

                    if (timeoutId && timeoutId !== null) {
                        that._timeouts[hoverBox.id] = null;

                        clearTimeout(timeoutId);
                    }
                }
            );
            hoverBox.addEventListener(
                "mouseleave",
                function (this: HTMLElement) {
                    that.registerHideTimeout(this);
                }
            );
        }

        return hoverBox;
    }

    private registerHideTimeout(hoverBox: HTMLElement) {
        let timeoutId = this._timeouts[hoverBox.id];

        if (timeoutId && timeoutId !== null) {
            this._timeouts[hoverBox.id] = null;
            
            clearTimeout(timeoutId);
        } else {
            timeoutId = setTimeout(
                () => {
                    hoverBox.style.opacity = "0";

                    this._timeouts[hoverBox.id] = setTimeout(() => {
                        this._timeouts[hoverBox.id] = null;

                        hoverBox.style.display = "none";
                    }, this._options.transitionDuration ?? 333);;
                },
                this._options.transitionDelay ?? 333
            );

            this._timeouts[hoverBox.id] = timeoutId;
        }
    }

    // Can't use it
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

    private showHoverBox(el: HTMLElement) {
        this.getHoverData(el, "show");
    }

    private hideHoverBox(el: HTMLElement) {
        this.getHoverData(el, "hide");
    }
}

export interface HoverOptions {
    setMy?: PositionAlignment;
    at?: PositionAlignment;
    keepOpen?: boolean;
    allowHtml?: boolean;
    transitionDelay?: number;
    transitionDuration?: number;

    // HoverPosition specific
    collision?: PositionCollision;
    bestFitPreference?: "horizontal" | "vertical";
    defaults?: { my: CombinedAlignment, at: CombinedAlignment };
}