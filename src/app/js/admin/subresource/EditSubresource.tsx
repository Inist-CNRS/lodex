import React from 'react';
// @ts-expect-error TS7016
import { withRouter } from 'react-router';

import { FieldsEdit } from '../field/FieldsEdit';
import { EditSubresourceForm } from './EditSubresourceForm';

// @ts-expect-error TS7031
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
