import omit from 'lodash.omit';
import get from 'lodash.get';

import getDocumentTransformer from './getDocumentTransformer';
import transformAllDocuments from './transformAllDocuments';
import progress from './progress';
import { PUBLISH_DOCUMENT } from '../../common/progressStatus';

export const versionTransformerDecorator = transformDocument => async (
    document,
    _,
    __,
    publicationDate = new Date(),
) => {
    const doc = await transformDocument(document);

    return {
        uri: doc.uri,
        versions: [
            {
                ...omit(doc, ['uri']),
                publicationDate,
            },
        ],
    };
};

// export const publishDocumentsFactory = ({
//     versionTransformerDecorator,
//     getDocumentTransformer,
//     transformAllDocuments,
// }) =>
//     async function publishDocuments(ctx, count, fields) {
//         const collectionCoverFields = fields.filter(
//             c => c.cover === 'collection',
//         );

//         const transformDocument = getDocumentTransformer(
//             ctx.dataset.findBy,
//             collectionCoverFields,
//         );

//         progress.start(PUBLISH_DOCUMENT, count);
//         await transformAllDocuments(
//             count,
//             ctx.dataset.findLimitFromSkip,
//             ctx.publishedDataset.insertBatch,
//             versionTransformerDecorator(transformDocument),
//         );
//     };

// export default publishDocumentsFactory({
//     versionTransformerDecorator,
//     getDocumentTransformer,
//     transformAllDocuments,
// });

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

export default async (ctx, count, fields) => {
    const mainResourceFields = fields.filter(
        c => c.cover === 'collection' && !c.subresourceId,
    );

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

    // === Start Dev Playground

    await Promise.all(
        Object.keys(groupedSubresourceFields).map(subresourceId => {
            const subresourceFields = groupedSubresourceFields[subresourceId];
            const subresourceDocumentTransformer = getDocumentTransformer(
                ctx.dataset.findBy,
                subresourceFields.map(field =>
                    field.name.endsWith('_uri')
                        ? { ...field, position: 0, name: 'uri' }
                        : field,
                ),
            );

            const subresourceTransformer = (...args) => {
                // Remove empty subresource
                if (!get(args[0], subresources[subresourceId].path)) {
                    return false;
                }

                return versionTransformerDecorator(
                    subresourceDocumentTransformer,
                )(...args);
            };

            return transformAllDocuments(
                count,
                ctx.dataset.findLimitFromSkip,
                ctx.publishedDataset.insertBatchIgnoreDuplicate,
                subresourceTransformer,
            );
        }),
    );

    // === End Dev Playground

    await transformAllDocuments(
        count,
        ctx.dataset.findLimitFromSkip,
        ctx.publishedDataset.insertBatch,
        versionTransformerDecorator(transformMainResourceDocument),
    );
};
