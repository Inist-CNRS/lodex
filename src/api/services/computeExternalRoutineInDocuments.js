import fetch from 'fetch-with-proxy';
import getDocumentTransformer from './getDocumentTransformer';
import transformAllDocuments from './transformAllDocuments';
import progress from './progress';
import { PRECOMPUTE_ROUTINES } from '../../common/progressStatus';
import logger from './logger';
import { getHost } from '../../common/uris';
import { mongoConnectionString } from './mongoClient';
import { jobLogger } from '../workers/tools';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

export const versionTransformerDecorator = (
    tenant,
    transformDocument,
) => async document => {
    const doc = await transformDocument(document);
    const precomputedDoc = {};
    for (const field of Object.keys(doc)) {
        const webServiceField = doc[field];
        const {
            webServiceBaseURL,
            webServiceName,
            routineFields,
        } = extractPartsOfWebservice(webServiceField);
        const { fileName } = await getFielsArchiveFromUrl(
            tenant,
            routineFields,
        );
        const callId = await getTokenFromWebservice(
            webServiceBaseURL,
            webServiceName,
            fileName,
            tenant,
        );

        precomputedDoc[field] = callId;
    }
    return {
        uri: document.uri,
        versions: [
            {
                ...precomputedDoc,
            },
        ],
    };
};

const baseUrl = getHost();
//Warning : This have to be done better for dev env
const webhookBaseUrl =
    process.env.NODE_ENV === 'development'
        ? 'https://6b5f-2a01-e0a-c74-5540-7c23-4d46-7137-c866.ngrok-free.app'
        : baseUrl;

export const extractPartsOfWebservice = webServiceField => {
    const url = new URL(webServiceField);
    const [version, routineName, ...routineFields] = url.pathname
        .split('/')
        .filter(field => !!field);
    return {
        webServiceBaseURL: `${url.origin}/${version}/`,
        webServiceName: routineName,
        routineFields,
    };
};

export const getFielsArchiveFromUrl = async (
    tenant,
    fields,
    url = `${process.env.WORKERS_URL ||
        'http://localhost:31976'}/exporters/bundle`,
) => {
    const body = JSON.stringify({
        field: fields,
        connectionStringURI: mongoConnectionString(tenant),
        host: baseUrl,
    });

    const response = await fetch(url, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
    });

    const tar = response.body;

    const pipe = promisify(pipeline);
    const fileName = `./webservice_temp/__entry_${tenant}_${Date.now().toString()}.tar.gz`;
    await pipe(tar, fs.createWriteStream(fileName));

    return { tar, fileName };
};

export const getTokenFromWebservice = async (
    webServiceBaseURL,
    webServiceName,
    fileName,
    tenant,
) => {
    const response = await fetch(`${webServiceBaseURL}${webServiceName}`, {
        method: 'POST',
        body: fs.createReadStream(fileName),
        headers: {
            'Content-Type': 'application/gzip',
            'X-Hook': `${webhookBaseUrl}/webhook/compute_webservice/?webServiceBaseURL=${webServiceBaseURL}&tenant=${tenant}`,
        },
    });

    if (response.status != 200) {
        throw new Error('Calling token webservice error');
    }

    const callId = JSON.stringify(await response.json());

    fs.unlink(fileName, error => {
        if (error) {
            throw error;
        }
    });

    return callId;
};

export const getComputedFromWebservice = (
    tenant,
    webServiceBaseURL,
    callId,
) => {
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
            logger.error('Retrieve is not ready', callId);
            logger.error(error);
        });
};

export const computeExternalRoutineInDocumentsFactory = ({
    versionTransformerDecorator,
    getDocumentTransformer,
    transformAllDocuments,
}) => async (ctx, count, fields) => {
    if (!ctx.job) {
        logger.error('Job is not defined');
        return;
    }
    jobLogger.info(ctx.job, 'Pre-compute routines');

    const transformMainResourceDocument = getDocumentTransformer(
        ctx.dataset.findBy,
        fields,
    );

    progress.start(ctx.tenant, {
        status: PRECOMPUTE_ROUTINES,
        target: count,
        label: 'publishing',
        type: 'publisher',
    });

    await transformAllDocuments(
        count,
        ctx.dataset.findLimitFromSkip,
        ctx.publishedDataset.updateBatch,
        versionTransformerDecorator(ctx.tenant, transformMainResourceDocument),
        undefined,
        ctx.job,
    );

    ctx.job.isActive()
        ? jobLogger.info(ctx.job, 'Webservice fields computed')
        : jobLogger.error(ctx.job, 'Webservice fields cancelled');
};

export default computeExternalRoutineInDocumentsFactory({
    versionTransformerDecorator,
    getDocumentTransformer,
    transformAllDocuments,
});
