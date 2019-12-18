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
    raised,
    error,
    loading,
    disabled,
    success,
    children,
    ...props
}) =>
    raised ? (
        <Button
            disabled={disabled || loading}
            icon={getIcon(error, loading, success)}
            variant="contained"
            {...props}
        >
            {children}
        </Button>
    ) : (
        <Button
            disabled={disabled || loading}
            icon={getIcon(error, loading, success)}
            {...props}
        >
            {children}
        </Button>
    );

ButtonWithStatus.propTypes = {
    raised: PropTypes.bool,
    error: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
    success: PropTypes.bool,
    labelPosition: PropTypes.oneOf(['after', 'before']),
    children: PropTypes.element.isRequired,
};

ButtonWithStatus.defaultProps = {
    raised: false,
    error: false,
    disabled: false,
    success: false,
    labelPosition: 'before',
};

export default ButtonWithStatus;
