import { Progress } from './progress';
import { PENDING, PUBLISH_DOCUMENT } from '../../common/progressStatus';

describe('Progress', () => {
    it('should get default Progress', () => {
        const progress = new Progress();

        expect(progress.getProgress()).toEqual({
            target: undefined,
            progress: undefined,
            symbol: undefined,
            status: PENDING,
        });
    });

    it('should change status on start if target is 0', () => {
        const progress = new Progress();

        progress.start(PUBLISH_DOCUMENT, 0);

        expect(progress.getProgress()).toEqual({
            target: 0,
            progress: 0,
            status: PUBLISH_DOCUMENT,
            symbol: undefined,
            error: null,
        });
    });

    it('should not change status on start if target is null', () => {
        const progress = new Progress();

        progress.start(PUBLISH_DOCUMENT, null);

        expect(progress.getProgress()).toEqual({
            target: undefined,
            progress: undefined,
            status: PENDING,
            symbol: undefined,
        });
    });

    it('should allow to follow Progress', () => {
        const progress = new Progress();

        progress.start(PUBLISH_DOCUMENT, 30);

        expect(progress.getProgress()).toEqual({
            target: 30,
            progress: 0,
            status: PUBLISH_DOCUMENT,
            symbol: undefined,
            error: null,
        });

        progress.incrementProgress(10);

        expect(progress.getProgress()).toEqual({
            target: 30,
            progress: 10,
            status: PUBLISH_DOCUMENT,
            symbol: undefined,
            error: null,
        });

        progress.setProgress(20);

        expect(progress.getProgress()).toEqual({
            target: 30,
            progress: 20,
            status: PUBLISH_DOCUMENT,
            symbol: undefined,
            error: null,
        });

        progress.incrementProgress(10);

        expect(progress.getProgress()).toEqual({
            target: 30,
            progress: 30,
            status: PUBLISH_DOCUMENT,
            symbol: undefined,
            error: null,
        });
    });

    it('should return the symbol if specified one', () => {
        const progress = new Progress();

        progress.start('percent', 100, '%');

        expect(progress.getProgress().symbol).toBe('%');

        progress.incrementProgress();

        expect(progress.getProgress().symbol).toBe('%');
    });

    describe('.throw', () => {
        it('should cancel progress ignoring all further operation until getProgress is called that will throw the error', () => {
            const progress = new Progress();

            progress.start(PUBLISH_DOCUMENT, 30);
            const error = new Error('Boom');
            progress.throw(error);
            progress.incrementProgress();
            progress.finish();

            expect(() => progress.getProgress()).toThrowError(error);

            expect(progress.getProgress()).toEqual({
                error: null,
                progress: 0,
                status: 'PENDING',
                symbol: undefined,
                target: 30,
            });
        });
    });
});
