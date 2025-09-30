import { Button, type ButtonProps } from '@mui/material';
import React, { type MouseEvent, useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IN_PROGRESS, ON_HOLD, PENDING } from '../../../../common/taskStatus';

export const RunButton = ({
    handleLaunchPrecomputed,
    precomputedStatus,
    translate,
    variant = 'contained',
}: {
    handleLaunchPrecomputed: (event: MouseEvent) => void;
    precomputedStatus: string;
    translate: (key: string) => string;
    variant: ButtonProps['variant'];
}) => {
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
