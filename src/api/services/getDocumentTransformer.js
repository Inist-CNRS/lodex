import getDocumentTransformer from '../../common/getDocumentTransformer';
import fetchLineBy from '../controller/api/fetchLineBy';

export default ctx => fields => getDocumentTransformer({
    env: 'node',
    dataset: ctx.uriDataset,
    fetchLineBy,
}, fields);
