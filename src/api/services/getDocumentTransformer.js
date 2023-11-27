import getDocumentTransformer from '../../common/getDocumentTransformer';

export default (fetchLineBy, fields, precomputed) =>
    getDocumentTransformer(
        {
            env: 'node',
            fetchLineBy,
            precomputed,
        },
        fields,
    );
