import React from 'react';
import PropTypes from 'prop-types';
import { lightGreenA400, red400 } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

export const WarningIcon = props => (
    <FontAwesomeIcon icon={faExclamationTriangle} color={red400} {...props} />
);

export const SuccessIcon = props => (
    <FontAwesomeIcon icon={faCheck} color={lightGreenA400} {...props} />
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
    ...props
}) =>
    raised ? (
        <RaisedButton
            disabled={disabled || loading}
            icon={getIcon(error, loading, success)}
            {...props}
        />
    ) : (
        <FlatButton
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
