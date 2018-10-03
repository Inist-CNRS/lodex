import React from 'react';
import PropTypes from 'prop-types';
import { lightGreenA400, red400 } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import Warning from 'material-ui/svg-icons/alert/warning';
import Success from 'material-ui/svg-icons/action/done';

const getIcon = (error, loading, success) => {
    if (loading) return <CircularProgress size={20} />;
    if (error) return <Warning color={red400} />;
    if (success) return <Success color={lightGreenA400} />;
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
