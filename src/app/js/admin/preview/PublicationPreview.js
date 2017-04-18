import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import PublicationExcerpt from './PublicationExcerpt';
import PublicationEditionModal from '../fields/wizard';

import { editField, loadField, removeField } from '../fields';
import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFields, fromPublicationPreview } from '../selectors';

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
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

export class PublicationPreviewComponent extends Component {
    componentWillMount() {
        this.props.loadField();
    }

    handleRemoveColumnClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.removeColumn(this.props.editedColumn.name);
        this.props.editColumn(null);
    }

    handleExitColumEdition = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.editColumn(null);
    }

    render() {
        const { columns, lines, editColumn, editedColumn, p: polyglot } = this.props;

        return (
            <div style={styles.container} className="publication-preview">
                <div style={styles.titleContainer}>
                    <div style={styles.title}>
                        {polyglot.t('publication_preview')}
                    </div>
                </div>

                <PublicationExcerpt
                    editedColumn={editedColumn}
                    columns={columns}
                    lines={lines}
                    onHeaderClick={editColumn}
                />

                <PublicationEditionModal
                    editedColumn={editedColumn}
                    columns={columns}
                    lines={lines}
                    onExitEdition={this.handleExitColumEdition}
                />
            </div>
        );
    }
}

PublicationPreviewComponent.propTypes = {
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    editedColumn: fieldPropTypes,
    editColumn: PropTypes.func.isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    loadField: PropTypes.func.isRequired,
    removeColumn: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

PublicationPreviewComponent.defaultProps = {
    editedColumn: null,
};

const mapStateToProps = state => ({
    columns: fromFields.getFields(state),
    editedColumn: fromFields.getEditedField(state),
    lines: fromPublicationPreview.getPublicationPreview(state),
});

const mapDispatchToProps = {
    editColumn: editField,
    loadField,
    removeColumn: removeField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublicationPreviewComponent);
