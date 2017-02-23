import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CardHeader, CardText } from 'material-ui/Card';

import { polyglot as polyglotPropTypes } from '../../propTypes';

import {
    publish as publishAction,
} from './';
import { fromFields, fromPublish, fromPublication } from '../selectors';
import Alert from '../../lib/Alert';
import Card from '../../lib/Card';
import ButtonWithStatus from '../../lib/ButtonWithStatus';
import { loadField } from '../fields';
import Validation from './Validation';

const styles = {
    title: {
        height: '36px',
        lineHeight: '36px',
    },
    button: {
        float: 'right',
    },
};

export class PublishComponent extends Component {
    componentWillMount() {
        this.props.loadField();
    }

    handleClick = () => {
        this.props.onPublish();
    }

    render() {
        const { canPublish, error, isPublishing, p: polyglot, published } = this.props;
        return (
            <Card>
                <CardHeader
                    title={polyglot.t('publication')}
                    subtitle={polyglot.t('publication_explanations')}
                    titleStyle={styles.title}
                >
                    <ButtonWithStatus
                        className="btn-publish"
                        loading={isPublishing}
                        error={error}
                        success={published}
                        label={polyglot.t('publish')}
                        onClick={this.handleClick}
                        secondary
                        disabled={!canPublish}
                        style={styles.button}
                    />
                </CardHeader>
                <CardText>
                    {error && <Alert><p>{error}</p></Alert>}
                    {!canPublish && <Validation />}
                </CardText>
            </Card>
        );
    }
}

PublishComponent.propTypes = {
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
    onPublish: publishAction,
    loadField,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublishComponent);
