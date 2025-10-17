import { getDocumentTransformer } from '@lodex/common';

export default (fetchLineBy: any, fields: any) =>
    getDocumentTransformer(
        {
            env: 'node',
            fetchLineBy,
        },
        fields,
    );
