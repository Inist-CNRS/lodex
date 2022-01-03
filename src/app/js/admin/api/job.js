import fetch from '../../lib/fetch';
import { getJobLogsRequest, getCancelJobRequest } from '../../user';

export const getUserLocalStorageInfo = () => {
    const localStorageItem = JSON.parse(
        window.localStorage.getItem('redux-localstorage'),
    );
    return typeof localStorageItem === 'string'
        ? JSON.parse(localStorageItem).user
        : localStorageItem.user;
};

const getJobLogs = (queue, jobId) => {
    const userInfo = getUserLocalStorageInfo();

    const request = getJobLogsRequest(userInfo, queue, jobId);
    return fetch(request);
};

const cancelJob = queue => {
    const state = getUserLocalStorageInfo();

    const request = getCancelJobRequest(state, queue);
    return fetch(request);
};

export default { getJobLogs, cancelJob };
