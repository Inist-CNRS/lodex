import React, { Component, PropTypes } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CardActions, CardHeader, CardText } from 'material-ui/Card';

import { polyglot as polyglotPropTypes } from '../../lib/propTypes';
import {
    publish as publishAction,
    getPublishData,
} from './';
import Alert from '../../lib/Alert';
import Card from '../../lib/Card';
import ButtonWithStatus from '../../lib/ButtonWithStatus';
import PublicationPreview from '../publicationPreview/PublicationPreview';
import { loadField } from '../fields';
import FieldForm from '../fields/FieldForm';

export class PublishComponent extends Component {
    componentWillMount() {
        this.props.loadField();
    }

    handleClick = () => {
        this.props.onPublish();
    }

    render() {
        const { error, loading, p: polyglot, published } = this.props;
        return (
            <Card>
                <CardHeader title={polyglot.t('publication')} />
                <PublicationPreview />
                <FieldForm />
                <CardActions>
                    <ButtonWithStatus
                        className="btn-publish"
                        loading={loading}
                        error={error}
                        success={published}
                        label={polyglot.t('publish')}
                        onClick={this.handleClick}
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

const mapStateToProps = getPublishData;

const mapDispatchToProps = ({
    onPublish: publishAction,
    loadField,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublishComponent);
