import transformers from './transformers';
import asyncCompose from './lib/asyncCompose';

export const getFieldTransformation = (context, field) => {
    if (!field.transformers.length) {
        return () => Promise.resolve({});
    }
    const documentTransformers = field.transformers
        .map(({ operation, args = [] }) => transformers[operation](context, args));

    const transformDocument = asyncCompose(documentTransformers);

    return async doc => ({
        [field.name]: await transformDocument(doc),
    });
};

export const getDocumentTransformations = (context, fields) =>
    fields.map(field => getFieldTransformation(context, field));

export const sanitizeUris = (doc) => {
    if (!doc.uri) {
        return doc;
    }

    if (doc.uri.startsWith('ark:') || doc.uri.startsWith('uid:')) {
        return doc;
    }

    return {
        ...doc,
        uri: `uid:/${encodeURIComponent(doc.uri)}`,
    };
};

export const applyTransformation = documentTransformers => async (doc) => {
    const partialDocsPromises = documentTransformers
        .map(transformer => transformer(doc));

    const partialDocs = await Promise.all(partialDocsPromises);

    const result = partialDocs.reduce((newDoc, partialDoc) => ({
        ...newDoc,
        ...partialDoc,
    }), {});

    const resultWithSanitizedUri = sanitizeUris(result);
    return resultWithSanitizedUri;
};

export default (context, fields) => {
    const documentTransformers = getDocumentTransformations(context, fields);
    return applyTransformation(documentTransformers);
};
