import expect from 'expect';

import { Progress } from './progress';

describe('Progress', () => {
    it('should get default Progress', () => {
        const progress = new Progress();

        expect(progress.getProgress()).toEqual({
            target: undefined,
            progress: undefined,
            status: 'pending',
        });
    });

    it('should allow to follow Progress', () => {
        const progress = new Progress();

        progress.startPublishing(30);

        expect(progress.getProgress()).toEqual({
            target: 30,
            progress: 0,
            status: 'publishing',
        });

        progress.incrementProgress(10);

        expect(progress.getProgress()).toEqual({
            target: 30,
            progress: 10,
            status: 'publishing',
        });

        progress.incrementProgress(10);

        expect(progress.getProgress()).toEqual({
            target: 30,
            progress: 20,
            status: 'publishing',
        });

        progress.incrementProgress(10);

        expect(progress.getProgress()).toEqual({
            target: 30,
            progress: 30,
            status: 'done',
        });
    });
});
