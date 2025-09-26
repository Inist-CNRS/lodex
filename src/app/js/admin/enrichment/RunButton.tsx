import React, { useEffect, useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { FINISHED, IN_PROGRESS, ON_HOLD } from '../../../../common/taskStatus';
import { fromEnrichments } from '../selectors';
import { launchEnrichment } from '.';
import { compose } from 'recompose';
import { toast } from '../../../../common/tools/toast';
import { connect } from 'react-redux';
import { translate } from '../../i18n/I18NContext';

export const RunButton = ({
    // @ts-expect-error TS7031
    onLaunchEnrichment,
    // @ts-expect-error TS7031
    areEnrichmentsRunning,
    // @ts-expect-error TS7031
    enrichmentStatus,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    variant,
    // @ts-expect-error TS7031
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

    // @ts-expect-error TS7006
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

// @ts-expect-error TS7006
const mapStateToProps = (state, { id }) => ({
    areEnrichmentsRunning: !!fromEnrichments
        // @ts-expect-error TS2339
        .enrichments(state)
        .find(
            // @ts-expect-error TS7006
            (enrichment) =>
                enrichment.status === IN_PROGRESS ||
                enrichment.status === ON_HOLD,
        ),
    enrichmentStatus: fromEnrichments
        // @ts-expect-error TS2339
        .enrichments(state)
        // @ts-expect-error TS7031
        .find(({ _id }) => _id === id)?.status,
});

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(RunButton);
