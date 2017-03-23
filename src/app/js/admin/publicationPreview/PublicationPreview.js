import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { CardHeader } from 'material-ui/Card';

import PublicationExcerpt from './PublicationExcerpt';
import PublicationEditionModal from './PublicationEditionModal';

import { editField, loadField, removeField } from '../fields';
import { field as fieldPropTypes } from '../../propTypes';
import { fromFields, fromPublicationPreview } from '../selectors';
import ScrollableCardContent from '../../lib/ScrollableCardContent';
import PublicationPreviewTitle from './PublicationPreviewTitle';

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
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
        const { columns, lines, editColumn, editedColumn } = this.props;

        return (
            <div style={styles.container} className="publication-preview">
                <CardHeader
                    style={styles.titleContainer}
                    textStyle={styles.title}
                    title={<PublicationPreviewTitle />}
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
    loadField: PropTypes.func.isRequired,
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
    loadField,
    removeColumn: removeField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(PublicationPreviewComponent);
