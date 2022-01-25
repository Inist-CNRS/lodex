import fetch from '../../lib/fetch';
import { getJobLogsRequest, getCancelJobRequest } from '../../user';
import { getUserLocalStorageInfo } from './tools';

const getJobLogs = jobId => {
    const { token } = getUserLocalStorageInfo();

    const request = getJobLogsRequest({ token }, jobId);
    return fetch(request);
};

const cancelJob = type => {
    const state = getUserLocalStorageInfo();

    const request = getCancelJobRequest(state, type);
    return fetch(request);
};

export default { getJobLogs, cancelJob };
