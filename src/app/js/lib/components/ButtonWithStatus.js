import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { lightGreen, red } from '@material-ui/core/colors';
import { CircularProgress, LinearProgress, Button } from '@material-ui/core';
import Warning from '@material-ui/icons/Warning';
import Success from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import theme from '../../theme';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    loadingProgress: {
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
    },
    progress: {
        margin: '0 4px 0',
    },
    colorPrimary: { backgroundColor: theme.white.primary },
    barColorPrimary: { backgroundColor: theme.green.secondary },
});

const ButtonWithStatus = ({
    raised,
    error,
    loading,
    disabled,
    success,
    progress,
    target,
    className,
    ...props
}) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            {raised ? (
                <Button
                    variant="contained"
                    className={classnames(className, {
                        [classes.loadingProgress]: loading && target,
                    })}
                    disabled={disabled || loading}
                    startIcon={getIcon(error, success, loading, target)}
                    {...props}
                />
            ) : (
                <Button
                    variant="text"
                    disabled={disabled || loading}
                    startIcon={getIcon(error, success, loading, target)}
                    {...props}
                />
            )}
            {loading && target ? (
                <LinearProgress
                    // className={classes.progress}
                    classes={{
                        root: classes.progress,
                        colorPrimary: classes.colorPrimary,
                        barColorPrimary: classes.barColorPrimary,
                    }}
                    variant="determinate"
                    value={target ? (progress / target) * 100 : 0}
                />
            ) : (
                undefined
            )}
        </div>
    );
};

const getIcon = (error, success, loading) => {
    if (loading) return <CircularProgress variant="indeterminate" size={20} />;
    if (error) return <Warning color={red[400]} />;
    if (success) return <Success color={lightGreen.A400} />;
    return null;
};

ButtonWithStatus.propTypes = {
    raised: PropTypes.bool,
    error: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    success: PropTypes.bool,
    progress: PropTypes.number,
    target: PropTypes.number,
    className: PropTypes.string,
};

ButtonWithStatus.defaultProps = {
    raised: false,
    error: false,
    disabled: false,
    success: false,
    loading: false,
};

export default ButtonWithStatus;
