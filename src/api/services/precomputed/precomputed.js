import progress from '../progress';
import localConfig from '../../../../config.json';
import { getHost } from '../../../common/uris';
import tar from 'tar-stream';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

import {
    PENDING as PRECOMPUTED_PENDING,
    IN_PROGRESS,
    FINISHED,
    ERROR,
    CANCELED,
} from '../../../common/taskStatus';
import { PRECOMPUTING, PENDING } from '../../../common/progressStatus';
import { jobLogger } from '../../workers/tools';
import { CancelWorkerError } from '../../workers';
import getLogger from '../logger';

const baseUrl = getHost();
//Warning : This have to be done better for dev env
const webhookBaseUrl =
    process.env.NODE_ENV === 'development'
        ? 'https://57db-81-250-164-94.ngrok-free.app'
        : baseUrl;

const { precomputedBatchSize: BATCH_SIZE = 10 } = localConfig;

export const getPrecomputedDataPreview = async ctx => {
    const { sourceColumns } = ctx.request.body;
    if (!sourceColumns) {
        throw new Error(`Missing parameters`);
    }

    const excerptLines = await ctx.dataset.getExcerpt(
        sourceColumns && sourceColumns.length
            ? { [sourceColumns[0]]: { $ne: null } }
            : {},
    );
    let result = [];
    try {
        for (
            let index = 0;
            index < Math.min(excerptLines.length, BATCH_SIZE);
            index += 1
        ) {
            const entry = {};
            sourceColumns.map(column => {
                entry[column] = excerptLines[index][column];
            });
            result.push(entry);
        }
    } catch (error) {
        const logger = getLogger(ctx.tenant);
        logger.error(`Error while processing precomputed preview`, error);
        return [];
    }
    return result;
};

const processZippedData = async (precomputed, ctx) => {
    const initDate = new Date();
    const pack = tar.pack();
    const dataSetSize = await ctx.dataset.count();
    for (
        let indexDataset = 0;
        indexDataset < dataSetSize;
        indexDataset += BATCH_SIZE
    ) {
        /* if (!(await ctx.job?.isActive())) {
            throw new CancelWorkerError('Job has been canceled');
        }*/
        const entries = await ctx.dataset
            .find()
            .skip(indexDataset)
            .limit(BATCH_SIZE)
            .toArray();

        for (const [indexBatch, entry] of entries.entries()) {
            const colums = [];
            precomputed.sourceColumns.map(column => {
                colums.push(entry[column]);
            });
            await pack.entry(
                {
                    name: `data/${'f' +
                        (indexDataset + indexBatch + 1)
                            .toString()
                            .padStart(10, 0)}.json`,
                },
                JSON.stringify({
                    id: entry.uri,
                    value: colums.length > 1 ? colums : colums[0],
                }),
            );
        }
    }

    const endDate = new Date();
    await pack.entry(
        { name: `manifest.json` },
        JSON.stringify({
            creationDate: endDate.toGMTString(),
            updateDate: endDate.toGMTString(),
            itemsCounter: dataSetSize,
            processingMSTime: endDate - initDate,
            version: '1',
            generator: 'lodex',
        }),
    );

    await pack.finalize();

    const pipe = promisify(pipeline);
    const fileName = `./webservice_temp/__entry_${
        ctx.tenant
    }_${Date.now().toString()}.tar.gz`;
    await pipe(pack, fs.createWriteStream(fileName));

    return fileName;
};

export const getTokenFromWebservice = async (
    webServiceUrl,
    precomputedId,
    fileName,
    tenant,
    jobId,
) => {
    //TODO
    console.log('*********** Call token start *****************');
    console.log('precomputedId:', precomputedId.toString());
    console.log('fileName:', fileName);
    console.log('tenant:', tenant);
    console.log('jobId:', jobId);
    const response = await fetch(webServiceUrl, {
        method: 'POST',
        body: fs.createReadStream(fileName),
        headers: {
            'Content-Type': 'application/gzip',
            'X-Hook': `${webhookBaseUrl}/webhook/compute_webservice/?precomputedId=${precomputedId}&tenant=${tenant}&jobId=${jobId}`,
        },
    });
    console.log('*********** Call token done *****************');
    if (response.status != 200) {
        console.log('*********** Call token error *****************');
        console.log(response);
        throw new Error('Calling token webservice error');
    }

    const callId = JSON.stringify(await response.json());
    //TODO
    /*fs.unlink(fileName, error => {
        if (error) {
            throw error;
        }
    });*/

    return callId;
};

export const getComputedFromWebservice = (
    ctx,
    tenant,
    precomputedId,
    callId,
    jobId,
) => {
    const webServiceBaseURL = 'https://data-computer.services.istex.fr/v1/';
    const room = `${tenant}-precomputed-job-${jobId}`;

    fetch(`${webServiceBaseURL}retrieve`, {
        method: 'POST',
        body: callId,
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => {
            if (response.status === 200) {
                const tar = response.body;

                const pipeComputed = promisify(pipeline);
                pipeComputed(
                    tar,
                    fs.createWriteStream(
                        `./webservice_temp/__computed_${tenant}_${Date.now().toString()}.tar.gz`,
                    ),
                );
            }
        })
        .catch(error => {
            const logData = JSON.stringify({
                level: 'error',
                message: `[Instance: ${tenant}] Retrieve is not ready  ${error?.message}`,
                timestamp: new Date(),
                status: IN_PROGRESS,
            });
            jobLogger.info(jobId, logData);
            notifyListeners(room, logData);
        });
};

export const processPrecomputed = async (precomputed, ctx) => {
    let logData = {};
    await ctx.precomputed.updateStatus(precomputed._id, IN_PROGRESS);

    let errorCount = 0;

    const room = `${ctx.tenant}-precomputed-job-${ctx.job.id}`;

    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] Building entry data`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    const entryFileName = await processZippedData(precomputed, ctx);
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] Entry data built`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    progress.incrementProgress(ctx.tenant, 20);

    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] Calling webservice [${precomputed.webServiceUrl}]`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    const token = await getTokenFromWebservice(
        precomputed.webServiceUrl,
        precomputed._id.toString(),
        entryFileName,
        ctx.tenant,
        room,
        ctx.job.id,
    );
    await ctx.precomputed.updateStatus(precomputed._id, IN_PROGRESS, {
        callId: token,
    });
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] Webservice response token obtained`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    progress.incrementProgress(ctx.tenant, 50);

    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] Waiting for response data`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    await ctx.precomputed.updateStatus(precomputed._id, FINISHED, {
        errorCount,
    });
    progress.finish(ctx.tenant);
    logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] Precomputing data finished`,
        timestamp: new Date(),
        status: FINISHED,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
};

export const setPrecomputedJobId = async (ctx, precomputedID, job) => {
    await ctx.precomputed.updateStatus(precomputedID, PRECOMPUTED_PENDING, {
        jobId: job.id,
    });
};

export const startPrecomputed = async ctx => {
    const id = ctx.job?.data?.id;
    const precomputed = await ctx.precomputed.findOneById(id);

    if (progress.getProgress(ctx.tenant).status === PENDING) {
        progress.start(ctx.tenant, {
            status: PRECOMPUTING,
            target: 100,
            label: 'PRECOMPUTING',
            subLabel: precomputed.name,
            type: 'precomputer',
        });
    }
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

export const setPrecomputedError = async (ctx, err) => {
    const id = ctx.job?.data?.id;
    await ctx.precomputed.updateStatus(
        id,
        err instanceof CancelWorkerError ? CANCELED : ERROR,
        {
            message: err?.message,
        },
    );

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

const LISTENERS = [];
export const addPrecomputedJobListener = listener => {
    LISTENERS.push(listener);
};

export const notifyListeners = (room, payload) => {
    LISTENERS.forEach(listener => listener({ room, data: payload }));
};
