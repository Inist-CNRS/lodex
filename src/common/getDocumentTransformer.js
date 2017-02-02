import transformers from './transformers';
import asyncCompose from './lib/asyncCompose';

export const getFieldTransformation = (context, field) => {
    const documentTransformers = field.transformers
        .map(({ operation, args = [] }) => transformers[operation](context, args));

    const transformDocument = asyncCompose(documentTransformers);

    return async doc => ({
        [field.name]: await transformDocument(doc),
    });
};

export const getDocumentTransformations = (context, fields) =>
    fields.map(field => getFieldTransformation(context, field));

export const applyTransformation = documentTransformers => async (doc) => {
    const partialDocsPromises = documentTransformers
        .map(transformer => transformer(doc));

    const partialDocs = await Promise.all(partialDocsPromises);

    return partialDocs.reduce((newDoc, partialDoc) => ({
        ...newDoc,
        ...partialDoc,
    }), {});
};

export default context => (fields) => {
    const documentTransformers = getDocumentTransformations(context, fields);

    return applyTransformation(documentTransformers);
};
