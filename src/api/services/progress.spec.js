import expect from 'expect';

import { Progress } from './progress';
import { PENDING, PUBLISH_DOCUMENT } from '../../common/progressStatus';

describe('Progress', () => {
    it('should get default Progress', () => {
        const progress = new Progress();

        expect(progress.getProgress()).toEqual({
            target: undefined,
            progress: undefined,
            status: PENDING,
        });
    });

    it('should allow to follow Progress', () => {
        const progress = new Progress();

        progress.start(PUBLISH_DOCUMENT, 30);

        expect(progress.getProgress()).toEqual({
            target: 30,
            progress: 0,
            status: PUBLISH_DOCUMENT,
        });

        progress.incrementProgress(10);

        expect(progress.getProgress()).toEqual({
            target: 30,
            progress: 10,
            status: PUBLISH_DOCUMENT,
        });

        progress.incrementProgress(10);

        expect(progress.getProgress()).toEqual({
            target: 30,
            progress: 20,
            status: PUBLISH_DOCUMENT,
        });

        progress.incrementProgress(10);

        expect(progress.getProgress()).toEqual({
            target: 30,
            progress: 30,
            status: PENDING,
        });
    });
});
