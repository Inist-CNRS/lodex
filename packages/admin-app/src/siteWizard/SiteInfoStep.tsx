import { Box, TextField, Typography } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { StepTitle } from './StepTitle';

type SiteInfoStepProps = {
    siteName: string;
    onSiteNameChange: (siteName: string) => void;
    siteDescription: string;
    onSiteDescriptionChange: (siteDescription: string) => void;
};

export const SiteInfoStep = ({
    siteName,
    onSiteNameChange,
    siteDescription,
    onSiteDescriptionChange,
}: SiteInfoStepProps) => {
    const { translate } = useTranslate();
    return (
        <Box>
            <StepTitle>{translate('site_wizard_site_info_title')}</StepTitle>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
                {translate('site_wizard_site_info_hint')}
            </Typography>
            <TextField
                fullWidth
                label={translate('site_wizard_site_title')}
                value={siteName}
                onChange={(e) => onSiteNameChange(e.target.value)}
                sx={{ mt: 3 }}
            />
            <TextField
                fullWidth
                multiline
                minRows={2}
                label={translate('site_wizard_site_subtitle')}
                value={siteDescription}
                onChange={(e) => onSiteDescriptionChange(e.target.value)}
                sx={{ mt: 2 }}
            />
        </Box>
    );
};
