import { useEffect, useState, type MouseEventHandler } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button } from '@mui/material';
import { fromEnrichments } from '../selectors';
import { launchEnrichment } from './index';
import { TaskStatus, toast } from '@lodex/common';
import { connect } from 'react-redux';
import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';
import type { State } from '../reducers';
import { compose } from 'recompose';

type RunButtonProps = {
    onLaunchEnrichment: (value: { id: string; action: string }) => void;
    areEnrichmentsRunning: boolean;
    enrichmentStatus: 'IN_PROGRESS' | 'PENDING' | 'FINISHED' | 'CANCELED' | '';
    variant?: 'text' | 'outlined' | 'contained';
    id: string;
};

export const RunButton = ({
    onLaunchEnrichment,
    areEnrichmentsRunning,
    enrichmentStatus,
    variant,
    id,
}: RunButtonProps) => {
    const { translate } = useTranslate();
    const [isOngoing, setIsOngoing] = useState(false);

    useEffect(() => {
        if (['IN_PROGRESS', 'PENDING'].includes(enrichmentStatus)) {
            setIsOngoing(true);
            return;
        }

        return setIsOngoing(false);
    }, [setIsOngoing, enrichmentStatus]);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsOngoing(true);
        if (areEnrichmentsRunning) {
            toast(translate('pending_enrichment'), {
                type: 'info',
            });
        }
        onLaunchEnrichment({
            id,
            action:
                enrichmentStatus === TaskStatus.FINISHED
                    ? 'relaunch'
                    : 'launch',
        });
    };

    return (
        <Button
            color="primary"
            variant={variant || 'contained'}
            sx={{ height: '100%' }}
            startIcon={<PlayArrowIcon />}
            onClick={handleClick}
            disabled={isOngoing}
        >
            {translate('run')}
        </Button>
    );
};

const mapDispatchToProps = {
    onLaunchEnrichment: launchEnrichment,
};

const mapStateToProps = (
    state: State,
    {
        id,
    }: {
        id: string;
    },
) => ({
    areEnrichmentsRunning: !!fromEnrichments
        .enrichments(state)
        .find(
            (enrichment) =>
                enrichment.status === TaskStatus.IN_PROGRESS ||
                enrichment.status === TaskStatus.ON_HOLD,
        ),
    enrichmentStatus: fromEnrichments
        .enrichments(state)
        .find(({ _id }: { _id: string }) => _id === id)?.status,
});

export default compose<
    RunButtonProps,
    { id: string; variant?: 'text' | 'outlined' | 'contained' }
>(connect(mapStateToProps, mapDispatchToProps))(RunButton);
