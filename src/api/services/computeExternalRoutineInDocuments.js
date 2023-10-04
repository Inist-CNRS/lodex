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
        const { fileName } = await getTarFromUrl(tenant, routineFields);
        const computed = await getComputedFromWebservice(
            webServiceBaseURL,
            webServiceName,
            fileName,
        );
        precomputedDoc[field] = webServiceName;
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

export const getTarFromUrl = async (
    tenant,
    fields,
    url = `${process.env.WORKERS_URL ||
        'http://localhost:31976'}/exporters/bundle`,
) => {
    try {
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
    } catch (err) {
        console.error('**** Building tar archive error *****');
        console.error(err);
    }
};

export const getComputedFromWebservice = async (
    webServiceBaseURL,
    webServiceName,
    fileName,
) => {
    try {
        const responseCall = await fetch(
            `${webServiceBaseURL}${webServiceName}`,
            {
                method: 'POST',
                body: fs.createReadStream(fileName),
                headers: { 'Content-Type': 'application/gzip' },
            },
        );

        fs.unlink(fileName, error => {
            if (error) {
                throw error;
            }
        });

        if (responseCall.status !== 200) {
            throw new Error(responseCall.message);
        }
        const callId = JSON.stringify(await responseCall.json());

        await new Promise(resolve => setTimeout(resolve, 10000));

        console.log('***** getComputedFromWebservice ******');
        const responseResult = await fetch(`${webServiceBaseURL}retrieve`, {
            method: 'POST',
            body: callId,
            headers: { 'Content-Type': 'application/json' },
        });

        const tar = responseResult.body;
        console.log(responseResult.status);
        //console.log(tar);

        const pipeComputed = promisify(pipeline);
        await pipeComputed(
            tar,
            fs.createWriteStream(
                `./webservice_temp/__computed_${Date.now().toString()}.tar.gz`,
            ),
        );
    } catch (err) {
        console.error('**** Calling webservice error *****');
        console.error(err);
    }
    return 'bill';
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
