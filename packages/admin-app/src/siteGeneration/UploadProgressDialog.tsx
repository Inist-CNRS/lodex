import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import type { SiteGenerationView } from '@lodex/common';
import { ConfirmPopup } from '@lodex/frontend-common/components/ConfirmPopup';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { GENERATION_DIALOG_PAPER_PROPS } from '../siteWizard/wizardDialogPaper';
import { getDisplayedSteps } from './displayedSteps';
import { SiteGenerationHeader } from './SiteGenerationHeader';
import { SiteGenerationSteps } from './SiteGenerationSteps';

type UploadProgressDialogProps = {
    open: boolean;
    view: SiteGenerationView;
    uploadProgress: number | null;
    canCancel: boolean;
    isCancelling: boolean;
    onStop: () => void;
};

// the progress of the file being sent, with the stop of the upload
export const UploadProgressDialog = ({
    open,
    view,
    uploadProgress,
    canCancel,
    isCancelling,
    onStop,
}: UploadProgressDialogProps) => {
    const { translate } = useTranslate();
    const [isStopConfirmOpen, setIsStopConfirmOpen] = useState(false);
    const steps = getDisplayedSteps(view);

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="md"
            disableEscapeKeyDown
            PaperProps={GENERATION_DIALOG_PAPER_PROPS}
        >
            <SiteGenerationHeader steps={steps} />
            <DialogContent sx={{ px: 1.5, mx: -1.5 }}>
                <SiteGenerationSteps
                    steps={steps}
                    view={view}
                    uploadProgress={uploadProgress}
                />
            </DialogContent>
            <DialogActions sx={{ px: 0, pb: 0 }}>
                {canCancel && (
                    <Button
                        color="inherit"
                        onClick={() => setIsStopConfirmOpen(true)}
                        disabled={isCancelling}
                    >
                        {translate(
                            isCancelling
                                ? 'site_wizard_cancelling'
                                : 'site_generation_stop',
                        )}
                    </Button>
                )}
            </DialogActions>
            <ConfirmPopup
                isOpen={isStopConfirmOpen && canCancel}
                title={translate('site_generation_stop_title')}
                description={translate('site_generation_stop_description')}
                cancelLabel={translate('cancel')}
                confirmLabel={translate('confirm')}
                onCancel={() => setIsStopConfirmOpen(false)}
                onConfirm={() => {
                    setIsStopConfirmOpen(false);
                    onStop();
                }}
            />
        </Dialog>
    );
};
