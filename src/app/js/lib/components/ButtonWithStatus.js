import React from 'react';
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
    ...props
}) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            {raised ? (
                <Button
                    variant="contained"
                    disabled={disabled || loading}
                    startIcon={getIcon(
                        error,
                        loading,
                        success,
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
                        loading,
                        success,
                        progress,
                        target,
                    )}
                    {...props}
                />
            )}
            {loading ? (
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
    progress: {
        width: '100%',
    },
});
const getIcon = (error, loading, success, progress, target) => {
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
