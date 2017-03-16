import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { publish as publishAction } from './';
import { fromFields, fromPublish, fromPublication } from '../selectors';
import ButtonWithStatus from '../../lib/ButtonWithStatus';
import { loadField } from '../fields';

const styles = {
    title: {
        height: '36px',
        lineHeight: '36px',
    },
    button: {
        marginLeft: 4,
        marginRight: 4,
    },
};

export class PublishButtonComponent extends Component {
    componentWillMount() {
        this.props.loadField();
    }

    handleClick = () => {
        this.props.onPublish();
    }

    render() {
        const { canPublish, error, isPublishing, p: polyglot, published } = this.props;
        return (
            <ButtonWithStatus
                raised
                backgroundColor="#a4c639"
                className="btn-publish"
                loading={isPublishing}
                error={error}
                success={published}
                label={polyglot.t('publish')}
                onClick={this.handleClick}
                disabled={!canPublish}
                style={styles.button}
            />
        );
    }
}

PublishButtonComponent.propTypes = {
    canPublish: PropTypes.bool.isRequired,
    error: PropTypes.string,
    isPublishing: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    onPublish: PropTypes.func.isRequired,
    published: PropTypes.bool.isRequired,
    loadField: PropTypes.func.isRequired,
};

PublishButtonComponent.defaultProps = {
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
)(PublishButtonComponent);
