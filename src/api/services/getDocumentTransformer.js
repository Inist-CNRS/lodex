import getDocumentTransformer from '../../common/getDocumentTransformer';
import applyJbjStylesheet from './applyJbjStylesheet';

export default (fetchLineBy, fields) =>
    getDocumentTransformer(
        {
            env: 'node',
            fetchLineBy,
            applyJbjStylesheet,
        },
        fields,
    );
