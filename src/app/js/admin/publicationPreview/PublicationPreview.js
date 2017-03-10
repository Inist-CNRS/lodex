import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { CardHeader } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import PublicationExcerpt from './PublicationExcerpt';
import PublicationEditionModal from './PublicationEditionModal';

import { editField, removeField } from '../fields';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';
import { fromFields, fromPublicationPreview } from '../selectors';
import ScrollableCardContent from '../../lib/ScrollableCardContent';
import ImportFieldsDialog from './ImportFieldsDialog';

const styles = {
    title: {
        height: '36px',
        lineHeight: '36px',
    },
    button: {
        float: 'right',
        marginRight: '2rem',
    },
};

export class PublicationPreviewComponent extends Component {
    constructor() {
        super();
        this.state = { showImportFieldsConfirmation: false };
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

    handleImportFieldsClose = () => {
        this.setState({ showImportFieldsConfirmation: false });
    }

    handleImportFields = () => {
        this.setState({ showImportFieldsConfirmation: true });
    }

    render() {
        const { columns, lines, editColumn, editedColumn, p: polyglot } = this.props;
        const { showImportFieldsConfirmation } = this.state;

        return (
            <div className="publication-preview">
                <CardHeader
                    showExpandableButton
                    title={polyglot.t('publication_preview')}
                    titleStyle={styles.title}
                >
                    <FlatButton
                        className="btn-import-fields"
                        label={polyglot.t('import_fields')}
                        onClick={this.handleImportFields}
                        style={styles.button}
                        primary
                    />
                </CardHeader>

                <ScrollableCardContent expandable>
                    <PublicationExcerpt
                        editedColumn={editedColumn}
                        columns={columns}
                        lines={lines}
                        onHeaderClick={editColumn}
                    />

                    {editedColumn &&
                        <PublicationEditionModal
                            editedColumn={editedColumn}
                            columns={columns}
                            lines={lines}
                            onExitEdition={this.handleExitColumEdition}
                        />
                    }
                    {showImportFieldsConfirmation &&
                        <ImportFieldsDialog
                            onClose={this.handleImportFieldsClose}
                        />
                    }
                </ScrollableCardContent>
            </div>
        );
    }
}

PublicationPreviewComponent.propTypes = {
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    editedColumn: fieldPropTypes,
    editColumn: PropTypes.func.isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    p: polyglotPropTypes.isRequired,
    removeColumn: PropTypes.func.isRequired,
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
    removeColumn: removeField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublicationPreviewComponent);
