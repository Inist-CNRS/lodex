import { Box, LinearProgress, Typography } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        minHeight: { xs: '260px', md: '320px' },
        margin: { xs: '16px 8px 0', md: '48px 10% 0' },
        padding: { xs: '24px 12px', md: '48px 24px' },
        overflowWrap: 'break-word',
        hyphens: 'auto',
        textAlign: 'center',
        border: '2px dashed var(--primary-secondary)',
        borderRadius: '8px',
        backgroundColor: 'var(--contrast-main)',
    },
    icon: {
        fontSize: '56px',
        color: 'primary.main',
        marginBottom: 1,
        animation:
            'lodex-import-float 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate',
        '@keyframes lodex-import-float': {
            from: { transform: 'translateY(4px)', opacity: 0.75 },
            to: { transform: 'translateY(-4px)', opacity: 1 },
        },
        '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
        },
    },
    description: {
        maxWidth: '46ch',
        color: 'text.secondary',
        textWrap: 'balance',
    },
    progress: {
        width: '100%',
        maxWidth: '280px',
        height: '6px',
        marginTop: 2,
        borderRadius: '3px',
    },
};

export const ImportInProgress = () => {
    const { translate } = useTranslate();

    return (
        <Box sx={styles.container} role="status" aria-live="polite">
            <CloudUploadOutlinedIcon sx={styles.icon} aria-hidden />
            <Typography variant="h6" component="p">
                {translate('import_in_progress')}
            </Typography>
            <Typography variant="body2" sx={styles.description}>
                {translate('import_in_progress_description')}
            </Typography>
            <LinearProgress sx={styles.progress} />
        </Box>
    );
};
