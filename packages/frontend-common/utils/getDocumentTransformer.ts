import { getDocumentTransformer } from '@lodex/common';
import fetchLineBy from '@lodex/frontend-common/fetch/fetchLineBy';

// @ts-expect-error TS7006
export default (fields, token) =>
    getDocumentTransformer(
        {
            env: 'browser',
            fetchLineBy: fetchLineBy(token),
        },
        fields,
    );
