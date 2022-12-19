import { Progress } from './progress';
import { PENDING, PUBLISH_DOCUMENT } from '../../common/progressStatus';

describe('Progress', () => {
    it('should get default Progress', () => {
        const progress = new Progress();

        expect(progress.getProgress('lodex-test')).toEqual({
            target: undefined,
            progress: undefined,
            symbol: undefined,
            status: PENDING,
            isBackground: false,
            label: undefined,
        });
    });

    it('should change status on start if target is 0', () => {
        const progress = new Progress();

        progress.start('lodex_test', { status: PUBLISH_DOCUMENT, target: 0 });

        expect(progress.getProgress('lodex_test')).toEqual({
            target: 0,
            progress: 0,
            status: PUBLISH_DOCUMENT,
            symbol: undefined,
            error: null,
            isBackground: true,
            label: undefined,
        });
    });

    it('should allow to follow Progress', () => {
        const progress = new Progress();

        progress.start('lodex_test', { status: PUBLISH_DOCUMENT, target: 30 });

        expect(progress.getProgress('lodex_test')).toEqual({
            target: 30,
            progress: 0,
            status: PUBLISH_DOCUMENT,
            symbol: undefined,
            error: null,
            isBackground: true,
            label: undefined,
        });

        progress.incrementProgress('lodex_test', 10);

        expect(progress.getProgress('lodex_test')).toEqual({
            target: 30,
            progress: 10,
            status: PUBLISH_DOCUMENT,
            symbol: undefined,
            error: null,
            isBackground: true,
            label: undefined,
        });

        progress.setProgress('lodex_test', 20);

        expect(progress.getProgress('lodex_test')).toEqual({
            target: 30,
            progress: 20,
            status: PUBLISH_DOCUMENT,
            symbol: undefined,
            error: null,
            isBackground: true,
            label: undefined,
        });

        progress.incrementProgress('lodex_test', 10);

        expect(progress.getProgress('lodex_test')).toEqual({
            target: 30,
            progress: 30,
            status: PUBLISH_DOCUMENT,
            symbol: undefined,
            error: null,
            isBackground: true,
            label: undefined,
        });
    });

    it('should return the symbol if specified one', () => {
        const progress = new Progress();

        progress.start('lodex_test', {
            status: 'percent',
            target: 100,
            symbol: '%',
        });

        expect(progress.getProgress('lodex_test').symbol).toBe('%');

        progress.incrementProgress('lodex_test');

        expect(progress.getProgress('lodex_test').symbol).toBe('%');
    });

    describe('.throw', () => {
        it('should cancel progress ignoring all further operation until getProgress is called that will throw the error', () => {
            const progress = new Progress();

            progress.start('lodex_test', {
                status: PUBLISH_DOCUMENT,
                target: 30,
            });
            const error = new Error('Boom');
            progress.throw('lodex_test', error);
            progress.incrementProgress('lodex_test');
            progress.finish('lodex_test');

            expect(() => progress.getProgress('lodex_test')).toThrow(error);

            expect(progress.getProgress('lodex_test')).toEqual({
                error: null,
                progress: 0,
                status: 'PENDING',
                symbol: undefined,
                target: 30,
                isBackground: false,
                label: undefined,
            });
        });
    });
});
