import { Box, TextField, Typography } from '@mui/material';
import { type CatalogModel } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { ModelSubtitle } from './ModelSubtitle';

export const SiteInfoStepHeader = ({ model }: { model: CatalogModel }) => (
    <ModelSubtitle
        model={model}
        translationKey="site_wizard_site_info_subtitle"
    />
);

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
            <Typography
                variant="h2"
                fontSize={20}
                color="text.primary"
                sx={{ mt: 2 }}
            >
                {translate('site_wizard_site_info_title')}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
                {translate('site_wizard_site_info_hint')}
            </Typography>
            <TextField
                fullWidth
                label={translate('name')}
                value={siteName}
                onChange={(e) => onSiteNameChange(e.target.value)}
                sx={{ mt: 3 }}
            />
            <TextField
                fullWidth
                multiline
                minRows={2}
                label={translate('description')}
                value={siteDescription}
                onChange={(e) => onSiteDescriptionChange(e.target.value)}
                sx={{ mt: 2 }}
            />
        </Box>
    );
};
