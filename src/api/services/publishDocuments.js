import omit from 'lodash.omit';
import get from 'lodash.get';

import getDocumentTransformer from './getDocumentTransformer';
import transformAllDocuments from './transformAllDocuments';
import progress from './progress';
import { PUBLISH_DOCUMENT } from '../../common/progressStatus';
import { URI_FIELD_NAME } from '../../common/uris';

export const versionTransformerDecorator = (
    transformDocument,
    subresourceId = null,
) => async (document, _, __, publicationDate = new Date()) => {
    const doc = await transformDocument(document);

    return {
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

const getSubresourceTransformer = (
    ctx,
    subresourceFields,
    removeFirstTransformer = false,
) => {
    const fields = subresourceFields.map(sf => ({
        ...sf,
        transformers: removeFirstTransformer
            ? sf.transformers.slice(1)
            : sf.transformers,
    }));

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
    const mainResourceFields = fields
        .filter(c => c.cover === 'collection' && !c.subresourceId)
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
        c => c.cover === 'collection' && c.subresourceId,
    );

    const subresources = groupSubresourcesById(await ctx.subresource.findAll());
    const groupedSubresourceFields = groupSubresourceFields(subresourceFields);

    const transformMainResourceDocument = getDocumentTransformer(
        ctx.dataset.findBy,
        mainResourceFields,
    );

    progress.start(PUBLISH_DOCUMENT, count);

    await Promise.all(
        Object.keys(groupedSubresourceFields).map(subresourceId => {
            const subresourceFields = groupedSubresourceFields[subresourceId];
            const subresource = subresources[subresourceId];

            const datasetChunkExtractor = dataset =>
                dataset.reduce((acc, curr) => {
                    let data;

                    try {
                        data = JSON.parse(get(curr, subresource.path));
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
                        )(curr),
                    ];
                }, []);

            return transformAllDocuments(
                count,
                ctx.dataset.findLimitFromSkip,
                ctx.publishedDataset.insertBatchIgnoreDuplicate,
                x => x, // disable default transformer (do it in extractor)
                datasetChunkExtractor,
            );
        }),
    );

    await transformAllDocuments(
        count,
        ctx.dataset.findLimitFromSkip,
        ctx.publishedDataset.insertBatch,
        versionTransformerDecorator(transformMainResourceDocument),
    );
};

export default publishDocumentsFactory({
    versionTransformerDecorator,
    getDocumentTransformer,
    transformAllDocuments,
});
