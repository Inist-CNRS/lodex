import omit from 'lodash.omit';

import getDocumentTransformer from './getDocumentTransformer';

// take a doc remove its _id and add its uri
export const addUriToDoc = getUriDoc => async doc => ({
    ...omit(doc, ['_id']), // we return the
    ...(await getUriDoc(doc)), // getUriDoc return { uri: uri value }
});

export default (fetchLineBy, uriCol) => {
    const getUriDoc = getDocumentTransformer(fetchLineBy, [uriCol]);

    return addUriToDoc(getUriDoc);
};
