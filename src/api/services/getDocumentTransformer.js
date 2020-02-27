import getDocumentTransformer from '../../common/getDocumentTransformer';

export default (fetchLineBy, fields) =>
    getDocumentTransformer(
        {
            env: 'node',
            fetchLineBy,
        },
        fields,
    );
