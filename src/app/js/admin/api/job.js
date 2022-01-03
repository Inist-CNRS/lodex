import fetch from '../../lib/fetch';
import { getJobLogsRequest, getCancelJobRequest } from '../../user';

export const getUserLocalStorageInfo = () =>
    JSON.parse(window.localStorage.getItem('redux-localstorage').user);

const getJobLogs = (queue, jobId) => {
    const state = getUserLocalStorageInfo();

    const request = getJobLogsRequest(state, queue, jobId);
    return fetch(request);
};

const cancelJob = queue => {
    const state = getUserLocalStorageInfo();

    const request = getCancelJobRequest(state, queue);
    return fetch(request);
};

export default { getJobLogs, cancelJob };
