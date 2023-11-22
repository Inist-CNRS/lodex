import getDocumentTransformer from '../../../common/getDocumentTransformer';
import fetchLineBy from './fetchLineBy';

export default (fields, token, precomputed) =>
    getDocumentTransformer(
        {
            env: 'browser',
            fetchLineBy: fetchLineBy(token),
            precomputed,
        },
        fields,
    );
