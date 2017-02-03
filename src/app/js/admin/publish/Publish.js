import React, { Component, PropTypes } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import { polyglot as polyglotPropTypes } from '../../lib/propTypes';

import {
    publish as publishAction,
} from './';
import Alert from '../../lib/Alert';
import Card from '../../lib/Card';
import ButtonWithStatus from '../../lib/ButtonWithStatus';
import { addField, loadField } from '../fields';
import FieldForm from '../fields/FieldForm';

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
        const { error, loading, p: polyglot, published } = this.props;
        return (
            <Card>
                <CardHeader title={polyglot.t('publication')} />
                <CardText>
                    <FieldForm />
                </CardText>
                <CardActions>
                    <FlatButton label={polyglot.t('add column')} onClick={this.handleAddColumnClick} />

                    <ButtonWithStatus
                        className="btn-publish"
                        loading={loading}
                        error={error}
                        success={published}
                        label={polyglot.t('publish')}
                        onClick={this.handleClick}
                        primary
                    />

                    {error && <Alert><p>{error}</p></Alert>}
                </CardActions>
                <CardText>
                    {polyglot.t('publication_explanations')}
                </CardText>
            </Card>
        );
    }
}

PublishComponent.propTypes = {
    addColumn: PropTypes.func.isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    onPublish: PropTypes.func.isRequired,
    published: PropTypes.bool.isRequired,
    loadField: PropTypes.func.isRequired,
};

PublishComponent.defaultProps = {
    error: null,
};

const mapStateToProps = state => state.publish;

const mapDispatchToProps = ({
    addColumn: addField,
    onPublish: publishAction,
    loadField,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublishComponent);
