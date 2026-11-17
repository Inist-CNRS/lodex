import { Box, LinearProgress, Typography } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { getCurrentRank, type DisplayedStep } from './displayedSteps';

// the title, the subtitle and the progress of the displayed steps, laid out
// as the header of the site wizard it follows
export const SiteGenerationHeader = ({ steps }: { steps: DisplayedStep[] }) => {
    const { translate } = useTranslate();
    const rank = getCurrentRank(steps);
    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={4}
            mb={2}
        >
            <Box>
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
            <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-end"
                gap={1}
                pt={1}
                flexShrink={0}
            >
                <LinearProgress
                    variant="determinate"
                    value={steps.length ? (rank / steps.length) * 100 : 0}
                    aria-label={translate('site_generation_title')}
                    sx={{ width: 240, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body1">
                    {`${rank}/${steps.length}`}
                </Typography>
            </Box>
        </Box>
    );
};
