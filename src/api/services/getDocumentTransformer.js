import getDocumentTransformer from '../../common/getDocumentTransformer';

export default ctx => fields => getDocumentTransformer({
    env: 'node',
    fetchLineBy: ctx.uriDataset.findBy,
}, fields);
