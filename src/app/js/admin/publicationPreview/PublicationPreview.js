import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { CardHeader } from 'material-ui/Card';

import PublicationExcerpt from './PublicationExcerpt';
import PublicationEditionModal from './PublicationEditionModal';

import { editField, removeField } from '../fields';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';
import { fromFields, fromPublicationPreview } from '../selectors';
import ScrollableCardContent from '../../lib/ScrollableCardContent';

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
        width: '99vw',
    },
    content: {
        overflow: 'auto',
    },
    titleContainer: {
        display: 'inline-block',
        writingMode: 'vertical-rl',
        textAlign: 'center',
        textTransform: 'uppercase',
        flex: '0 0 1vw',
    },
    title: {
        paddingRight: 0,
        verticalAlign: 'baseline',
    },
    button: {
        float: 'right',
        marginRight: '2rem',
    },
};

export class PublicationPreviewComponent extends Component {
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
                <CardHeader
                    style={styles.titleContainer}
                    textStyle={styles.title}
                    title={polyglot.t('publication_preview')}
                />

                <ScrollableCardContent style={styles.content}>
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
