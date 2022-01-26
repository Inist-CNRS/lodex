import React, { useContext, useEffect, useState } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { EnrichmentContext } from './EnrichmentContext';
import theme from '../../theme';
import { io } from 'socket.io-client';
import { ERROR, FINISHED } from '../../../../common/enrichmentStatus';
import jobsApi from '../api/job';
import { FixedSizeList } from 'react-window';

const useStyles = makeStyles({
    LogsContainer: {
        overflowY: 'auto',
    },
    LogsTitle: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
    },
    Logs: {
        width: '100%',
        textAlign: 'left',
        paddingLeft: '1rem',
        paddingRight: '1rem',
    },
    LogsList: {
        overflowX: 'hidden !important',
    },
    Log_info: {
        color: theme.black.light,
        lineHeight: '0.8rem',
        whiteSpace: 'nowrap',
    },
    Log_ok: {
        color: theme.green.primary,
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
    },
    Log_error: {
        color: theme.red.primary,
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
    },
});
const LogLine = props => {
    const { data, index, style } = props;
    const log = data[index];
    const parsedLog = JSON.parse(log);
    const classes = useStyles();

    let date;
    try {
        date = Intl.DateTimeFormat('fr', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(parsedLog?.timestamp));
    } catch (e) {
        date = 'No date';
    }

    return (
        <p
            key={parsedLog.timestamp}
            style={style}
            className={classes[`Log_${parsedLog.level}`]}
            title={parsedLog.message}
        >
            [{date}] {parsedLog.message}
        </p>
    );
};

LogLine.propTypes = {
    data: PropTypes.arrayOf(PropTypes.string).isRequired,
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
};
export const EnrichmentLogsComponent = ({ p: polyglot }) => {
    const { enrichment, onLoadEnrichments } = useContext(EnrichmentContext);

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (enrichment?.jobId) {
            jobsApi.getJobLogs(enrichment.jobId).then(
                result => {
                    setIsLoaded(true);
                    setLogs(result.response.logs.reverse());
                },
                error => {
                    setIsLoaded(true);
                    setError(error);
                },
            );
        }
    }, []);

    useEffect(() => {
        const socket = io();
        socket.on(`enrichment-job-${enrichment?.jobId}`, data => {
            setLogs(currentState => [data, ...currentState]);

            if ([FINISHED, ERROR].includes(JSON.parse(data).status)) {
                onLoadEnrichments();
            }
        });
        return () => socket.disconnect();
    }, []);

    const classes = useStyles();

    return enrichment?.jobId ? (
        <div className={classes.LogsContainer}>
            <div className={classes.LogsTitle}>Logs #{enrichment?.jobId}</div>
            <div className={classes.Logs}>
                {!isLoaded && <div>{polyglot.t('loading')}</div>}
                {isLoaded && error && (
                    <div>
                        {polyglot.t('error')}: {error.message}
                    </div>
                )}
                {isLoaded && logs.length < 1 && (
                    <div>{polyglot.t('waiting')}</div>
                )}
                {isLoaded && logs && (
                    <FixedSizeList
                        className={classes.LogsList}
                        height={700}
                        width={600}
                        itemSize={30}
                        itemCount={logs.length}
                        itemData={logs}
                    >
                        {LogLine}
                    </FixedSizeList>
                )}
            </div>
        </div>
    ) : null;
};

EnrichmentLogsComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    optionsRequest: PropTypes.func.isRequired,
};

export default compose(translate)(EnrichmentLogsComponent);
