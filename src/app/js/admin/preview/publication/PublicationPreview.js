import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import PublicationExcerpt from './PublicationExcerpt';
import PublicationEditionModal from '../../../fields/wizard';
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
        maxHeight: 600,
    },
    content: {
        overflow: 'auto',
    },
    titleContainer: {
        alignSelf: 'center',
        flexGrow: 0,
        flexShrink: 0,
        width: 50,
    },
    title: {
        textTransform: 'uppercase',
        transform: 'rotate(-90deg)',
    },
    button: {
        float: 'right',
        marginRight: '2rem',
    },
};

const PublicationPreviewComponent = ({
    fields,
    loadField,
    editColumn,
    p: polyglot,
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
            <div style={styles.titleContainer}>
                <div style={styles.title}>
                    {polyglot.t('publication_preview')}
                </div>
            </div>
            <PublicationExcerpt onHeaderClick={editColumn} fields={fields} />
            <PublicationEditionModal onExitEdition={handleExitColumEdition} />
        </div>
    );
};

PublicationPreviewComponent.propTypes = {
    editColumn: PropTypes.func.isRequired,
    loadField: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
};

const mapStateToProps = (state, { filter }) => ({
    fields: fromFields.getFromFilterFields(state, filter),
});

const mapDispatchToProps = {
    editColumn: editField,
    loadField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublicationPreviewComponent);
