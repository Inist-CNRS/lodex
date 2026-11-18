import {
    Box,
    CircularProgress,
    FormControlLabel,
    Switch,
    Typography,
} from '@mui/material';
import { ConfirmPopup } from '@lodex/frontend-common/components/ConfirmPopup';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

type SimplifiedUploadConfirmProps = {
    isOpen: boolean;
    // the added data may replace the existing ones
    hasData: boolean;
    // the counts of the relaunch are being read: no switch yet, no confirm
    isLoadingLaunch: boolean;
    // false when there is nothing to relaunch: no switch
    canRelaunch: boolean;
    relaunch: boolean;
    onRelaunchChange: (relaunch: boolean) => void;
    autoPublish: boolean;
    onAutoPublishChange: (autoPublish: boolean) => void;
    onCancel: () => void;
    onConfirm: () => void;
};

export const SimplifiedUploadConfirm = ({
    isOpen,
    hasData,
    isLoadingLaunch,
    canRelaunch,
    relaunch,
    onRelaunchChange,
    autoPublish,
    onAutoPublishChange,
    onCancel,
    onConfirm,
}: SimplifiedUploadConfirmProps) => {
    const { translate } = useTranslate();
    return (
        <ConfirmPopup
            cancelLabel={translate('Cancel')}
            confirmLabel={translate('Accept')}
            title={translate('info_upload')}
            description={
                <Box display="flex" flexDirection="column">
                    {hasData && (
                        <Typography mb={1}>
                            {translate('info_publish_desc')}
                        </Typography>
                    )}
                    {isLoadingLaunch && (
                        <Box display="flex" justifyContent="center" my={1}>
                            <CircularProgress size={24} />
                        </Box>
                    )}
                    {!isLoadingLaunch && canRelaunch && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={relaunch}
                                    onChange={(_, checked) =>
                                        onRelaunchChange(checked)
                                    }
                                />
                            }
                            label={translate('simplified_upload_relaunch')}
                        />
                    )}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={autoPublish}
                                onChange={(_, checked) =>
                                    onAutoPublishChange(checked)
                                }
                            />
                        }
                        label={translate('simplified_upload_publish')}
                    />
                </Box>
            }
            isOpen={isOpen}
            isConfirmDisabled={isLoadingLaunch}
            onCancel={onCancel}
            onConfirm={onConfirm}
        />
    );
};
