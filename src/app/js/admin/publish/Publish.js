import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import { polyglot as polyglotPropTypes } from '../../propTypes';

import {
    publish as publishAction,
} from './';
import { fromFields, fromPublish, fromPublication } from '../selectors';
import Alert from '../../lib/Alert';
import Card from '../../lib/Card';
import ButtonWithStatus from '../../lib/ButtonWithStatus';
import { addField, loadField } from '../fields';
import FieldForm from '../fields/FieldForm';
import Validation from './Validation';

export class PublishComponent extends Component {
    componentWillMount() {
        this.props.loadField();
    }

    handleClick = () => {
        this.props.onPublish();
    }

    handleAddColumnClick = () => {
        this.props.addColumn();
    }

    render() {
        const { canPublish, error, isPublishing, p: polyglot, published } = this.props;
        return (
            <Card>
                <CardHeader title={polyglot.t('publication')} />
                <CardText>
                    <FieldForm />
                </CardText>
                <CardActions>
                    <FlatButton
                        className="add-column"
                        label={polyglot.t('add column')}
                        onClick={this.handleAddColumnClick}
                    />
                    <ButtonWithStatus
                        className="btn-publish"
                        loading={isPublishing}
                        error={error}
                        success={published}
                        label={polyglot.t('publish')}
                        onClick={this.handleClick}
                        primary
                        disabled={!canPublish}
                    />

                    {error && <Alert><p>{error}</p></Alert>}
                </CardActions>
                <CardText>
                    {canPublish && polyglot.t('publication_explanations')}
                    {!canPublish && <Validation />}
                </CardText>
            </Card>
        );
    }
}

PublishComponent.propTypes = {
    addColumn: PropTypes.func.isRequired,
    canPublish: PropTypes.bool.isRequired,
    error: PropTypes.string,
    isPublishing: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    onPublish: PropTypes.func.isRequired,
    published: PropTypes.bool.isRequired,
    loadField: PropTypes.func.isRequired,
};

PublishComponent.defaultProps = {
    error: null,
};

const mapStateToProps = state => ({
    canPublish: fromFields.areAllFieldsValid(state),
    error: fromPublish.getPublishingError(state),
    isPublishing: fromPublish.getIsPublishing(state),
    published: fromPublication.hasPublishedDataset(state),
});

const mapDispatchToProps = ({
    addColumn: addField,
    onPublish: publishAction,
    loadField,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublishComponent);
