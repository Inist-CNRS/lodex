import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { publish as publishAction } from './';
import { fromPublish, fromPublication } from '../selectors';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import ConfirmPublication from './ConfirmPublication';
import { fromFields } from '../../sharedSelectors';

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
    handleClick = () => {
        this.props.onPublish();
    };

    render() {
        const {
            canPublish,
            error,
            isPublishing,
            p: polyglot,
            published,
        } = this.props;
        return (
            <div>
                <ButtonWithStatus
                    raised
                    labelColor="#7DBD42"
                    className="btn-publish"
                    loading={isPublishing}
                    error={error}
                    success={published}
                    label={polyglot.t('publish')}
                    onClick={this.handleClick}
                    disabled={!canPublish}
                    style={styles.button}
                />
                <ConfirmPublication />
            </div>
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

const mapDispatchToProps = {
    onPublish: publishAction,
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    translate,
)(PublishButtonComponent);
