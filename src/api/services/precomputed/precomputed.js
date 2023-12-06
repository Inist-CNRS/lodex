import progress from '../progress';
import localConfig from '../../../../config.json';
import { getHost } from '../../../common/uris';
import streamToPromise from 'stream-to-promise';
import ezs from '@ezs/core';
import fs from 'fs';
//import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';
import {
    PENDING as PRECOMPUTED_PENDING,
    IN_PROGRESS,
    FINISHED,
    ERROR,
    CANCELED,
} from '../../../common/taskStatus';
import { PRECOMPUTING } from '../../../common/progressStatus';
import { jobLogger } from '../../workers/tools';
import { CancelWorkerError, workerQueues } from '../../workers';
import { PRECOMPUTER } from '../../workers/precomputer';
import getLogger from '../logger';

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

    let logData = {};
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${tenant}] Webservice response ok`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(askForPrecomputedJob, logData);
    notifyListeners(room, logData);

    //WS doc here:
    //openapi.services.istex.fr/?urls.primaryName=data-computer%20-%20Calculs%20sur%20fichier%20coprus%20compress%C3%A9#/data-computer/post-v1-collect
    const streamRetrieveInput = new Readable({
        objectMode: true,
        read() {
            this.push(callId);
            this.push(null);
        },
    });
    const folderName = 'precomputedData';
    const fileName = `${precomputedId}.json`;
    const streamRetreiveWorflow = streamRetrieveInput
        .pipe(
            ezs('URLConnect', {
                url: `${webServiceBaseURL}/collect`,
                json: true,
                encoder: 'transit',
            }),
        )
        .pipe(ezs('group', { length: 100 })) // like import see. services/saveStream.js#L30
        .pipe(
            ezs(async (data, feed, self) => {
                if (!self.size) {
                    self.size = 0;
                }
                if (self.isLast()) {
                    progress.setProgress(tenant, 95);
                    await ctx.precomputed.fixStatus(precomputedId, FINISHED);
                    if (data) {
                        feed.write(JSON.stringify(data));
                    }
                    return feed.close();
                }
                self.size += data.length;
                if (self.isFirst()) {
                    progress.setProgress(tenant, 85);
                    if (data) {
                        feed.write(JSON.stringify(data));
                    }
                    return feed.end();
                }
                if (data) {
                    feed.write(JSON.stringify(data));
                }
                feed.end();
            }),
        )
        .pipe(
            ezs('FILESave', {
                location: `/app/${folderName}/${tenant}`,
                identifier: fileName,
            }),
        );

    const insertedItems = await streamToPromise(streamRetreiveWorflow);

    //TODO (possibly) Use GridFS instead of direct file system storage
    /*
    const bucket = new GridFSBucket(ctx.db, {
        bucketName: precomputedId,
    });
    bucket.drop();

    fs.createReadStream(`./${folderName}/${tenant}/${fileName}`).pipe(
        bucket.openUploadStream(fileName, {
            chunkSizeBytes: 1048576,
        }),
    );

    fs.unlinkSync(`./${folderName}/${tenant}/${fileName}`);*/

    await ctx.precomputed.updateStartedAt(precomputedId, null);

    askForPrecomputedJob.progress(100);
    const isFailed = await askForPrecomputedJob.isFailed();
    notifyListeners(`${askForPrecomputedJob.data.tenant}-precomputer`, {
        isPdwdwrecomputing: false,
        success: !isFailed,
    });
    progress.finish(tenant);
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${tenant}] Precomputing data finished. ${insertedItems} items have been calculated`,
        timestamp: new Date(),
        status: FINISHED,
    });
    jobLogger.info(askForPrecomputedJob, logData);
    notifyListeners(room, logData);
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
        message: `[Instance: ${tenant}] Precomputing data failed ${error.type} ${error.message}`,
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
    await ctx.precomputed.updateStatus(precomputed._id, IN_PROGRESS);
    await ctx.precomputed.updateStartedAt(precomputed._id, new Date());

    const room = `${ctx.tenant}-precomputed-job-${ctx.job.id}`;
    progress.setProgress(ctx.tenant, 10);
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] Building entry data`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);

    const precomputedId = precomputed._id.toString();
    const dataSetSize = await ctx.dataset.count();
    const databaseOutput = await ctx.dataset.find().stream();

    const streamWorflow = databaseOutput
        .pipe(
            ezs((entry, feed, self) => {
                if (self.isLast()) {
                    return feed.close();
                }
                const colums = [];
                precomputed.sourceColumns.map(column => {
                    colums.push(entry[column]);
                });
                feed.send({
                    id: entry.uri,
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
            ezs('URLConnect', {
                url: precomputed.webServiceUrl,
                retries: 1,
                json: true,
                encoder: 'transit',
                timeout: 60000,
                header: [
                    'Content-Type: application/gzip',
                    `X-Webhook-Success: ${webhookBaseUrl}/webhook/compute_webservice/?precomputedId=${precomputedId}&tenant=${ctx.tenant}&jobId=${room}`,
                    `X-Webhook-Failure: ${webhookBaseUrl}/webhook/compute_webservice/?precomputedId=${precomputedId}&tenant=${ctx.tenant}&jobId=${room}&failure`,
                ],
            }),
        )
        .pipe(ezs('dump'));

    const response = await streamToPromise(streamWorflow);
    const token = response.join('');

    await ctx.precomputed.updateStatus(precomputed._id, IN_PROGRESS, {
        callId: token,
    });
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] Webservice response token obtained : ${token}`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    progress.setProgress(ctx.tenant, 50);

    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] Waiting for response data`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
};

export const setPrecomputedJobId = async (ctx, precomputedID, job) => {
    await ctx.precomputed.updateStatus(precomputedID, PRECOMPUTED_PENDING, {
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
        message: `[Instance: ${ctx.tenant}] Precomputing started`,
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
        { $set: { status: '' }, $unset: { data: '', jobId: '', callId: '' } },
    );
};

const LISTENERS = [];
export const addPrecomputedJobListener = listener => {
    LISTENERS.push(listener);
};

export const notifyListeners = (room, payload) => {
    LISTENERS.forEach(listener => listener({ room, data: payload }));
};
