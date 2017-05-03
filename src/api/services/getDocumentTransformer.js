import getDocumentTransformer from '../../common/getDocumentTransformer';
import applyJbjStylesheet from './applyJbjStylesheet';

export default ctx => fields => getDocumentTransformer({
    env: 'node',
    fetchLineBy: ctx.uriDataset.findBy,
    applyJbjStylesheet,
}, fields);
