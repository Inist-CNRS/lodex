import { ProgressStatus, sanitizeUris, TaskStatus } from '@lodex/common';
import streamToPromise from 'stream-to-promise';
import config from 'config';
import { unlinkFile } from '../fsHelpers';
import progress from '../progress';
// @ts-expect-error TS(2792): Cannot find module 'fetch-with-proxy'. Did you mea... Remove this comment to see the full error message
import fetch from 'fetch-with-proxy';
import { createReadStream } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
// @ts-expect-error TS(2792): Cannot find module 'stream-to-promise'. Did you me... Remove this comment to see the full error message
import ezs from '@ezs/core';
import { Readable } from 'stream';
import { CancelWorkerError, getOrCreateWorkerQueue } from '../../workers';
import { PRECOMPUTER } from '../../workers/precomputer';
import { jobLogger } from '../../workers/tools';
import getLogger from '../logger';
import { mongoConnectionString } from '../mongoClient';
import { addSidToUrl, ezsProtocolUrl } from '../enrichment/enrichment';

const RETRIEVE_ENTRY_POINT = 'retrieve-json'; // The path must be identical to the Web service entry point.
const tmpDirectory = path.resolve(tmpdir(), 'precomputed');
const baseURL: string = config.has('baseURL')
    ? config.get('baseURL')
    : `http://localhost:${config.get('port')}`;

const webhookBaseUrl: string = config.has('alternativePrecomputedBaseUrl')
    ? config.get('alternativePrecomputedBaseUrl')
    : baseURL;
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

// The callback's jobId is the room of the askForPrecomputed job,
// `${tenant}-precomputed-job-${job.id}`, and that job's id is the jobId the
// precomputation carries for its run (see queuePrecomputed)
export const getAskForPrecomputedJobId = (
    tenant: unknown,
    room: unknown,
): string | undefined => {
    const prefix = `${tenant}-precomputed-job-`;
    return typeof room === 'string' &&
        room.startsWith(prefix) &&
        room.length > prefix.length
        ? room.slice(prefix.length)
        : undefined;
};

// The answer of a run that was relaunched since (after the response timeout,
// by the site generation or by hand) must not overwrite the current run. A
// precomputation or a room without a jobId (older ones) takes any answer.
export const isSupersededAnswer = (
    tenant: string,
    precomputed: { jobId?: unknown },
    askForPrecomputedJobId: unknown,
) => {
    const answerJobId = getAskForPrecomputedJobId(
        tenant,
        askForPrecomputedJobId,
    );
    return (
        precomputed.jobId != null &&
        answerJobId !== undefined &&
        String(precomputed.jobId) !== answerJobId
    );
};

// The jobId the precomputation carries while this job belongs to its current
// run: the askForPrecomputed job's own id (see queuePrecomputed), or, for a
// web service answer, the id of the job that asked for it
const getRunJobId = (ctx: any): string | undefined => {
    const job = ctx.job;
    if (job?.data?.action === 'getPrecomputed') {
        return getAskForPrecomputedJobId(
            ctx.tenant,
            job.data.askForPrecomputedJobId,
        );
    }
    const jobId = job?.opts?.jobId ?? job?.id;
    return jobId === undefined || jobId === null ? undefined : String(jobId);
};

// Writes the status only while this job belongs to the current run: false
// when a relaunch superseded it
const updateStatusOfRun = async (
    ctx: any,
    id: unknown,
    status: string,
    data?: Record<string, unknown>,
): Promise<boolean> => {
    const jobId = getRunJobId(ctx);
    if (jobId === undefined) {
        await ctx.precomputed.updateStatus(id, status, data);
        return true;
    }
    return ctx.precomputed.updateStatusOfJob(id, jobId, status, data);
};

export const getComputedFromWebservice = async (ctx: any) => {
    const tenant = ctx.tenant;
    const { id: precomputedId, callId, askForPrecomputedJobId } = ctx.job.data;

    const precomputed = await ctx.precomputed.findOneById(precomputedId);
    if (
        !precomputed ||
        precomputed.status === TaskStatus.CANCELED ||
        isSupersededAnswer(tenant, precomputed, askForPrecomputedJobId)
    ) {
        // Entry may have been deleted, cancelled or relaunched before the
        // webservice called us back. We ignore the reply in that case.
        return;
    }

    const { webServiceUrl, name: precomputedName } = precomputed;
    progress.initialize(tenant);
    progress.start(ctx.tenant, {
        status: ProgressStatus.PRECOMPUTING,
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
    const workerQueue = getOrCreateWorkerQueue(tenant, 1);
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
    await updateStatusOfRun(ctx, precomputedId, TaskStatus.IN_PROGRESS);
    let logData = {};
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${tenant}] 7/10 - Response ok`,
        timestamp: new Date(),
        status: TaskStatus.IN_PROGRESS,
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
        status: TaskStatus.IN_PROGRESS,
    });
    jobLogger.info(askForPrecomputedJob, logData);
    notifyListeners(room, logData);

    const webServiceRetrieveURL = new URL(
        addSidToUrl(ezsProtocolUrl(webServiceUrl), `lodex-${tenant}`),
    );
    webServiceRetrieveURL.pathname = path.join(
        path.dirname(webServiceRetrieveURL.pathname),
        RETRIEVE_ENTRY_POINT,
    );
    webServiceRetrieveURL.search = '';
    webServiceRetrieveURL.hash = '';
    const importedDate = new Date();
    const connectionStringURI = mongoConnectionString(tenant);
    const streamRetreiveWorflow = streamRetrieveInput
        .pipe(
            ezs('URLConnect', {
                url: webServiceRetrieveURL.toString(),
                streaming: config.get('streaming'),
                json: true,
                encoder: 'transit',
                timeout: config.get('timeout'),
            }),
        )
        .pipe(
            ezs(async (data: any, feed: any, self: any) => {
                if (self.isFirst()) {
                    progress.setProgress(tenant, 85);
                }
                if (self.isLast()) {
                    progress.setProgress(tenant, 95);
                    await updateStatusOfRun(
                        ctx,
                        precomputedId,
                        TaskStatus.FINISHED,
                        { hasData: true },
                    );
                    return feed.close();
                }
                feed.send(data);
            }),
        )
        .pipe(
            ezs('assign', {
                path: [
                    'lodexStamp.importedDate',
                    'lodexStamp.precomputedId',
                    'lodexStamp.webServiceURL',
                ],
                value: [
                    importedDate.toDateString(),
                    precomputedId,
                    addSidToUrl(
                        ezsProtocolUrl(webServiceUrl),
                        `lodex-${tenant}`,
                    ),
                ],
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
        status: TaskStatus.IN_PROGRESS,
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
        status: TaskStatus.FINISHED,
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
    const precomputed = await ctx.precomputed.findOneById(precomputedId);
    if (
        precomputed &&
        isSupersededAnswer(tenant, precomputed, askForPrecomputedJobId)
    ) {
        return;
    }
    const workerQueue = getOrCreateWorkerQueue(tenant, 1);
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

    if (
        await updateStatusOfRun(ctx, precomputedId, TaskStatus.ERROR, {
            message: error.message,
        })
    ) {
        await ctx.precomputed.updateStartedAt(precomputedId, null);
    }

    job.progress(100);
    progress.finish(tenant);
    const logData = JSON.stringify({
        level: 'error',
        message: `[Instance: ${tenant}] 7/10 - Response not ok ${error.type} ${error.message}`,
        timestamp: new Date(),
        status: TaskStatus.ERROR,
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

// The id is the uri of the published resource (the import uri, prefixed by
// `uid:/` at publication), so the results can be joined with publishedDataset.
export const toPrecomputedEntry = (entry: any, sourceColumns: string[]) => {
    const columns = sourceColumns.map((column) => entry[column]);
    return {
        id: sanitizeUris({ uri: entry.uri }).uri,
        value: tryParseJsonString(columns.length > 1 ? columns : columns[0]),
        name: sourceColumns, // special case, see vectors.ini
    };
};

export const processPrecomputed = async (precomputed: any, ctx: any) => {
    const precomputedId = precomputed._id.toString();
    let logData = {};
    const isCurrentRun = await updateStatusOfRun(
        ctx,
        precomputed._id,
        TaskStatus.IN_PROGRESS,
        {
            hasData: false,
            sentAt: null,
            answeredAt: null,
        },
    );
    if (!isCurrentRun) {
        // a stalled rerun of a job superseded by a relaunch: the current run
        // asks the web service, this one must not
        return;
    }
    await ctx.precomputed.updateStartedAt(precomputed._id, new Date());

    const room = `${ctx.tenant}-precomputed-job-${ctx.job.id}`;
    progress.setProgress(ctx.tenant, 10);
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] 2/10 - Start building compress data`,
        timestamp: new Date(),
        status: TaskStatus.IN_PROGRESS,
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
                feed.send(toPrecomputedEntry(entry, precomputed.sourceColumns));
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
                    status: TaskStatus.IN_PROGRESS,
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
        await updateStatusOfRun(ctx, precomputedId, TaskStatus.ERROR, {
            message: msg,
        });
        throw new Error(msg);
    }
    // @ts-expect-error TS(2339): Property filename does not exist on type Number
    const { size: fileSize, filename: fileToUpload } = fileDescription;
    const parameters = {
        timeout: config.get('timeout'),
        method: 'POST',
        body: createReadStream(fileToUpload),
        headers: {
            'Content-Type': 'application/x-gzip',
            'Content-Length': fileSize,
            'X-Webhook-Success': `${webhookBaseUrl}/webhook/compute_webservice/?precomputedId=${precomputedId}&tenant=${ctx.tenant}&jobId=${room}`,
            'X-Webhook-Failure': `${webhookBaseUrl}/webhook/compute_webservice/?precomputedId=${precomputedId}&tenant=${ctx.tenant}&jobId=${room}&failure`,
        },
    };
    const webServicePrecomputedURL = addSidToUrl(
        ezsProtocolUrl(precomputed.webServiceUrl),
        `lodex-${ctx.tenant}`,
    );
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] 4/10 - Get Token from ${webServicePrecomputedURL}`,
        timestamp: new Date(),
        status: TaskStatus.IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);

    const response = await fetch(webServicePrecomputedURL, parameters);
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
        await updateStatusOfRun(ctx, precomputedId, TaskStatus.ERROR, {
            message: responseErrorMessageFull,
        });
        throw new Error(responseErrorMessageFull);
    }
    await updateStatusOfRun(ctx, precomputed._id, TaskStatus.ON_HOLD, {
        hasData: false,
        callId: token,
        sentAt: new Date(),
    });
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] 5/10 - Token obtained : ${token}`,
        timestamp: new Date(),
        status: TaskStatus.ON_HOLD,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    progress.setProgress(ctx.tenant, 50);

    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] 6/10 - Waiting for response data on ${webhookBaseUrl}`,
        timestamp: new Date(),
        status: TaskStatus.ON_HOLD,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
};

// A stalled rerun (Bull runs a job again when its lock expires) of a job
// relaunched or stopped since: the current run, if any, owns the status and
// the progress
const isStaleRun = (ctx: any, precomputed: any) => {
    if (precomputed.status === TaskStatus.CANCELED) {
        return true;
    }
    const runJobId = getRunJobId(ctx);
    return (
        precomputed.jobId != null &&
        runJobId !== undefined &&
        String(precomputed.jobId) !== runJobId
    );
};

export const startAskForPrecomputed = async (ctx: any) => {
    const id = ctx.job?.data?.id;
    const precomputed = await ctx.precomputed.findOneById(id);
    if (!precomputed || isStaleRun(ctx, precomputed)) {
        getLogger(ctx.tenant).warn(
            `Precomputation ${id}: job ${ctx.job?.id} skipped, it is not the current run anymore`,
        );
        return;
    }
    progress.initialize(ctx.tenant);
    progress.start(ctx.tenant, {
        status: ProgressStatus.PRECOMPUTING,
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
        status: TaskStatus.IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    await processPrecomputed(precomputed, ctx);
};

export const startGetPrecomputed = async (ctx: any) => {
    const logger = getLogger(ctx.tenant);
    logger.debug(`Precompute webhook call for ${ctx.tenant}`);

    if (ctx.job?.data?.failure !== undefined) {
        logger.debug('Precompute webservice call with failure');
        await getFailureFromWebservice(ctx);
        return;
    }

    await getComputedFromWebservice(ctx);
};

export const setPrecomputedError = async (ctx: any, err: any) => {
    const id = ctx.job?.data?.id;
    const isCurrentRun = await updateStatusOfRun(
        ctx,
        id,
        err instanceof CancelWorkerError
            ? TaskStatus.CANCELED
            : TaskStatus.ERROR,
        {
            message: err?.message,
        },
    );
    if (!isCurrentRun) {
        // the progress and the notifications belong to the current run
        return;
    }
    await ctx.precomputed.updateStartedAt(id, null);

    const room = `precomputed-job-${ctx.job.id}`;
    const logData = JSON.stringify({
        level: 'error',
        message:
            err instanceof CancelWorkerError
                ? `[Instance: ${ctx.tenant}] ${err?.message}`
                : `[Instance: ${ctx.tenant}] Precomputing errored : ${err?.message}`,
        timestamp: new Date(),
        status:
            err instanceof CancelWorkerError
                ? TaskStatus.CANCELED
                : TaskStatus.ERROR,
    });
    ctx.job.progress(100);
    progress.finish(ctx.tenant);
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    const logger = getLogger(ctx.tenant);
    logger.warn('handlePrecomputedError', err);
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

export const removePrecomputedJobListener = (listener: any) => {
    const index = LISTENERS.indexOf(listener);
    if (index !== -1) {
        LISTENERS.splice(index, 1);
    }
};

export const notifyListeners = (room: any, payload: any) => {
    LISTENERS.forEach((listener: any) => listener({ room, data: payload }));
};
