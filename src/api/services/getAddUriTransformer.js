import omit from 'lodash.omit';

import getDocumentTransformer from './getDocumentTransformer';

export const addUriToDoc = getUriDoc => async doc => ({
    ...omit(doc, ['_id']),
    ...(await getUriDoc(doc)),
});

export default ctx => {
    const documentTransformer = getDocumentTransformer(ctx);
    return uriCol => {
        const getUriDoc = documentTransformer([uriCol]);

        return addUriToDoc(getUriDoc);
    };
};
