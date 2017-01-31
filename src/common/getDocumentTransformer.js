import transformers from './transformers';
import asyncCompose from './lib/asyncCompose';

const postTransformations = ['LINK'];

const filterForStage = stage => ({ operation }) => (
    stage === 'post'
    ? postTransformations.includes(operation)
    : !postTransformations.includes(operation)
);

export const getFieldTransformation = (stage, ctx) => (field) => {
    const documentTransformers = field.transformers
        .filter(filterForStage(stage))
        .map(({ operation, args }) => transformers[operation](ctx)(field.name, ...args));

    const transformDocument = asyncCompose(documentTransformers);

    return transformDocument;
};

export const getDocumentTransformations = (stage, ctx) => fields => fields.map(getFieldTransformation(stage, ctx));

export const applyTransformation = documentTransformers => async (doc) => {
    const partialDocsPromises = documentTransformers
        .map(transformer => transformer(doc));

    const partialDocs = await Promise.all(partialDocsPromises);

    return partialDocs.reduce((newDoc, partialDoc) => ({
        ...newDoc,
        ...partialDoc,
    }), {});
};

export default ctx => fields => (stage) => {
    const documentTransformers = getDocumentTransformations(stage, ctx)(fields);

    return applyTransformation(documentTransformers);
};
