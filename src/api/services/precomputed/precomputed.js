import progress from '../progress';
import localConfig from '../../../../config.json';
import { getHost } from '../../../common/uris';
import streamToPromise from 'stream-to-promise';
import ezs from '@ezs/core';
import Lodex from '@ezs/lodex';
import { Readable } from 'stream';
import {
    PENDING as PRECOMPUTED_PENDING,
    IN_PROGRESS,
    FINISHED,
    ERROR,
    CANCELED,
    ON_HOLD,
} from '../../../common/taskStatus';
import { mongoConnectionString } from '../mongoClient';
import { PRECOMPUTING } from '../../../common/progressStatus';
import { jobLogger } from '../../workers/tools';
import { CancelWorkerError, workerQueues } from '../../workers';
import { PRECOMPUTER } from '../../workers/precomputer';
import getLogger from '../logger';

ezs.use(Lodex);
const baseUrl = getHost();
const webhookBaseUrl =
    process.env.NODE_ENV === 'development'
        ? localConfig.precomputedBaseUrlForDevelopment
        : baseUrl;

export const getPrecomputedDataPreview = async ctx => {
    const { enrichmentBatchSize: BATCH_SIZE = 10 } = ctx.configTenant;
    const { sourceColumns } = ctx.request.body;
    if (!sourceColumns) {
        throw new Error(`Missing parameters`);
    }

    const excerptLines = await ctx.dataset.getExcerpt();
    let result = [];
    try {
        for (
            let index = 0;
            index < Math.min(excerptLines.length, BATCH_SIZE);
            index += 1
        ) {
            const entry = {};

            // Display null or undefined by string only for preview. Use for show informations to user.
            sourceColumns.map(column => {
                if (excerptLines[index][column] === undefined) {
                    entry[column] = 'undefined';
                } else if (excerptLines[index][column] === null) {
                    entry[column] = 'null';
                } else {
                    entry[column] = excerptLines[index][column];
                }
            });
            result.push(entry);
        }
    } catch (error) {
        const logger = getLogger(ctx.tenant);
        logger.error(`Error while processing precomputed preview`, error);
        return [];
    }
    // if all object are empty, we return an empty array
    if (result.every(entry => Object.keys(entry).length === 0)) {
        return [];
    }

    return result;
};

export const getComputedFromWebservice = async ctx => {
    const tenant = ctx.tenant;
    const { id: precomputedId, callId, askForPrecomputedJobId } = ctx.job.data;

    const {
        webServiceUrl,
        name: precomputedName,
    } = await ctx.precomputed.findOneById(precomputedId);
    const webServiceBaseURL = new RegExp('.*\\/').exec(webServiceUrl)[0];
    progress.initialize(tenant);
    progress.start(ctx.tenant, {
        status: PRECOMPUTING,
        target: 100,
        label: 'PRECOMPUTING',
        subLabel: precomputedName,
        type: 'precomputer',
    });

    progress.setProgress(tenant, 55);
    if (!tenant || !precomputedId || !callId) {
        throw new Error(
            `Precompute webhook error: missing data ${JSON.stringify({
                tenant: !tenant ? 'missing' : tenant,
                precomputedId: !precomputedId ? 'missing' : precomputedId,
                callId: !callId ? 'missing' : callId,
            })}`,
        );
    }
    progress.setProgress(tenant, 65);
    const workerQueue = workerQueues[tenant];
    const completedJobs = await workerQueue.getCompleted();
    const askForPrecomputedJob = completedJobs.filter(completedJob => {
        const { id, jobType, tenant: jobTenant } = completedJob.data;

        return (
            id === precomputedId &&
            jobType === PRECOMPUTER &&
            jobTenant === tenant &&
            `${tenant}-precomputed-job-${completedJob.opts.jobId}` ===
                askForPrecomputedJobId
        );
    })?.[0];

    if (!askForPrecomputedJob) {
        throw new CancelWorkerError('Job has been canceled');
    }
    progress.setProgress(tenant, 75);
    const room = `${tenant}-precomputed-job-${askForPrecomputedJobId}`;
    await ctx.precomputed.updateStatus(precomputedId._id, IN_PROGRESS);
    let logData = {};
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${tenant}] 7/10 - Response ok`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(askForPrecomputedJob, logData);
    notifyListeners(room, logData);

    //WS doc here:
    //openapi.services.istex.fr/?urls.primaryName=data-computer%20-%20Calculs%20sur%20fichier%20coprus%20compress%C3%A9#/data-computer/post-v1-retrieve
    const streamRetrieveInput = new Readable({
        objectMode: true,
        read() {
            this.push(callId);
            this.push(null);
        },
    });

    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${tenant}] 8/10 - Start retrieving data from response`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(askForPrecomputedJob, logData);
    notifyListeners(room, logData);

    const connectionStringURI = mongoConnectionString(tenant);
    const streamRetreiveWorflow = streamRetrieveInput
        .pipe(
            ezs('URLConnect', {
                url: `${webServiceBaseURL}/retrieve-json`,
                streaming: true,
                json: true,
                encoder: 'transit',
                timeout: Number(localConfig.timeout) || 120000,
            }),
        )
        .pipe(
            ezs(async (data, feed, self) => {
                if (self.isFirst()) {
                    progress.setProgress(tenant, 85);
                }
                if (self.isLast()) {
                    progress.setProgress(tenant, 95);
                    await ctx.precomputed.updateStatus(
                        precomputedId,
                        FINISHED,
                        { hasData: true },
                    );
                    return feed.close();
                }
                feed.send(data);
            }),
        )
        .pipe(ezs('group', { length: 100 })) // like import see. services/saveStream.js#L30
        .pipe(
            ezs('LodexSaveDocuments', {
                connectionStringURI,
                collection: `pc_${precomputedId}`,
            }),
        );

    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${tenant}] 9/10 - Data saved in pc_${precomputedId}`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(askForPrecomputedJob, logData);
    notifyListeners(room, logData);

    const insertReport = await streamToPromise(streamRetreiveWorflow);
    const insertCount = insertReport.reduce((a, b) => a + b, 0);
    await ctx.precomputed.updateStartedAt(precomputedId, null);

    askForPrecomputedJob.progress(100);
    const isFailed = await askForPrecomputedJob.isFailed();
    notifyListeners(`${askForPrecomputedJob.data.tenant}-precomputer`, {
        isPdwdwrecomputing: false,
        success: !isFailed,
    });

    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${tenant}] 10/10 - Precomputing finished ${insertCount} items saved.`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(askForPrecomputedJob, logData);
    notifyListeners(room, logData);
    progress.finish(tenant);
};

export const getFailureFromWebservice = async ctx => {
    const { tenant } = ctx.tenant;
    const { askForPrecomputedJobId, id: precomputedId, error } = ctx.job.data;

    if (!tenant || !precomputedId) {
        throw new Error(
            `Precompute webhook failure error: missing data ${JSON.stringify({
                tenant: !tenant ? 'missing' : tenant,
                precomputedId: !precomputedId ? 'missing' : precomputedId,
            })}`,
        );
    }
    const workerQueue = workerQueues[tenant];
    const completedJobs = await workerQueue.getCompleted();
    const job = completedJobs.filter(job => {
        const { id, jobType, tenant: jobTenant } = job.data;

        return (
            id === precomputedId &&
            jobType === PRECOMPUTER &&
            jobTenant === tenant &&
            `${tenant}-precomputed-job-${job.opts.jobId}` ===
                askForPrecomputedJobId
        );
    })?.[0];

    if (!job) {
        return;
    }

    const room = `${tenant}-precomputed-job-${askForPrecomputedJobId}`;

    await ctx.precomputed.updateStatus(precomputedId, ERROR, {
        message: error.message,
    });
    await ctx.precomputed.updateStartedAt(precomputedId, null);

    job.progress(100);
    progress.finish(tenant);
    const logData = JSON.stringify({
        level: 'error',
        message: `[Instance: ${tenant}] 7/10 - Response not ok ${error.type} ${error.message}`,
        timestamp: new Date(),
        status: ERROR,
    });
    jobLogger.info(job, logData);
    notifyListeners(room, logData);
    notifyListeners(`${job.data.tenant}-precomputer`, {
        isPrecomputing: false,
        success: false,
    });
};

const tryParseJsonString = str => {
    try {
        const parsed = JSON.parse(str);
        return parsed;
    } catch (e) {
        return str;
    }
};

export const processPrecomputed = async (precomputed, ctx) => {
    let logData = {};
    await ctx.precomputed.updateStatus(precomputed._id, IN_PROGRESS, {
        hasData: false,
    });
    await ctx.precomputed.updateStartedAt(precomputed._id, new Date());

    const room = `${ctx.tenant}-precomputed-job-${ctx.job.id}`;
    progress.setProgress(ctx.tenant, 10);
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] 2/10 - Start building compress data`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);

    const precomputedId = precomputed._id.toString();
    const dataSetSize = await ctx.dataset.count();
    const databaseOutput = await ctx.dataset.find().stream();
    const databaseOutputBis = ezs('transit'); // trick: mongo stream does not propagate error in the pipeline

    const streamWorflow = databaseOutput
        .on('error', e => databaseOutputBis.emit('error', e))
        .pipe(databaseOutputBis)
        .pipe(
            ezs((entry, feed, self) => {
                if (self.isLast()) {
                    return feed.close();
                }
                const colums = [];
                precomputed.sourceColumns.map(column => {
                    colums.push(entry[column]);
                });
                // Please note, it is important to produce identifiers identical to those that will be used in the published data.
                // Otherwise, the join will be impossible
                // see src/common/transformers/AUTOGENERATE_URI.js#L26
                const identifier =
                    String(entry.uri).indexOf('uid:/') !== 0
                        ? `uid:/${entry.uri}`
                        : entry.uri;
                feed.send({
                    id: identifier,
                    value: tryParseJsonString(
                        colums.length > 1 ? colums : colums[0],
                    ),
                });
            }),
        )
        .pipe(
            ezs((entry, feed, self) => {
                if (self.isLast()) {
                    return feed.close();
                }
                // Set 0 as 10. 100 as 45. Increment from indexDataset to dataSetSize
                const progressValue = Math.floor(
                    (self.getIndex() / dataSetSize) * 35 + 10,
                );
                progress.setProgress(ctx.tenant, progressValue);
                feed.send(entry);
            }),
        )
        .pipe(ezs('TARDump', { compress: true }))
        .pipe(
            ezs((entry, feed, self) => {
                if (self.isLast()) {
                    logData = JSON.stringify({
                        level: 'ok',
                        message: `[Instance: ${ctx.tenant}] 3/10 - End compress data. Start sending to webservice`,
                        timestamp: new Date(),
                        status: IN_PROGRESS,
                    });
                    jobLogger.info(ctx.job, logData);
                    notifyListeners(room, logData);
                    return feed.close();
                }

                feed.send(entry);
            }),
        )
        .pipe(
            ezs('URLConnect', {
                url: precomputed.webServiceUrl,
                streaming: true,
                json: true,
                encoder: 'transit',
                timeout: Number(localConfig.timeout) || 120000,
                header: [
                    'Content-Type: application/gzip',
                    `X-Webhook-Success: ${webhookBaseUrl}/webhook/compute_webservice/?precomputedId=${precomputedId}&tenant=${ctx.tenant}&jobId=${room}`,
                    `X-Webhook-Failure: ${webhookBaseUrl}/webhook/compute_webservice/?precomputedId=${precomputedId}&tenant=${ctx.tenant}&jobId=${room}&failure`,
                ],
            }),
        )
        .pipe(ezs('dump'));

    let response;
    try {
        response = await streamToPromise(streamWorflow);
    } catch (err) {
        let msg = err.message;
        if (err.sourceError && err.sourceError.responseText) {
            const { message } = tryParseJsonString(
                err.sourceError.responseText,
            );
            if (message) {
                msg = message.replace(/(<Error: |\[\w+\]|>+)/g, '');
            } else {
                msg = err.sourceError.message.split('\n').shift();
            }
        }
        await ctx.precomputed.updateStatus(precomputedId, ERROR, {
            message: msg,
        });
        throw new Error(msg);
    }
    const token = response.join('');

    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] 4/10 - Get Token`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);

    await ctx.precomputed.updateStatus(precomputed._id, ON_HOLD, {
        hasData: false,
        callId: token,
    });
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] 5/10 - Token obtained : ${token}`,
        timestamp: new Date(),
        status: ON_HOLD,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    progress.setProgress(ctx.tenant, 50);

    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] 6/10 - Waiting for response data`,
        timestamp: new Date(),
        status: ON_HOLD,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
};

export const setPrecomputedJobId = async (ctx, precomputedID, job) => {
    await ctx.precomputed.updateStatus(precomputedID, PRECOMPUTED_PENDING, {
        hasData: false,
        jobId: job.id,
    });
};

export const startAskForPrecomputed = async ctx => {
    const id = ctx.job?.data?.id;
    const precomputed = await ctx.precomputed.findOneById(id);
    progress.initialize(ctx.tenant);
    progress.start(ctx.tenant, {
        status: PRECOMPUTING,
        target: 100,
        label: 'PRECOMPUTING',
        subLabel: precomputed.name,
        type: 'precomputer',
    });

    const room = `precomputed-job-${ctx.job.id}`;
    const logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] 1/10 - Precomputing started`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    await processPrecomputed(precomputed, ctx);
};

export const startGetPrecomputed = async ctx => {
    const logger = getLogger(ctx.tenant);
    logger.info(`Precompute webhook call for ${ctx.tenant}`);

    if (ctx.job?.data?.failure !== undefined) {
        logger.info('Precompute webservice call with failure');
        await getFailureFromWebservice(ctx);
        return;
    }

    await getComputedFromWebservice(ctx);
};

export const setPrecomputedError = async (ctx, err) => {
    const id = ctx.job?.data?.id;
    await ctx.precomputed.updateStatus(
        id,
        err instanceof CancelWorkerError ? CANCELED : ERROR,
        {
            message: err?.message,
        },
    );
    await ctx.precomputed.updateStartedAt(id, null);

    const room = `precomputed-job-${ctx.job.id}`;
    const logData = JSON.stringify({
        level: 'error',
        message:
            err instanceof CancelWorkerError
                ? `[Instance: ${ctx.tenant}] ${err?.message}`
                : `[Instance: ${ctx.tenant}] Precomputing errored : ${err?.message}`,
        timestamp: new Date(),
        status: err instanceof CancelWorkerError ? CANCELED : ERROR,
    });
    ctx.job.progress(100);
    progress.finish(ctx.tenant);
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    notifyListeners(`${ctx.tenant}-precomputer`, {
        isPrecomputing: false,
        success: false,
        message:
            err instanceof CancelWorkerError
                ? 'cancelled_precomputer'
                : err?.message,
    });
};

export const restorePrecomputed = async ctx => {
    // mongo update all precomputed to set status to empty and clean possible data
    await ctx.precomputed.updateMany(
        {},
        {
            $set: { status: '' },
            $unset: { hasData: false, jobId: '', callId: '' },
        },
    );
};

const LISTENERS = [];
export const addPrecomputedJobListener = listener => {
    LISTENERS.push(listener);
};

export const notifyListeners = (room, payload) => {
    LISTENERS.forEach(listener => listener({ room, data: payload }));
};
