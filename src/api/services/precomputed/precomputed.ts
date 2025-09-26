import progress from '../progress';
import localConfig from '../../../../config.json';
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { getHost } from '../../../common/uris';
import { unlinkFile } from '../fsHelpers';
import streamToPromise from 'stream-to-promise';
// @ts-expect-error TS(2792): Cannot find module 'fetch-with-proxy'. Did you mea... Remove this comment to see the full error message
import fetch from 'fetch-with-proxy';
import path from 'path';
import { tmpdir } from 'os';
import { createReadStream } from 'fs';
// @ts-expect-error TS(2792): Cannot find module 'stream-to-promise'. Did you me... Remove this comment to see the full error message
import ezs from '@ezs/core';
// @ts-expect-error TS(2792): Cannot find module '@ezs/lodex'. Did you mean to s... Remove this comment to see the full error message
import Lodex from '@ezs/lodex';
// @ts-expect-error TS(2792): Cannot find module '@ezs/basics'. Did you mean to ... Remove this comment to see the full error message
import Basics from '@ezs/basics';
import { Readable } from 'stream';
import {
    PENDING as PRECOMPUTED_PENDING,
    IN_PROGRESS,
    FINISHED,
    ERROR,
    CANCELED,
    ON_HOLD,
    // @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
} from '../../../common/taskStatus';
import { mongoConnectionString } from '../mongoClient';
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { PRECOMPUTING } from '../../../common/progressStatus';
import { jobLogger } from '../../workers/tools';
import { CancelWorkerError, workerQueues } from '../../workers';
import { PRECOMPUTER } from '../../workers/precomputer';
import getLogger from '../logger';

ezs.use(Lodex);
ezs.use(Basics);
const tmpDirectory = path.resolve(tmpdir(), 'precomputed');
const baseUrl = getHost();
const webhookBaseUrl = String(
    localConfig.alternativePrecomputedBaseUrl,
).startsWith('http')
    ? localConfig.alternativePrecomputedBaseUrl
    : baseUrl;
export const getPrecomputedDataPreview = async (ctx: any) => {
    const { enrichmentBatchSize: BATCH_SIZE = 10 } = ctx.configTenant;
    const { sourceColumns } = ctx.request.body;
    if (!sourceColumns) {
        throw new Error(`Missing parameters`);
    }

    const excerptLines = await ctx.dataset.getExcerpt();
    const result = [];
    try {
        for (
            let index = 0;
            index < Math.min(excerptLines.length, BATCH_SIZE);
            index += 1
        ) {
            const entry = {};

            // Display null or undefined by string only for preview. Use for show informations to user.
            sourceColumns.map((column: any) => {
                if (excerptLines[index][column] === undefined) {
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    entry[column] = 'undefined';
                } else if (excerptLines[index][column] === null) {
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    entry[column] = 'null';
                } else {
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
    if (result.every((entry: any) => Object.keys(entry).length === 0)) {
        return [];
    }

    return result;
};

export const getComputedFromWebservice = async (ctx: any) => {
    const tenant = ctx.tenant;
    const { id: precomputedId, callId, askForPrecomputedJobId } = ctx.job.data;

    const precomputed = await ctx.precomputed.findOneById(precomputedId);
    if (!precomputed) {
        // Entry may have been deleted before the webservice called us back.
        // We can ignore the reply in that case.
        return;
    }
    const { webServiceUrl, name: precomputedName } = precomputed;
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
    await unlinkFile(path.resolve(tmpDirectory, precomputedId)); // delete input file
    progress.setProgress(tenant, 65);
    const workerQueue = workerQueues[tenant];
    const completedJobs = await workerQueue.getCompleted();
    const askForPrecomputedJob = completedJobs.filter((completedJob: any) => {
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

    const webServiceRetrieveURL = new URL(webServiceUrl);
    webServiceRetrieveURL.pathname = '/v1/retrieve-json';
    webServiceRetrieveURL.search = '';
    webServiceRetrieveURL.hash = '';
    const connectionStringURI = mongoConnectionString(tenant);
    const streamRetreiveWorflow = streamRetrieveInput
        .pipe(
            ezs('URLConnect', {
                url: webServiceRetrieveURL.toString(),
                streaming: true,
                json: true,
                encoder: 'transit',
                timeout: Number(localConfig.timeout) || 120000,
            }),
        )
        .pipe(
            ezs(async (data: any, feed: any, self: any) => {
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
    const insertCount = insertReport.reduce((a: any, b: any) => a + b, 0);
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

export const getFailureFromWebservice = async (ctx: any) => {
    const { tenant } = ctx;
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
    const job = completedJobs.filter((job: any) => {
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

const tryParseJsonString = (str: any) => {
    try {
        const parsed = JSON.parse(str);
        return parsed;
    } catch (e) {
        return str;
    }
};

export const processPrecomputed = async (precomputed: any, ctx: any) => {
    const precomputedId = precomputed._id.toString();
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
    const dataSetSize = await ctx.dataset.count();
    const databaseOutput = await ctx.dataset.find().stream();
    const databaseOutputBis = ezs('transit'); // trick: mongo stream does not propagate error in the pipeline

    const streamDatabaseExport = databaseOutput
        .on('error', (e: any) => databaseOutputBis.emit('error', e))
        .pipe(databaseOutputBis)
        .pipe(
            ezs((entry: any, feed: any, self: any) => {
                if (self.isLast()) {
                    return feed.close();
                }
                const colums: any = [];
                precomputed.sourceColumns.map((column: any) => {
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
            ezs((entry: any, feed: any, self: any) => {
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
            ezs('FILESave', {
                identifier: precomputedId,
                location: tmpDirectory,
                compress: false,
            }),
        )
        .pipe(
            ezs((entry: any, feed: any, self: any) => {
                if (self.isLast()) {
                    return feed.close();
                }
                logData = JSON.stringify({
                    level: 'ok',
                    message: `[Instance: ${ctx.tenant}] 3/10 - End compress data. Start sending file (${path.basename(entry.filename)}) to webservice`,
                    timestamp: new Date(),
                    status: IN_PROGRESS,
                });
                jobLogger.info(ctx.job, logData);
                notifyListeners(room, logData);
                feed.send(entry);
            }),
        );
    let fileDescription;
    try {
        const [file] = await streamToPromise(streamDatabaseExport);
        fileDescription = file;
    } catch (err) {
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        let msg = err.message;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        if (err.sourceError && err.sourceError.responseText) {
            const { message } = tryParseJsonString(
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                err.sourceError.responseText,
            );
            if (message) {
                msg = message.replace(/(<Error: |\[\w+\]|>+)/g, '');
            } else {
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                msg = err.sourceError.message.split('\n').shift();
            }
        }
        await ctx.precomputed.updateStatus(precomputedId, ERROR, {
            message: msg,
        });
        throw new Error(msg);
    }
    // @ts-expect-error TS(2339): Property filename does not exist on type Number
    const { size: fileSize, filename: fileToUpload } = fileDescription;
    const parameters = {
        timeout: Number(localConfig.timeout) || 120000,
        method: 'POST',
        body: createReadStream(fileToUpload),
        headers: {
            'Content-Type': 'application/x-gzip',
            'Content-Length': fileSize,
            'X-Webhook-Success': `${webhookBaseUrl}/webhook/compute_webservice/?precomputedId=${precomputedId}&tenant=${ctx.tenant}&jobId=${room}`,
            'X-Webhook-Failure': `${webhookBaseUrl}/webhook/compute_webservice/?precomputedId=${precomputedId}&tenant=${ctx.tenant}&jobId=${room}&failure`,
        },
    };
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] 4/10 - Get Token from ${precomputed.webServiceUrl}`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);

    const response = await fetch(precomputed.webServiceUrl, parameters);
    const token = await response.text();
    if (!response.ok) {
        const { type: responseErrorTitle, message: responseErrorMessage } =
            tryParseJsonString(token);
        let responseErrorMessageFull;
        if (responseErrorMessage) {
            // for error 400 see /v1/mock-error-sync
            const responseErrorMessageCleaned = responseErrorMessage.replace(
                /(<Error: |\[\w+\]|>+)/g,
                '',
            );
            responseErrorMessageFull = `${responseErrorTitle} (${responseErrorMessageCleaned})`;
        } else {
            // for error 404, 5XX, etc.
            responseErrorMessageFull = `${response.status} ${response.statusText}`;
        }
        await ctx.precomputed.updateStatus(precomputedId, ERROR, {
            message: responseErrorMessageFull,
        });
        throw new Error(responseErrorMessageFull);
    }
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

export const setPrecomputedJobId = async (
    ctx: any,
    precomputedID: any,
    job: any,
) => {
    await ctx.precomputed.updateStatus(precomputedID, PRECOMPUTED_PENDING, {
        hasData: false,
        jobId: job.id,
    });
};

export const startAskForPrecomputed = async (ctx: any) => {
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

export const startGetPrecomputed = async (ctx: any) => {
    const logger = getLogger(ctx.tenant);
    logger.info(`Precompute webhook call for ${ctx.tenant}`);

    if (ctx.job?.data?.failure !== undefined) {
        logger.info('Precompute webservice call with failure');
        await getFailureFromWebservice(ctx);
        return;
    }

    await getComputedFromWebservice(ctx);
};

export const setPrecomputedError = async (ctx: any, err: any) => {
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
    console.warn('handlePrecomputedError', err);
    notifyListeners(`${ctx.tenant}-precomputer`, {
        isPrecomputing: false,
        success: false,
        message:
            err instanceof CancelWorkerError
                ? 'cancelled_precomputer'
                : err?.message,
    });
};

export const restorePrecomputed = async (ctx: any) => {
    // mongo update all precomputed to set status to empty and clean possible data
    await ctx.precomputed.updateMany(
        {},
        {
            $set: { status: '' },
            $unset: { hasData: false, jobId: '', callId: '' },
        },
    );
};

const LISTENERS: any = [];
export const addPrecomputedJobListener = (listener: any) => {
    LISTENERS.push(listener);
};

export const notifyListeners = (room: any, payload: any) => {
    LISTENERS.forEach((listener: any) => listener({ room, data: payload }));
};
