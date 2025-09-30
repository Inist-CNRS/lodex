import React from 'react';
import { withRouter } from 'react-router';

import { FieldsEdit } from '../field/FieldsEdit';
import { EditSubresourceForm } from './EditSubresourceForm';

const EditSubresourceComponent = withRouter(({ match, filter }) => {
    const subresourceId = match.params.subresourceId;

    return (
        <>
            <EditSubresourceForm />
            <div style={{ marginTop: 20 }}>
                <FieldsEdit filter={filter} subresourceId={subresourceId} />
            </div>
        </>
    );
});

export const EditSubresource = withRouter(EditSubresourceComponent);
