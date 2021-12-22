import { store } from '..';
import fetch from '../../lib/fetch';
import { getJobLogsRequest, getCancelJobRequest } from '../../user';

const getJobLogs = (queue, jobId) => {
    const state = store.getState();

    const request = getJobLogsRequest(state.user, queue, jobId);
    return fetch(request);
};

const cancelJob = queue => {
    const state = store.getState();
    const request = getCancelJobRequest(state.user, queue);

    return fetch(request);
};

export default { getJobLogs, cancelJob };
