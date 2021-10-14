import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { makeStyles } from '@material-ui/core/styles';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { publish as publishAction } from './';
import { fromPublish, fromPublication } from '../selectors';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import { fromFields } from '../../sharedSelectors';

const useStyles = makeStyles({
    button: {
        marginLeft: 4,
        marginRight: 4,
        height: 40,
    },
    container: {
        display: 'flex',
        alignItems: 'center',
    },
});

export const PublishButtonComponent = ({
    canPublish,
    error,
    isPublishing,
    p: polyglot,
    published,
    onPublish,
}) => {
    const classes = useStyles();
    const handleClick = () => {
        onPublish();
    };

    return (
        <div className={classnames('btn-publish', classes.container)}>
            <ButtonWithStatus
                raised
                color="primary"
                loading={isPublishing}
                error={error}
                success={published}
                onClick={handleClick}
                disabled={!canPublish}
                className={classes.button}
            >
                {polyglot.t('publish')}
            </ButtonWithStatus>
        </div>
    );
};

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

export const canPublish = (areAllFieldsValid, allListFields) => {
    return (
        areAllFieldsValid &&
        allListFields.some(f => f.name !== 'uri')
    );
};

const mapStateToProps = state => ({
    canPublish: canPublish(
        fromFields.areAllFieldsValid(state),
        fromFields.getAllListFields(state),
    ),
    error: fromPublish.getPublishingError(state),
    isPublishing: fromPublish.getIsPublishing(state),
    published: fromPublication.hasPublishedDataset(state),
});

const mapDispatchToProps = {
    onPublish: publishAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublishButtonComponent);
