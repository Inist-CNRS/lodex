import transformers from './transformers';
import asyncCompose from './lib/asyncCompose';

export const getColumnTransformation = (column) => {
    const documentTransformers = column.transformers
    .map(({ operation, args }) => transformers[operation](column.name, ...args));

    const transformDocument = asyncCompose(documentTransformers);

    return transformDocument;
};

export const getDocumentTransformations = columns => columns.map(getColumnTransformation);

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
