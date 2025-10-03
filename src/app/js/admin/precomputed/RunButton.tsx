import { Button, type ButtonProps } from '@mui/material';
import React, { type MouseEvent, useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
    IN_PROGRESS,
    ON_HOLD,
    PENDING,
    type TaskStatus,
} from '../../../../common/taskStatus';
import { useTranslate } from '../../i18n/I18NContext';

export const RunButton = ({
    handleLaunchPrecomputed,
    precomputedStatus,
    variant = 'contained',
}: {
    handleLaunchPrecomputed: (event: MouseEvent) => void;
    precomputedStatus: TaskStatus | undefined;
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
                precomputedStatus === IN_PROGRESS ||
                precomputedStatus === PENDING ||
                precomputedStatus === ON_HOLD
            }
        >
            {translate('run')}
        </Button>
    );
};
