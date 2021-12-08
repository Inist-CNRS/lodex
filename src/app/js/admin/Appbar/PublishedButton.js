import React from 'react';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { Button, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import theme from './../../theme';
import VisibilityIcon from '@material-ui/icons/Visibility';
import classNames from 'classnames';

const useStyles = makeStyles({
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 2,
        marginRight: 2,
    },
    button: {
        color: theme.white.primary,
        borderRadius: 0,
        padding: '0 5px',
        boxSizing: 'border-box',
    },
});

const PublishedButtonComponent = ({ p: polyglot }) => {
    const classes = useStyles();

    const handleGoToPublication = () => {
        window.location.replace(window.location.origin);
    };

    return (
        <div className={classes.buttonContainer}>
            <Tooltip title={polyglot.t(`navigate_to_published_data`)}>
                <Button
                    className={classNames(
                        classes.button,
                        'go-published-button',
                    )}
                    onClick={handleGoToPublication}
                >
                    <VisibilityIcon />
                </Button>
            </Tooltip>
        </div>
    );
};

PublishedButtonComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(PublishedButtonComponent);
