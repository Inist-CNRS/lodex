// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import getDocumentTransformer from '../../common/getDocumentTransformer';

export default (fetchLineBy: any, fields: any) =>
    getDocumentTransformer(
        {
            env: 'node',
            fetchLineBy,
        },
        fields,
    );
