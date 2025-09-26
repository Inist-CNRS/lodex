import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
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

// @ts-expect-error TS7031
const PublicationPreviewComponent = ({ fields, loadField }) => {
    useEffect(() => {
        loadField();
    }, []);

    return (
        // @ts-expect-error TS2322
        <div style={styles.container} className="publication-preview">
            <PublicationExcerpt onHeaderClick={null} fields={fields} />
        </div>
    );
};

PublicationPreviewComponent.propTypes = {
    loadField: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { filter, subresourceId }) => ({
    // @ts-expect-error TS2339
    fields: fromFields.getEditingFields(state, { filter, subresourceId }),
});

const mapDispatchToProps = {
    loadField,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
    PublicationPreviewComponent,
);
