import { Box, FormControlLabel, Switch, Typography } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { StepTitle } from './StepTitle';

type PublishStepProps = {
    autoPublish: boolean;
    onAutoPublishChange: (autoPublish: boolean) => void;
};

export const PublishStep = ({
    autoPublish,
    onAutoPublishChange,
}: PublishStepProps) => {
    const { translate } = useTranslate();
    return (
        <Box>
            <StepTitle>{translate('site_wizard_publish_title')}</StepTitle>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
                {translate('site_wizard_publish_hint')}
            </Typography>
            <FormControlLabel
                sx={{ mt: 3 }}
                control={
                    <Switch
                        checked={autoPublish}
                        onChange={(e) => onAutoPublishChange(e.target.checked)}
                    />
                }
                label={translate('site_wizard_auto_publish')}
            />
        </Box>
    );
};
