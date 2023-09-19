import { doPublish } from './publish';
import { PUBLISHER } from '../../workers/publisher';
import { workerQueues } from '../../workers';
jest.mock('../../workers');

describe.skip('publish', () => {
    describe('doPublish', () => {
        beforeAll(async () => {
            await doPublish({});
        });
        it('should add event to publisher queue', () => {
            expect(workerQueues['lodex_test'].add).toHaveBeenCalledWith({
                jobType: PUBLISHER,
            });
        });
    });
});
