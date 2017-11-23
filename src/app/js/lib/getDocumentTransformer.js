import getDocumentTransformer from '../../../common/getDocumentTransformer';
import fetchLineBy from './fetchLineBy';
import applyJbjStylesheet from './applyJbjStylesheet';

export default (fields, token) =>
    getDocumentTransformer(
        {
            env: 'browser',
            fetchLineBy: fetchLineBy(token),
            applyJbjStylesheet: applyJbjStylesheet(token),
        },
        fields,
    );
