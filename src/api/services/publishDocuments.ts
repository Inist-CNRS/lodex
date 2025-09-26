// @ts-expect-error TS(2792): Cannot find module 'lodash/omit'. Did you mean to ... Remove this comment to see the full error message
import omit from 'lodash/omit';
// @ts-expect-error TS(2792): Cannot find module 'lodash/get'. Did you mean to s... Remove this comment to see the full error message
import get from 'lodash/get';

import getDocumentTransformer from './getDocumentTransformer';
import transformAllDocuments from './transformAllDocuments';
import progress from './progress';
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { PUBLISH_DOCUMENT } from '../../common/progressStatus';
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { URI_FIELD_NAME } from '../../common/uris';
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { SCOPE_COLLECTION, SCOPE_DOCUMENT } from '../../common/scope';
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import parseValue from '../../common/tools/parseValue';
import { jobLogger } from '../workers/tools';
import getLogger from './logger';

export const versionTransformerDecorator =
    (transformDocument: any, subresourceId = null, hiddenResources = null) =>
    async (document: any, _: any, __: any, publicationDate = new Date()) => {
        const doc = await transformDocument(document);
        // @ts-expect-error TS(2339): Property 'find' does not exist on type 'never'.
        const hiddenResource = hiddenResources?.find(
            (hidden: any) => hidden.uri === doc.uri,
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

const groupSubresourcesById = (subresources: any) =>
    subresources.reduce(
        // @ts-expect-error TS(7006): Parameter 'acc' implicitly has an 'any' type.
        (acc, subresource) => ({
            ...acc,
            [subresource._id]: subresource,
        }),
        {},
    );

const groupSubresourceFields = (fields: any) =>
    fields.reduce((acc: any, field: any) => {
        if (!acc[field.subresourceId]) {
            acc[field.subresourceId] = [];
        }

        acc[field.subresourceId].push(field);
        return acc;
    }, {});

export const getFieldsFromSubresourceFields = (
    subresourceFields: any,
    removeFirstColumnTransformer: any,
) => {
    return subresourceFields.map((sf: any) => ({
        ...sf,

        transformers: removeFirstColumnTransformer
            ? sf.transformers[0].operation === 'COLUMN'
                ? sf.transformers.slice(1)
                : sf.transformers
            : sf.transformers,
    }));
};

const getSubresourceTransformer = (
    ctx: any,
    subresourceFields: any,
    removeFirstColumnTransformer = false,
) => {
    const fields = getFieldsFromSubresourceFields(
        subresourceFields,
        removeFirstColumnTransformer,
    );

    return getDocumentTransformer(
        ctx.dataset.findBy,
        fields.map((field: any) =>
            field.name.endsWith('_uri')
                ? { ...field, position: 0, name: 'uri' }
                : field,
        ),
    );
};

export const publishDocumentsFactory =
    ({
        versionTransformerDecorator,
        getDocumentTransformer,
        transformAllDocuments,
    }: any) =>
    async (ctx: any, count: any, fields: any) => {
        if (!ctx.job) {
            const logger = getLogger(ctx.tenant);
            logger.error(`Job is not defined`);
            return;
        }
        jobLogger.info(ctx.job, 'Publishing documents');
        const mainResourceFields = fields
            .filter(
                (c: any) =>
                    (c.scope === SCOPE_COLLECTION ||
                        c.scope === SCOPE_DOCUMENT) &&
                    !c.subresourceId,
            )
            .map((field: any) => {
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
            (c: any) =>
                (c.scope === SCOPE_COLLECTION || c.scope === SCOPE_DOCUMENT) &&
                c.subresourceId,
        );

        const subresources = groupSubresourcesById(
            await ctx.subresource.findAll(),
        );
        const groupedSubresourceFields =
            groupSubresourceFields(subresourceFields);
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
            Object.keys(groupedSubresourceFields).map((subresourceId: any) => {
                const subresourceFields =
                    groupedSubresourceFields[subresourceId];
                const subresource = subresources[subresourceId];

                const datasetChunkExtractor = (dataset: any) =>
                    dataset.reduce((acc: any, curr: any) => {
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
                                ...data.map((d: any) =>
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
                    (x: any) => x, // disable default transformer (do it in extractor)
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
