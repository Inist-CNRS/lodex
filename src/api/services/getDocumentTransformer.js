import getDocumentTransformer from '../../common/getDocumentTransformer';

export default ctx => fields => getDocumentTransformer({
    env: 'node',
    dataset: ctx.uriDataset,
}, fields);
