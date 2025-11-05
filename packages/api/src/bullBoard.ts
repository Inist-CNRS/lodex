import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';

const bullBoard = (() => {
    const queues = {};
    let bullBoardInstance = {};

    const initBullBoard = (serverAdapter: any) => {
        bullBoardInstance = createBullBoard({
            queues: [],
            serverAdapter,
        });
    };

    const addDashboardQueue = (queueName: any, queue: any) => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (queues[queueName]) {
            throw new Error(`Queue ${queueName} already exists`);
        }
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        queues[queueName] = queue;
        // @ts-expect-error TS(2339): Property 'addQueue' does not exist on type '{}'.
        bullBoardInstance.addQueue(new BullAdapter(queue));
    };

    const removeDashboardQueue = (queueName: any) => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (!queues[queueName]) {
            throw new Error(`Queue ${queueName} does not exist`);
        }
        // @ts-expect-error TS(2339): Property 'removeQueue' does not exist on type '{}'... Remove this comment to see the full error message
        bullBoardInstance.removeQueue(queueName);
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        delete queues[queueName];
    };

    const hasDashboardQueue = (queueName: any) => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        return !!queues[queueName];
    };

    const getBullBoardInstance = () => {
        return bullBoardInstance;
    };

    return {
        initBullBoard,
        addDashboardQueue,
        removeDashboardQueue,
        hasDashboardQueue,
        getBullBoardInstance,
    };
})();

export default bullBoard;
