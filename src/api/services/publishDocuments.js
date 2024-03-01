import omit from 'lodash/omit';
import get from 'lodash/get';

import getDocumentTransformer from './getDocumentTransformer';
import transformAllDocuments from './transformAllDocuments';
import progress from './progress';
import { PUBLISH_DOCUMENT } from '../../common/progressStatus';
import { URI_FIELD_NAME } from '../../common/uris';
import { SCOPE_COLLECTION, SCOPE_DOCUMENT } from '../../common/scope';
import parseValue from '../../common/tools/parseValue';
import { jobLogger } from '../workers/tools';
import getLogger from './logger';

export const versionTransformerDecorator = (
    transformDocument,
    subresourceId = null,
    hiddenResources = null,
) => async (document, _, __, publicationDate = new Date()) => {
    const doc = await transformDocument(document);
    const hiddenResource = hiddenResources?.find(
        hidden => hidden.uri === doc.uri,
    );

    return {
        ...hiddenResource,
        uri: doc.uri,
        subresourceId,
        versions: [
            {
                ...omit(doc, ['uri']),
                publicationDate,
            },
        ],
    };
};

const groupSubresourcesById = subresources =>
    subresources.reduce(
        (acc, subresource) => ({
            ...acc,
            [subresource._id]: subresource,
        }),
        {},
    );

const groupSubresourceFields = fields =>
    fields.reduce((acc, field) => {
        if (!acc[field.subresourceId]) {
            acc[field.subresourceId] = [];
        }

        acc[field.subresourceId].push(field);
        return acc;
    }, {});

export const getFieldsFromSubresourceFields = (
    subresourceFields,
    removeFirstColumnTransformer,
) => {
    return subresourceFields.map(sf => ({
        ...sf,
        transformers: removeFirstColumnTransformer
            ? sf.transformers[0].operation === 'COLUMN'
                ? sf.transformers.slice(1)
                : sf.transformers
            : sf.transformers,
    }));
};

const getSubresourceTransformer = (
    ctx,
    subresourceFields,
    removeFirstColumnTransformer = false,
) => {
    const fields = getFieldsFromSubresourceFields(
        subresourceFields,
        removeFirstColumnTransformer,
    );

    return getDocumentTransformer(
        ctx.dataset.findBy,
        fields.map(field =>
            field.name.endsWith('_uri')
                ? { ...field, position: 0, name: 'uri' }
                : field,
        ),
    );
};

export const publishDocumentsFactory = ({
    versionTransformerDecorator,
    getDocumentTransformer,
    transformAllDocuments,
}) => async (ctx, count, fields) => {
    if (!ctx.job) {
        const logger = getLogger(ctx.tenant);
        logger.error(`Job is not defined`);
        return;
    }
    jobLogger.info(ctx.job, 'Publishing documents');
    const mainResourceFields = fields
        .filter(
            c =>
                (c.scope === SCOPE_COLLECTION || c.scope === SCOPE_DOCUMENT) &&
                !c.subresourceId,
        )
        .map(field => {
            // Replace uri field transformer to take value "as it"
            // Uri has already been generated during dataset import
            if (field.name === URI_FIELD_NAME) {
                return {
                    ...field,
                    transformers: [
                        {
                            operation: 'COLUMN',
                            args: [
                                {
                                    name: 'column',
                                    type: 'column',
                                    value: 'uri',
                                },
                            ],
                        },
                    ],
                };
            }

            return field;
        });

    const subresourceFields = fields.filter(
        c =>
            (c.scope === SCOPE_COLLECTION || c.scope === SCOPE_DOCUMENT) &&
            c.subresourceId,
    );

    const subresources = groupSubresourcesById(await ctx.subresource.findAll());
    const groupedSubresourceFields = groupSubresourceFields(subresourceFields);
    const hiddenResources = await ctx.hiddenResource.findAll();

    const transformMainResourceDocument = getDocumentTransformer(
        ctx.dataset.findBy,
        mainResourceFields,
    );

    progress.start(ctx.tenant, {
        status: PUBLISH_DOCUMENT,
        target: count,
        label: 'publishing',
        type: 'publisher',
    });

    await Promise.all(
        Object.keys(groupedSubresourceFields).map(subresourceId => {
            const subresourceFields = groupedSubresourceFields[subresourceId];
            const subresource = subresources[subresourceId];

            const datasetChunkExtractor = dataset =>
                dataset.reduce((acc, curr) => {
                    let data;

                    try {
                        data = parseValue(get(curr, subresource.path));
                    } catch (e) {
                        return acc;
                    }

                    // Remove empty subresource
                    if (!data) {
                        return acc;
                    }

                    if (Array.isArray(data)) {
                        return [
                            ...acc,
                            ...data.map(d =>
                                versionTransformerDecorator(
                                    getSubresourceTransformer(
                                        ctx,
                                        subresourceFields,
                                        true,
                                    ),
                                    subresourceId,
                                    hiddenResources,
                                )(JSON.stringify(d)),
                            ),
                        ];
                    }

                    return [
                        ...acc,
                        versionTransformerDecorator(
                            getSubresourceTransformer(
                                ctx,
                                subresourceFields,
                                false,
                            ),
                            subresourceId,
                            hiddenResources,
                        )(curr),
                    ];
                }, []);

            return transformAllDocuments(
                count,
                ctx.dataset.findLimitFromSkip,
                ctx.publishedDataset.insertBatchIgnoreDuplicate,
                x => x, // disable default transformer (do it in extractor)
                datasetChunkExtractor,
                ctx.job,
            );
        }),
    );

    await transformAllDocuments(
        count,
        ctx.dataset.findLimitFromSkip,
        ctx.publishedDataset.insertBatch,
        versionTransformerDecorator(
            transformMainResourceDocument,
            null,
            hiddenResources,
        ),
        undefined,
        ctx.job,
    );

    ctx.job.isActive()
        ? jobLogger.info(ctx.job, 'Documents published')
        : jobLogger.error(ctx.job, 'Publication cancelled');
};

export default publishDocumentsFactory({
    versionTransformerDecorator,
    getDocumentTransformer,
    transformAllDocuments,
});
