import React from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fromEnrichments } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { Chip } from '@mui/material';
import {
    FINISHED,
    IN_PROGRESS,
    PENDING,
    ERROR,
    CANCELED,
    PAUSED,
} from '../../../../common/taskStatus';
import { translate } from '../../i18n/I18NContext';

// @ts-expect-error TS7031
export const EnrichmentStatus = ({ status, p: polyglot }) => {
    if (status === PENDING) {
        return (
            <Chip
                component="span"
                label={polyglot.t('enrichment_status_pending')}
                color="warning"
            />
        );
    }
    if (status === IN_PROGRESS) {
        return (
            <Chip
                component="span"
                label={polyglot.t('enrichment_status_running')}
                color="info"
            />
        );
    }

    if (status === PAUSED) {
        return (
            <Chip
                component="span"
                label={polyglot.t('enrichment_status_paused')}
                color="info"
            />
        );
    }

    if (status === FINISHED) {
        return (
            <Chip
                component="span"
                label={polyglot.t('enrichment_status_done')}
                color="success"
            />
        );
    }

    if (status === ERROR) {
        return (
            <Chip
                component="span"
                label={polyglot.t('enrichment_status_error')}
                color="error"
            />
        );
    }

    if (status === CANCELED) {
        return (
            <Chip
                component="span"
                label={polyglot.t('enrichment_status_canceled')}
                color="warning"
            />
        );
    }

    return (
        <Chip
            component="span"
            label={polyglot.t('enrichment_status_not_started')}
            sx={{ backgroundColor: 'neutral' }}
        />
    );
};

EnrichmentStatus.propTypes = {
    p: polyglotPropTypes.isRequired,
    status: PropTypes.string,
    id: PropTypes.string,
};

const mapDispatchToProps = {};

// @ts-expect-error TS7006
const mapStateToProps = (state, { id }) => ({
    // @ts-expect-error TS2339
    status: fromEnrichments.enrichments(state).find(({ _id }) => _id === id)
        ?.status,
});

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(EnrichmentStatus);
