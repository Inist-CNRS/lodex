import transformers from './transformers';
import asyncCompose from './lib/asyncCompose';

export const getFieldTransformation = (field) => {
    const documentTransformers = field.transformers
        .map(({ operation, args }) => transformers[operation](field.name, ...args));

    const transformDocument = asyncCompose(documentTransformers);

    return transformDocument;
};

export const getDocumentTransformations = fields => fields.map(getFieldTransformation);

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
