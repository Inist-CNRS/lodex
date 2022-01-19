import { doPublish } from './publish';
import { PUBLISHER } from '../../workers/publisher';
import { workerQueue } from '../../workers';
jest.mock('../../workers');

describe('publish', () => {
    describe('doPublish', () => {
        beforeAll(async () => {
            await doPublish({});
        });
        it('should add event to publisher queue', () => {
            expect(workerQueue.add).toHaveBeenCalledWith({
                jobType: PUBLISHER,
            });
        });
    });
});
