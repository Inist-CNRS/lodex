import React, { useEffect, useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { FINISHED, IN_PROGRESS, ON_HOLD } from '../../../../common/taskStatus';
import { fromEnrichments } from '../selectors';
import { launchEnrichment } from '.';
import { compose } from 'recompose';
import translate from 'redux-polyglot/translate';
import { toast } from '../../../../common/tools/toast';
import { connect } from 'react-redux';

export const RunButton = ({
    onLaunchEnrichment,
    areEnrichmentsRunning,
    enrichmentStatus,
    p: polyglot,
    variant,
    id,
}) => {
    const [isOngoing, setIsOngoing] = useState(false);

    useEffect(() => {
        if (['IN_PROGRESS', 'PENDING'].includes(enrichmentStatus)) {
            setIsOngoing(true);
            return;
        }

        return setIsOngoing(false);
    }, [setIsOngoing, enrichmentStatus]);

    const handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsOngoing(true);
        if (areEnrichmentsRunning) {
            toast(polyglot.t('pending_enrichment'), {
                type: toast.TYPE.INFO,
            });
        }
        onLaunchEnrichment({
            id,
            action: enrichmentStatus === FINISHED ? 'relaunch' : 'launch',
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
            {polyglot.t('run')}
        </Button>
    );
};

RunButton.propTypes = {
    areEnrichmentsRunning: PropTypes.bool.isRequired,
    onLaunchEnrichment: PropTypes.func.isRequired,
    enrichmentStatus: PropTypes.oneOf([
        'IN_PROGRESS',
        'PENDING',
        'FINISHED',
        'CANCELED',
        '',
    ]).isRequired,
    p: polyglotPropTypes,
    variant: PropTypes.string,
    id: PropTypes.string,
};

const mapDispatchToProps = {
    onLaunchEnrichment: launchEnrichment,
};

const mapStateToProps = (state, { id }) => ({
    areEnrichmentsRunning: !!fromEnrichments
        .enrichments(state)
        .find(
            (enrichment) =>
                enrichment.status === IN_PROGRESS ||
                enrichment.status === ON_HOLD,
        ),
    enrichmentStatus: fromEnrichments
        .enrichments(state)
        .find(({ _id }) => _id === id)?.status,
});

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(RunButton);
