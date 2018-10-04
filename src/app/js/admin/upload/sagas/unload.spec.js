import expect from 'expect';
import { preventUnload, allowUnload } from './unload';

describe('Window Unload Prevention', () => {
    let originalWindow;

    beforeEach(() => {
        originalWindow = global.window;

        global.window = {};
    });

    describe('preventUnload', () => {
        it('should register to onbeforeunload and return true', () => {
            global.window.onbeforeunload = undefined;
            preventUnload();
            expect(typeof global.window.onbeforeunload).toBe('function');
            expect(global.window.onbeforeunload()).toBe(true);
            delete global.window.onbeforeunload;
        });
    });

    describe('allowUnload', () => {
        it('should unregister to onbeforeunload', () => {
            global.window = {
                onbeforeunload: () => true,
            };
            allowUnload();
            expect(global.window.onbeforeunload).toBe(undefined);
        });
    });

    afterEach(() => {
        global.window = originalWindow;
    });
});
