import { Button, type ButtonProps } from '@mui/material';
import { type MouseEvent, useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { TaskStatus, type TaskStatusType } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

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
    const handleClick = (event: MouseEvent) => {
        handleLaunchPrecomputed(event);
        setIsClicked(true);
    };

    return (
        <Button
            color="primary"
            variant={variant}
            sx={{ height: '100%' }}
            startIcon={<PlayArrowIcon />}
            onClick={handleClick}
            disabled={
                isClicked ||
                precomputedStatus === TaskStatus.IN_PROGRESS ||
                precomputedStatus === TaskStatus.PENDING ||
                precomputedStatus === TaskStatus.ON_HOLD
            }
        >
            {translate('run')}
        </Button>
    );
};
