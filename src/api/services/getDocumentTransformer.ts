import getDocumentTransformer from '../../common/getDocumentTransformer';

export default (fetchLineBy: any, fields: any) =>
    getDocumentTransformer(
        {
            env: 'node',
            fetchLineBy,
        },
        fields,
    );
