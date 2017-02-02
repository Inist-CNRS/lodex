import transformers from './transformers';
import asyncCompose from './lib/asyncCompose';

export const getFieldTransformation = (field) => {
    const documentTransformers = field.transformers
        .map(({ operation, args = [] }) => transformers[operation](args));

    const transformDocument = asyncCompose(documentTransformers);

    return async doc => ({
        [field.name]: await transformDocument(doc),
    });
};

export const getDocumentTransformations = fields =>
    fields.map(field => getFieldTransformation(field));

export const applyTransformation = documentTransformers => async (doc) => {
    const partialDocsPromises = documentTransformers
        .map(transformer => transformer(doc));

    const partialDocs = await Promise.all(partialDocsPromises);

    return partialDocs.reduce((newDoc, partialDoc) => ({
        ...newDoc,
        ...partialDoc,
    }), {});
};

export default (fields) => {
    const documentTransformers = getDocumentTransformations(fields);

    return applyTransformation(documentTransformers);
};
