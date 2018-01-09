import omit from 'lodash.omit';

import getDocumentTransformer from './getDocumentTransformer';

export const addUriToDoc = getUriDoc => async doc => ({
    ...omit(doc, ['_id']),
    ...(await getUriDoc(doc)),
});

export default (fetchLineBy, uriCol) => {
    const getUriDoc = getDocumentTransformer(fetchLineBy, [uriCol]);

    return addUriToDoc(getUriDoc);
};
