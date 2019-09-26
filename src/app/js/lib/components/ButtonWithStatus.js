import React from 'react';
import PropTypes from 'prop-types';
import { lightGreen, red } from '@material-ui/core/colors';
import { CircularProgress, Button } from '@material-ui/core';
import { Warning, Done as Success } from '@material-ui/icons';

const getIcon = (error, loading, success) => {
    if (loading) return <CircularProgress size={20} />;
    if (error) return <Warning color={red[400]} />;
    if (success) return <Success color={lightGreen[400]} />;
    return null;
};

const ButtonWithStatus = ({
    label,
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
            icon={getIcon(error, loading, success)}
            {...props}
        >
            {label}
        </Button>
    ) : (
        <Button
            disabled={disabled || loading}
            icon={getIcon(error, loading, success)}
            {...props}
        >
            {label}
        </Button>
    );

ButtonWithStatus.propTypes = {
    label: PropTypes.string.isRequired,
    raised: PropTypes.bool,
    error: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
    success: PropTypes.bool,
    labelPosition: PropTypes.oneOf(['after', 'before']),
};

ButtonWithStatus.defaultProps = {
    raised: false,
    error: false,
    disabled: false,
    success: false,
    labelPosition: 'before',
};

export default ButtonWithStatus;
