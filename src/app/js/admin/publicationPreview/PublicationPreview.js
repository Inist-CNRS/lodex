import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { CardHeader } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import PublicationExcerpt from './PublicationExcerpt';
import PublicationEditionModal from './PublicationEditionModal';

import { addField, editField, removeField } from '../fields';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';
import { fromFields, fromPublicationPreview } from '../selectors';
import Card from '../../lib/Card';
import ScrollableCardContent from '../../lib/ScrollableCardContent';

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

    render() {
        const { columns, lines, editColumn, editedColumn, p: polyglot } = this.props;

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
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublicationPreviewComponent);
