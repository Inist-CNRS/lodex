import { store } from '..';
import fetch from '../../lib/fetch';
import { getJobLogsRequest } from '../../user';

const getJobLogs = (queue, jobId) => {
    const state = store.getState();

    const request = getJobLogsRequest(state.user, queue, jobId);
    return fetch(request);
};

export default { getJobLogs };
