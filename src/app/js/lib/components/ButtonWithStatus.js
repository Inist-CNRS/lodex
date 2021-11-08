import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { lightGreen, red } from '@material-ui/core/colors';
import { CircularProgress, LinearProgress, Button } from '@material-ui/core';
import Warning from '@material-ui/icons/Warning';
import Success from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';

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
                        [classes.loadingProgress]: loading && progress,
                    })}
                    disabled={disabled || loading}
                    startIcon={getIcon(
                        error,
                        success,
                        loading,
                        progress,
                        target,
                    )}
                    {...props}
                />
            ) : (
                <Button
                    variant="text"
                    disabled={disabled || loading}
                    startIcon={getIcon(
                        error,
                        success,
                        loading,
                        progress,
                        target,
                    )}
                    {...props}
                />
            )}
            {loading && progress ? (
                <LinearProgress
                    className={classes.progress}
                    variant="determinate"
                    value={target ? (progress / target) * 100 : 0}
                />
            ) : (
                undefined
            )}
        </div>
    );
};
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
});
const getIcon = (error, success, loading, progress) => {
    if (loading && progress == null)
        return <CircularProgress variant="indeterminate" size={20} />;
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
};

ButtonWithStatus.defaultProps = {
    raised: false,
    error: false,
    disabled: false,
    success: false,
    loading: false,
};

export default ButtonWithStatus;
