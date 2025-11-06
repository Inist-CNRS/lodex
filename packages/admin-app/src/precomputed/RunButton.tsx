import { TaskStatus, type TaskStatusType } from '@lodex/common';
import { ButtonWithConfirm } from '@lodex/frontend-common/components/ButtonWithConfirm';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button, type ButtonProps } from '@mui/material';
import { useEffect, useState, type MouseEvent } from 'react';

const RUNNABLE_STATUSES: (TaskStatusType | undefined)[] = [
    undefined,
    TaskStatus.FINISHED,
    TaskStatus.ERROR,
    TaskStatus.CANCELED,
];

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
    const [isClicked, setIsClicked] = useState<boolean>(false);

    const handleConfirm = (event: MouseEvent) => {
        setIsClicked(true);
        handleLaunchPrecomputed(event);
    };

    useEffect(() => {
        if (!RUNNABLE_STATUSES.includes(precomputedStatus)) {
            return;
        }
        setIsClicked(false);
    }, [precomputedStatus]);

    if (precomputedStatus === TaskStatus.FINISHED) {
        return (
            <ButtonWithConfirm
                onConfirm={handleConfirm}
                buttonLabel={translate('run')}
                buttonIcon={<PlayArrowIcon />}
                buttonVariant={variant}
                dialogTitle={translate('precomputed_confirm_run')}
                dialogContent={translate('precomputed_confirm_run_description')}
            />
        );
    }

    return (
        <Button
            color="primary"
            variant={variant}
            sx={{ height: '100%' }}
            startIcon={<PlayArrowIcon />}
            onClick={handleConfirm}
            disabled={
                isClicked || !RUNNABLE_STATUSES.includes(precomputedStatus)
            }
        >
            {translate('run')}
        </Button>
    );
};
