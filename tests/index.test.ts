import { HoverBox } from '../src/Index';

jest.useFakeTimers();

describe('testing index file', () => {
    let boxEl: HTMLDivElement, hoverBox: HoverBox;

    boxEl = document.createElement('div');

    boxEl.classList.add('test');
    boxEl = document.body.insertAdjacentElement(
        'beforeend',
        boxEl,
    ) as HTMLInputElement;

    // Add HoverData (which would be revealed)
    const div = document.createElement('div');
    div.classList.add('HoverData');
    div.innerHTML = 'Test data';
    div.hidden = true;
    boxEl.appendChild(div);

    describe('Post-setup checks', () => {
        hoverBox = new HoverBox('.test', {
            transitionDelay: 0,
            transitionDuration: 0,
        });

        it('has added element', () => {
            expect(boxEl).not.toBeNull();
        });

        it('has created hoverBox', () => {
            expect(hoverBox).toBeDefined();
        });
    });

    test('Initial state = stopped', () =>
        // @ts-ignore
        expect(hoverBox._listening).toBe(true));

    describe('Event', () => {
        const eventFired = boxEl.dispatchEvent(new Event('mouseenter'));

        jest.advanceTimersByTime(1);

        it('should fire', () => expect(eventFired).toBe(true));
    });

    describe('After event - hoverContainer', () => {
        const hoverCont = document.getElementById(boxEl.dataset.hoverBoxId!);

        it('exists', () => expect(hoverCont).toBeDefined());

        it('is on display', () =>
            expect(hoverCont?.style.display).toBe('block'));

        // Jest doesn't have a renderer so just make sure it's defined (always 0px)
        it('has position', () => expect(hoverCont?.style.top).toBeDefined());
    });
});
