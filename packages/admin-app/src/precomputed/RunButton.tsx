import { TaskStatus, type TaskStatusType } from '@lodex/common';
import { ButtonWithConfirm } from '@lodex/frontend-common/components/ButtonWithConfirm';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button, type ButtonProps } from '@mui/material';
import { type MouseEvent } from 'react';

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

    const handleConfirm = (event: MouseEvent) => {
        handleLaunchPrecomputed(event);
    };

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
            disabled={!RUNNABLE_STATUSES.includes(precomputedStatus)}
        >
            {translate('run')}
        </Button>
    );
};
