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
import { useMeasure } from 'react-use';
import { loadProgress } from '../progress/reducer';

const useStyles = makeStyles({
    LogsContainer: {
        overflowY: 'auto',
        width: '100%',
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
        overflowX: 'auto !important',
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
    let parsedLog;
    try {
        parsedLog = JSON.parse(log);
    } catch (e) {
        console.error('Error parsing log', e);
    }
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

    const [logsContainerRef, { width }] = useMeasure();

    const getJobLogs = async () => {
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
    };

    useEffect(() => {
        getJobLogs();
    }, []);

    useEffect(() => {
        const socket = io();
        socket.on(`enrichment-job-${enrichment?.jobId}`, data => {
            if (Array.isArray(data)) {
                setLogs(currentState => [...data, ...currentState]);
            } else {
                setLogs(currentState => [data, ...currentState]);
                let parsedData;
                try {
                    parsedData = JSON.parse(data);
                } catch {
                    console.error('Error parsing data', data);
                }

                if (
                    parsedData &&
                    [FINISHED, ERROR].includes(parsedData.status)
                ) {
                    onLoadEnrichments();
                }
            }
        });
        socket.on('connect_error', () => {
            getJobLogs();
            loadProgress();
        });
        return () => socket.disconnect();
    }, []);

    const classes = useStyles();

    return enrichment?.jobId ? (
        <div className={classes.LogsContainer}>
            <div className={classes.LogsTitle}>
                {polyglot.t('enrichment_logs')}
            </div>
            <div className={classes.Logs} ref={logsContainerRef}>
                {!isLoaded && <div>{polyglot.t('loading')}</div>}
                {isLoaded && error && (
                    <div>
                        {polyglot.t('error')}: {error.message}
                    </div>
                )}
                {isLoaded && logs.length < 1 && (
                    <div>{polyglot.t('empty_logs')}</div>
                )}
                {isLoaded && logs && (
                    <FixedSizeList
                        className={classes.LogsList}
                        height={700}
                        width={width}
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
