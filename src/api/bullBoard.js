import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';

const bullBoard = (() => {
    let queues = {};
    let bullBoardInstance = {};

    const initBullBoard = serverAdapter => {
        bullBoardInstance = createBullBoard({
            queues: [],
            serverAdapter,
        });
    };

    const addDashboardQueue = (queueName, queue) => {
        if (queues[queueName]) {
            throw new Error(`Queue ${queueName} already exists`);
        }
        queues[queueName] = queue;
        bullBoardInstance.addQueue(new BullAdapter(queue));
    };

    const removeDashboardQueue = queueName => {
        if (!queues[queueName]) {
            throw new Error(`Queue ${queueName} does not exist`);
        }
        bullBoardInstance.removeQueue(queueName);
        delete queues[queueName];
    };

    const hasDashboardQueue = queueName => {
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
