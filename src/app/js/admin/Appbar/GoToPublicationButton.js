import React from 'react';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import colorsTheme from '../../../custom/colorsTheme';
import classNames from 'classnames';
import VisibilityIcon from '@mui/icons-material/Visibility';

const useStyles = makeStyles({
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    button: {
        color: colorsTheme.white.primary,
    },
});

const GoToPublicationButtonComponent = ({ p: polyglot }) => {
    const classes = useStyles();

    const handleGoToPublication = () => {
        window.location.replace(window.location.origin);
    };

    return (
        <div className={classes.buttonContainer}>
            <Tooltip title={polyglot.t(`navigate_to_published_data`)}>
                <IconButton
                    className={classNames(
                        classes.button,
                        'go-published-button',
                    )}
                    onClick={handleGoToPublication}
                >
                    <VisibilityIcon sx={{ fontSize: '30px' }} />
                </IconButton>
            </Tooltip>
        </div>
    );
};

GoToPublicationButtonComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(GoToPublicationButtonComponent);
