import fetch from 'fetch-with-proxy';
import getDocumentTransformer from './getDocumentTransformer';
import transformAllDocuments from './transformAllDocuments';
import progress from './progress';
import { PRECOMPUTE_ROUTINES } from '../../common/progressStatus';
import logger from './logger';
import { getHost } from '../../common/uris';
import { mongoConnectionString } from './mongoClient';
import { jobLogger } from '../workers/tools';

export const versionTransformerDecorator = (
    tenant,
    transformDocument,
) => async document => {
    const doc = await transformDocument(document);
    const precomputedDoc = {};
    for (const field of Object.keys(doc)) {
        const webServiceURL = doc[field];
        const routineFields = getRoutineFields(webServiceURL);
        const tarToCompute = await getTarFromUrl(tenant, routineFields);

        precomputedDoc[field] = webServiceURL;
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

export const getRoutineFields = path => {
    const url = new URL(path);
    return url.pathname.split('/').filter(field => !!field);
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

        return response.body;
    } catch (err) {
        console.error('**** Building tar archive error *****');
        console.error(err);
    }
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
