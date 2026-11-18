import { Box, Typography } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

// the title and the subtitle, laid out as the header of the site wizard it
// follows. No progress bar: the wizard's one counts pages, while the steps
// below all stay on screen and show their progress themselves.
export const SiteGenerationHeader = () => {
    const { translate } = useTranslate();
    return (
        <Box mb={2}>
            <Typography
                id="site-generation-title"
                variant="h1"
                fontSize={24}
                fontWeight={700}
                color="text.primary"
            >
                {translate('site_generation_title')}
            </Typography>
            <Typography color="text.secondary">
                {translate('site_generation_subtitle')}
            </Typography>
        </Box>
    );
};
