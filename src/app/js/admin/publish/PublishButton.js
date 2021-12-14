import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { publish as publishAction } from './';
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
    p: polyglot,
    onPublish,
}) => {
    const classes = useStyles();
    const handleClick = () => {
        onPublish();
    };

    return (
        <div className={classnames('btn-publish', classes.container)}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClick}
                disabled={!canPublish}
                className={classes.button}
            >
                {polyglot.t('publish')}
            </Button>
        </div>
    );
};

PublishButtonComponent.propTypes = {
    canPublish: PropTypes.bool.isRequired,
    onPublish: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export const canPublish = (areAllFieldsValid, allListFields) => {
    return areAllFieldsValid && allListFields.some(f => f.name !== 'uri');
};

const mapStateToProps = state => ({
    canPublish: canPublish(
        fromFields.areAllFieldsValid(state),
        fromFields.getAllListFields(state),
    ),
});

const mapDispatchToProps = {
    onPublish: publishAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(PublishButtonComponent);
