import getDocumentTransformer from '../../../common/getDocumentTransformer';
import fetchLineBy from './fetchLineBy';

export default (fields, token) => getDocumentTransformer({
    env: 'browser',
    fetchLineBy: fetchLineBy(token),
}, fields);
