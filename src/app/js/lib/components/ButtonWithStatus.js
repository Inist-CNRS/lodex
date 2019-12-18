import React from 'react';
import PropTypes from 'prop-types';
import { lightGreen, red } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

export const WarningIcon = props => (
    <FontAwesomeIcon icon={faExclamationTriangle} color={red[400]} {...props} />
);

export const SuccessIcon = props => (
    <FontAwesomeIcon icon={faCheck} color={lightGreen[400]} {...props} />
);

const getIcon = (error, loading, success) => {
    if (loading) {
        return <CircularProgress size={20} />;
    }
    if (error) {
        return <WarningIcon />;
    }
    if (success) {
        return <SuccessIcon />;
    }
    return null;
};

const ButtonWithStatus = ({
    error,
    loading,
    disabled,
    success,
    children,
    ...rest
}) => (
    <Button disabled={disabled || loading} {...rest}>
        {getIcon(error, loading, success)}
        {children}
    </Button>
);

ButtonWithStatus.propTypes = {
    error: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
    success: PropTypes.bool,
    children: PropTypes.element.isRequired,
};

ButtonWithStatus.defaultProps = {
    error: false,
    disabled: false,
    success: false,
};

export default ButtonWithStatus;
