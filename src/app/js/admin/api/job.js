import fetch from '../../lib/fetch';
import {
    getCancelJobRequest,
    getClearJobsRequest,
    getJobLogsRequest,
} from '../../user';
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

const clearJobs = () => {
    const state = getUserLocalStorageInfo();

    const request = getClearJobsRequest(state);
    return fetch(request);
};

export default { cancelJob, clearJobs, getJobLogs };
