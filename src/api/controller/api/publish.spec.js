import { doPublish } from './publish';
import { publisherQueue, PUBLISH } from '../../workers/publisher';
jest.mock('../../workers/publisher');

describe('publish', () => {
    describe('doPublish', () => {

        beforeAll(async () => {
            await doPublish({});
        });
        it('should add event to publisher queue', () => {
            expect(publisherQueue.add).toHaveBeenCalledWith(PUBLISH);
        });
    });
});
