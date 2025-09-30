import transformers from './transformers';
import composeTransformers from './lib/composeTransformers';

export const getFieldTransformation = (context: any, field: any) => {
    if (!field.transformers.length) {
        return () => Promise.resolve({});
    }
    const documentTransformers = field.transformers.map(
        ({ operation, args = [] }: any) =>
            transformers[operation](context, args),
    );

    const transformDocument = composeTransformers(documentTransformers);
    return async (doc: any) => ({
        [field.name]: await transformDocument(doc).catch(() => ''),
    });
};

export const getDocumentTransformations = (context: any, fields: any) =>
    fields.map((field: any) => getFieldTransformation(context, field));

export const sanitizeUris = (doc: any) => {
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

export const applyTransformation =
    (documentTransformers: any) => async (doc: any) => {
        const partialDocsPromises = documentTransformers.map(
            (transformer: any) => transformer(doc),
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

export default (context: any, fields: any) => {
    const documentTransformers = getDocumentTransformations(context, fields);
    return applyTransformation(documentTransformers);
};
