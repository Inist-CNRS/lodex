import expect from 'expect';
import { preventUnload, allowUnload } from './unload';

describe('Window Unload Prevention', () => {
    // @ts-expect-error TS7034
    let originalWindow;

    beforeEach(() => {
        originalWindow = global.window;

        // @ts-expect-error TS2322
        global.window = {};
    });

    describe('preventUnload', () => {
        it('should register to onbeforeunload and return true', () => {
            // @ts-expect-error TS2322
            global.window.onbeforeunload = undefined;
            preventUnload();
            expect(typeof global.window.onbeforeunload).toBe('function');
            // @ts-expect-error TS2721
            expect(global.window.onbeforeunload()).toBe(true);
            // @ts-expect-error TS2790
            delete global.window.onbeforeunload;
        });
    });

    describe('allowUnload', () => {
        it('should unregister to onbeforeunload', () => {
            // @ts-expect-error TS2322
            global.window = {
                onbeforeunload: () => true,
            };
            allowUnload();
            expect(global.window.onbeforeunload).toBeUndefined();
        });
    });

    afterEach(() => {
        // @ts-expect-error TS7005
        global.window = originalWindow;
    });
});
