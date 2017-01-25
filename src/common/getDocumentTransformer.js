import * as transformers from './transformers';
import asyncCompose from './lib/asyncCompose';

export const getDocumentTransformations = columns =>
columns.reduce((acc, column) => {
    const documentTransformers = transformers.map(({ func, args }) => transformers[func](column.name, ...args));

    const transformDocument = asyncCompose(documentTransformers);

    return [
        ...acc,
        transformDocument,
    ];
}, {});

export const applyTransformation = documentTransformers => async (doc) => {
    const partialDocsPromises = documentTransformers
    .map(transformer => transformer(doc));

    const partialDocs = await Promise.all(partialDocsPromises);

    return partialDocs.reduce((newDoc, partialDoc) => ({
        ...newDoc,
        ...partialDoc,
    }), {});
};

export default (columns) => {
    const documentTransformers = getDocumentTransformations(columns);
    return applyTransformation(documentTransformers);
};
