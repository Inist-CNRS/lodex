import {
    alpha,
    Box,
    ButtonBase,
    Divider,
    type Theme,
    Typography,
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

// the layout shared by the import pages (classic and simplified)
export const importPageStyles = {
    // fills the page height, the input taking what is left; a short window
    // scrolls the page instead
    container: {
        width: '100%',
        minHeight: '100%',
        paddingX: 5,
        paddingY: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
    },
    actions: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1,
    },
    // the main action: large, and tinted even while disabled so it is seen
    // before a source is chosen
    uploadButton: {
        marginLeft: 'auto',
        paddingX: 4,
        '&.Mui-disabled': {
            color: 'common.white',
            bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.4),
        },
    },
};

const styles = {
    wizardCard: {
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 2,
        textAlign: 'left',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        '&:hover': { borderColor: 'primary.main' },
    },
    wizardIcon: {
        display: 'grid',
        placeItems: 'center',
        flex: 'none',
        width: 40,
        height: 40,
        borderRadius: 2,
        color: 'primary.main',
        bgcolor: 'action.hover',
    },
};

export const OpenWizardCard = ({ onOpen }: { onOpen: () => void }) => {
    const { translate } = useTranslate();
    return (
        <>
            <Divider>
                <Typography variant="body2" color="text.secondary">
                    {translate('or')}
                </Typography>
            </Divider>
            <ButtonBase
                className="btn-open-site-wizard"
                sx={styles.wizardCard}
                onClick={onOpen}
            >
                <Box sx={styles.wizardIcon}>
                    <AutoFixHighIcon />
                </Box>
                <Box flex={1}>
                    <Typography fontWeight={500}>
                        {translate('site_wizard_open')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {translate('site_wizard_open_desc')}
                    </Typography>
                </Box>
                <ChevronRightIcon color="primary" />
            </ButtonBase>
        </>
    );
};
