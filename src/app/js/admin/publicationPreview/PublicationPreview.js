import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { CardHeader } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import PublicationExcerpt from './PublicationExcerpt';
import PublicationEditionModal from './PublicationEditionModal';

import { addField, editField, removeField } from '../fields';
import { importFields } from '../import';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';
import { fromFields, fromPublicationPreview } from '../selectors';
import Card from '../../lib/Card';
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
    input: {
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0,
        width: '100%',
        cursor: 'pointer',
    },
};

export class PublicationPreviewComponent extends Component {
    constructor() {
        super();
        this.state = { showImportFieldsConfirmation: false };
    }
    handleAddColumnClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.addColumn();
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

    handleImportFieldsCancellation = () => {
        this.setState({ showImportFieldsConfirmation: false });
    }

    handleImportFieldsConfirmation = () => {
        this.setState({ showImportFieldsConfirmation: false });
        this.fieldsImportInput.click();
    }

    handleImportFields = () => {
        this.setState({ showImportFieldsConfirmation: true });
    }

    handleFieldsLoad = (event) => {
        this.props.importFields(event.target.files[0]);
    }

    storeFieldsInputRef = (input) => {
        this.fieldsImportInput = input;
    }

    render() {
        const { columns, lines, editColumn, editedColumn, p: polyglot } = this.props;
        const { showImportFieldsConfirmation } = this.state;

        return (
            <Card initiallyExpanded className="publication-preview">
                <CardHeader
                    showExpandableButton
                    title={polyglot.t('publication_preview')}
                    titleStyle={styles.title}
                >
                    <FlatButton
                        className="add-column"
                        label={polyglot.t('add_column')}
                        onClick={this.handleAddColumnClick}
                        style={styles.button}
                        secondary
                    />
                    <FlatButton
                        className="btn-import-fields"
                        label={polyglot.t('import_fields')}
                        onClick={this.handleImportFields}
                        style={styles.button}
                        secondary
                    />
                </CardHeader>

                <ScrollableCardContent expandable>
                    <input
                        ref={this.storeFieldsInputRef}
                        name="file"
                        type="file"
                        onChange={this.handleFieldsLoad}
                        style={styles.input}
                    />

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
                            onConfirm={this.handleImportFieldsConfirmation}
                            onCancel={this.handleImportFieldsCancellation}
                        />
                    }
                </ScrollableCardContent>
            </Card>
        );
    }
}

PublicationPreviewComponent.propTypes = {
    addColumn: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    editedColumn: fieldPropTypes,
    editColumn: PropTypes.func.isRequired,
    importFields: PropTypes.func.isRequired,
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
    addColumn: addField,
    editColumn: editField,
    removeColumn: removeField,
    importFields,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublicationPreviewComponent);
