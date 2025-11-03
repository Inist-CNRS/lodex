import { useParams, withRouter } from 'react-router';

import { FieldsEdit } from '../fields/FieldsEdit';
import { EditSubresourceForm } from './EditSubresourceForm';

export const EditSubresource = withRouter(() => {
    const { filter, subresourceId } = useParams<{
        filter: string;
        subresourceId: string;
    }>();

    return (
        <>
            <EditSubresourceForm />
            <div style={{ marginTop: 20 }}>
                <FieldsEdit filter={filter} subresourceId={subresourceId} />
            </div>
        </>
    );
});
