import omit from 'lodash.omit';
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

    const groupedSubresourceFields = groupSubresourceFields(subresourceFields);

    const transformMainResourceDocument = getDocumentTransformer(
        ctx.dataset.findBy,
        mainResourceFields,
    );

    progress.start(PUBLISH_DOCUMENT, count);

    // === Start Dev Playground

    console.log({
        fields,
        groupedSubresourceFields,
        subresourceFields,
    });

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

            return transformAllDocuments(
                count,
                ctx.dataset.findLimitFromSkip,
                ctx.publishedDataset.insertBatch,
                versionTransformerDecorator(subresourceDocumentTransformer),
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
