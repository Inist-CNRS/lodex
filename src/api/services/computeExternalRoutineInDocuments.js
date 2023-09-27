import omit from 'lodash.omit';

import getDocumentTransformer from './getDocumentTransformer';
import transformAllDocuments from './transformAllDocuments';
import progress from './progress';
import { PRECOMPUTE_ROUTINES } from '../../common/progressStatus';
import logger from './logger';
import { jobLogger } from '../workers/tools';

export const versionTransformerDecorator = transformDocument => async document => {
    console.warn(
        '*************** versionTransformerDecorator *******************',
    );
    console.warn('--vTD--', document.uri, document.Title);
    const doc = await transformDocument(document);
    console.warn(doc);
    console.warn('--end doc--');

    return {
        uri: document.uri,
        versions: [
            {
                ...doc,
                BPRp: `test-${doc['BPRp']}`,
            },
        ],
    };
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
        versionTransformerDecorator(transformMainResourceDocument),
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
