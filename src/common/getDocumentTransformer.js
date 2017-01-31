import transformers from './transformers';
import asyncCompose from './lib/asyncCompose';

export const getFieldTransformation = (field, config) => {
    const documentTransformers = field.transformers
        .map(({ operation, args }) => transformers[operation](config)(field.name, ...args));

    const transformDocument = asyncCompose(documentTransformers);

    return transformDocument;
};

export const getDocumentTransformations = (fields, config) =>
    fields.map(field => getFieldTransformation(field, config));

export const applyTransformation = documentTransformers => async (doc) => {
    const partialDocsPromises = documentTransformers
        .map(transformer => transformer(doc));

    const partialDocs = await Promise.all(partialDocsPromises);

    return partialDocs.reduce((newDoc, partialDoc) => ({
        ...newDoc,
        ...partialDoc,
    }), {});
};

export default (fields, config) => {
    const documentTransformers = getDocumentTransformations(fields, config);

    return applyTransformation(documentTransformers);
};
