import transformers from './transformers';
import composeTransformers from './lib/composeTransformers';

export const getFieldTransformation = (context, field) => {
    if (!field.transformers.length) {
        return () => Promise.resolve({});
    }
    const documentTransformers = field.transformers.map(
        ({ operation, args = [] }) => transformers[operation](context, args),
    );

    const transformDocument = composeTransformers(documentTransformers);
    return async doc => ({
        [field.name]: await transformDocument(doc).catch(() => ''),
    });
};

export const getDocumentTransformations = (context, fields) =>
    fields.map(field => {
        const precomputedArg = field.transformers
            .find(t => t.operation === 'PRECOMPUTED')
            ?.args.find(a => a.name === 'precomputed');

        const fieldContext = {
            ...context,
            precomputed:
                precomputedArg && context.precomputed
                    ? context.precomputed.find(
                          p => p.name === precomputedArg.value,
                      )
                    : undefined,
        };
        return getFieldTransformation(fieldContext, field);
    });

export const sanitizeUris = doc => {
    if (!doc.uri) {
        return doc;
    }

    if (
        (doc.uri + '').startsWith('ark:') ||
        (doc.uri + '').startsWith('uid:')
    ) {
        return doc;
    }

    return {
        ...doc,
        uri: `uid:/${doc.uri}`,
    };
};

export const applyTransformation = documentTransformers => async doc => {
    const partialDocsPromises = documentTransformers.map(transformer =>
        transformer(doc),
    );

    const partialDocs = await Promise.all(partialDocsPromises);
    const result = partialDocs.reduce(
        (newDoc, partialDoc) => ({
            ...newDoc,
            ...partialDoc,
        }),
        {},
    );

    return sanitizeUris(result);
};

export default (context, fields) => {
    const documentTransformers = getDocumentTransformations(context, fields);
    return applyTransformation(documentTransformers);
};
