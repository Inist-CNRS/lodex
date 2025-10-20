import { lightGreen, red } from '@mui/material/colors';
import {
    CircularProgress,
    LinearProgress,
    Button,
    type ButtonProps,
    Box,
} from '@mui/material';
import Warning from '@mui/icons-material/Warning';
import Success from '@mui/icons-material/Done';

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
    colorPrimary: { backgroundColor: 'var(--contrast-main)' },
    barColorPrimary: { backgroundColor: 'var(--primary-secondary)' },
};

type ButtonWithStatusProps = {
    raised?: boolean;
    error?: boolean;
    disabled?: boolean;
    loading?: boolean;
    success?: boolean;
    progress?: number;
    target?: number;
    className?: string;
    data?: string;
} & ButtonProps;

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
}: ButtonWithStatusProps) => {
    return (
        <Box sx={styles.container}>
            {raised ? (
                <Button
                    variant="contained"
                    className={className}
                    sx={loading && target ? styles.loadingProgress : {}}
                    disabled={disabled || loading}
                    // @ts-expect-error TS2554
                    startIcon={getIcon(error, success, loading, target)}
                    {...props}
                />
            ) : (
                <Button
                    variant="text"
                    disabled={disabled || loading}
                    // @ts-expect-error TS2554
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
                    value={target ? (progress ?? 0 / target) * 100 : 0}
                />
            ) : undefined}
        </Box>
    );
};

// @ts-expect-error TS7006
const getIcon = (error, success, loading) => {
    if (loading) return <CircularProgress variant="indeterminate" size={20} />;
    // @ts-expect-error TS2769
    if (error) return <Warning color={red[400]} />;
    // @ts-expect-error TS2769
    if (success) return <Success color={lightGreen.A400} />;
    return null;
};

ButtonWithStatus.defaultProps = {
    raised: false,
    error: false,
    disabled: false,
    success: false,
    loading: false,
};

export default ButtonWithStatus;
