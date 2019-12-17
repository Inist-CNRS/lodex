import React from 'react';
import PropTypes from 'prop-types';
import { lightGreen, red } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import RaisedButton from '@material-ui/core/RaisedButton';
import Warning from '@material-ui/icons/Warning';
import Success from '@material-ui/icons/Done';

const getIcon = (error, loading, success) => {
    if (loading) return <CircularProgress size={20} />;
    if (error) return <Warning color={red[400]} />;
    if (success) return <Success color={lightGreen[400]} />;
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
        <RaisedButton
            disabled={disabled || loading}
            icon={getIcon(error, loading, success)}
            {...props}
        />
    ) : (
        <Button
            disabled={disabled || loading}
            icon={getIcon(error, loading, success)}
            {...props}
        />
    );

ButtonWithStatus.propTypes = {
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
