// @ts-expect-error TS6133
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import PublicationExcerpt from './PublicationExcerpt';
import { loadField } from '../../../fields';
import { fromFields } from '../../../sharedSelectors';

import { field as fieldPropTypes } from '../../../propTypes';

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 100px - 76px - 72px)',
    },
    content: {
        overflow: 'auto',
    },
    button: {
        float: 'right',
        marginRight: '2rem',
    },
};

interface PublicationPreviewComponentProps {
    loadField(...args: unknown[]): unknown;
    fields: unknown[];
}

const PublicationPreviewComponent = ({
    fields,
    loadField
}: PublicationPreviewComponentProps) => {
    useEffect(() => {
        loadField();
    }, []);

    return (
        // @ts-expect-error TS2322
        (<div style={styles.container} className="publication-preview">
            {/*
             // @ts-expect-error TS2322 */}
            <PublicationExcerpt onHeaderClick={null} fields={fields} />
        </div>)
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { filter, subresourceId }) => ({
    fields: fromFields.getEditingFields(state, { filter, subresourceId }),
});

const mapDispatchToProps = {
    loadField,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
    // @ts-expect-error TS2345
    PublicationPreviewComponent,
);
