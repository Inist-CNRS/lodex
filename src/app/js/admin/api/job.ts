import fetch from '../../lib/fetch';
import {
    getCancelJobRequest,
    getClearJobsRequest,
    getJobLogsRequest,
} from '../../user';
import { getUserSessionStorageInfo } from './tools';

// @ts-expect-error TS7006
export const getJobLogs = (jobId) => {
    const { token } = getUserSessionStorageInfo();

    const request = getJobLogsRequest({ token }, jobId);
    return fetch(request);
};

// @ts-expect-error TS7006
const cancelJob = (type, subLabel) => {
    const state = getUserSessionStorageInfo();
    const request = getCancelJobRequest(state, type, subLabel);
    return fetch(request);
};

const clearJobs = () => {
    const state = getUserSessionStorageInfo();

    const request = getClearJobsRequest(state);
    return fetch(request);
};

export default { cancelJob, clearJobs, getJobLogs };
