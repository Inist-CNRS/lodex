import { TaskStatus, type TaskStatusType } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    type ButtonProps,
} from '@mui/material';
import { useState, type MouseEvent } from 'react';

export const RunButton = ({
    handleLaunchPrecomputed,
    precomputedStatus,
    variant = 'contained',
}: {
    handleLaunchPrecomputed: (event: MouseEvent) => void;
    precomputedStatus: TaskStatusType | undefined;
    variant: ButtonProps['variant'];
}) => {
    const { translate } = useTranslate();
    const [isOpen, setIsOpen] = useState(false);
    const [isClicked, setIsClicked] = useState<boolean>(false);

    const handleButtonClick = (event: MouseEvent) => {
        if (precomputedStatus === TaskStatus.FINISHED) {
            setIsOpen(true);
        } else {
            handleLaunchPrecomputed(event);
            setIsClicked(true);
        }
    };

    const handleConfirm = (event: MouseEvent) => {
        handleLaunchPrecomputed(event);
        setIsClicked(true);
        setIsOpen(false);
    };

    return (
        <>
            <Button
                color="primary"
                variant={variant}
                sx={{ height: '100%' }}
                startIcon={<PlayArrowIcon />}
                onClick={handleButtonClick}
                disabled={
                    isClicked ||
                    precomputedStatus === TaskStatus.IN_PROGRESS ||
                    precomputedStatus === TaskStatus.PENDING ||
                    precomputedStatus === TaskStatus.ON_HOLD
                }
            >
                {translate('run')}
            </Button>
            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                aria-labelledby="precomputed-confirm-run-title"
            >
                <DialogTitle id="precomputed-confirm-run-title">
                    {translate('precomputed_confirm_run')}
                </DialogTitle>
                <DialogContent>
                    {translate('precomputed_confirm_run_description')}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpen(false)} color="secondary">
                        {translate('cancel')}
                    </Button>
                    <Button onClick={handleConfirm} color="primary" autoFocus>
                        {translate('confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
