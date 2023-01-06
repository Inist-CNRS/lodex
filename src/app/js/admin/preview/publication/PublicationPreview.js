import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import PublicationExcerpt from './PublicationExcerpt';
import FieldEditForm from '../../../fields/wizard';
import { editField, loadField } from '../../../fields';
import { fromFields } from '../../../sharedSelectors';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../../propTypes';

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

const PublicationPreviewComponent = ({
    fields,
    filter,
    loadField,
    editColumn,
    readonly,
}) => {
    useEffect(() => {
        loadField();
    }, []);

    const handleExitColumEdition = e => {
        e.preventDefault();
        e.stopPropagation();
        editColumn(null);
    };

    return (
        <div style={styles.container} className="publication-preview">
            <PublicationExcerpt onHeaderClick={null} fields={fields} />
            {!readonly && (
                <FieldEditForm
                    filter={filter}
                    onExitEdition={handleExitColumEdition}
                />
            )}
        </div>
    );
};

PublicationPreviewComponent.propTypes = {
    editColumn: PropTypes.func.isRequired,
    loadField: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    filter: PropTypes.string,
    readonly: PropTypes.boolean,
};

const mapStateToProps = (state, { filter, subresourceId }) => ({
    fields: fromFields.getEditingFields(state, { filter, subresourceId }),
});

const mapDispatchToProps = {
    editColumn: editField,
    loadField,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
    PublicationPreviewComponent,
);
