import React from 'react';
import PropTypes from 'prop-types';
import { lightGreen, red } from '@material-ui/core/colors';
import { CircularProgress, Button } from '@material-ui/core';
import Warning from '@material-ui/icons/Warning';
import Success from '@material-ui/icons/Done';

const getIcon = (error, loading, success) => {
    if (loading) return <CircularProgress variant="indeterminate" size={20} />;
    if (error) return <Warning color={red[400]} />;
    if (success) return <Success color={lightGreen.A400} />;
    return null;
};

const ButtonWithStatus = ({
    raised,
    error,
    loading,
    disabled,
    success,
    ...props
}) =>
    raised ? (
        <Button
            variant="contained"
            disabled={disabled || loading}
            startIcon={getIcon(error, loading, success)}
            {...props}
        />
    ) : (
        <Button
            variant="text"
            disabled={disabled || loading}
            startIcon={getIcon(error, loading, success)}
            {...props}
        />
    );

ButtonWithStatus.propTypes = {
    raised: PropTypes.bool,
    error: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
    success: PropTypes.bool,
};

ButtonWithStatus.defaultProps = {
    raised: false,
    error: false,
    disabled: false,
    success: false,
    loading: false,
};

export default ButtonWithStatus;
