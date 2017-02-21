import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import PublicationExcerpt from './PublicationExcerpt';

import { addField, editField } from '../fields';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';
import { fromFields, fromPublicationPreview } from '../selectors';
import Card from '../../lib/Card';

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

    render() {
        const { columns, lines, editColumn, p: polyglot } = this.props;

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
                    />
                </CardHeader>

                <CardText expandable>
                    <PublicationExcerpt
                        columns={columns}
                        lines={lines}
                        onHeaderClick={editColumn}
                    />
                </CardText>
            </Card>
        );
    }
}

PublicationPreviewComponent.propTypes = {
    addColumn: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    p: polyglotPropTypes.isRequired,
    editColumn: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    columns: fromFields.getFields(state),
    lines: fromPublicationPreview.getPublicationPreview(state),
});

const mapDispatchToProps = {
    addColumn: addField,
    editColumn: editField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublicationPreviewComponent);
