import React from 'react';
import PropTypes from 'prop-types';
import { lightGreen, red } from '@mui/material/colors';
import { CircularProgress, LinearProgress, Button, Box } from '@mui/material';
import Warning from '@mui/icons-material/Warning';
import Success from '@mui/icons-material/Done';
import colorsTheme from '../../../custom/colorsTheme';

const styles = {
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
    colorPrimary: { backgroundColor: colorsTheme.white.primary },
    barColorPrimary: { backgroundColor: colorsTheme.green.secondary },
};

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
    return (
        <Box sx={styles.container}>
            {raised ? (
                <Button
                    variant="contained"
                    className={className}
                    sx={loading && target ? styles.loadingProgress : {}}
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
                    sx={{
                        ...styles.progress,
                        '& .MuiLinearProgress-colorPrimary':
                            styles.colorPrimary,
                        '& .MuiLinearProgress-barColorPrimary':
                            styles.barColorPrimary,
                    }}
                    variant="determinate"
                    value={target ? (progress / target) * 100 : 0}
                />
            ) : (
                undefined
            )}
        </Box>
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
