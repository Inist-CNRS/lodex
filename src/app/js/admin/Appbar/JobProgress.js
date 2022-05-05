import {
    Box,
    Button,
    CircularProgress,
    Fade,
    LinearProgress,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import theme from '../../theme';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { io } from 'socket.io-client';
import translate from 'redux-polyglot/dist/translate';
import { publishSuccess, publishError } from '../publish';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { PENDING } from '../../../../common/progressStatus';
import classNames from 'classnames';
import { Cancel } from '@material-ui/icons';
import jobsApi from '../api/job';
import CancelPublicationDialog from './CancelPublicationDialog';
import { publicationCleared } from '../publication';
import Warning from '@material-ui/icons/Warning';

const useStyles = makeStyles({
    progress: {
        width: '100%',
        display: 'flex',
        margin: '0 4px 0',
    },
    colorPrimary: { backgroundColor: theme.white.light },
    barColorPrimary: { backgroundColor: theme.white.primary },
    progressContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginLeft: 'auto',
        marginRight: '20px',
        width: '250px',
    },
    progressLabelContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    progressLabel: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    progressStatus: {
        width: '190px',
    },
    cancelButton: {
        display: 'flex',
        minWidth: '0',
        padding: '0',
    },
});

const JobProgressComponent = props => {
    const classes = useStyles();
    const {
        p: polyglot,
        handlePublishSuccess,
        handlePublishError,
        handleCancelPublication,
    } = props;
    const [progress, setProgress] = useState();
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

    useEffect(() => {
        const socket = io();
        socket.on('progress', data => {
            data.isJobProgress =
                data.status !== PENDING &&
                (data.type === 'enricher' || data.type === 'publisher');
            setProgress(data);
        });

        socket.on('publisher', data => {
            if (data.success) {
                handlePublishSuccess();
                setProgress();
            } else {
                handlePublishError(data);
                setProgress({
                    isJobError: true,
                    status: data.message,
                    label: 'show_publication_errors',
                    type: 'publisher',
                });
            }
        });
        return () => socket.disconnect();
    }, []);

    return (
        <>
            <Fade
                in={progress && (progress.isJobProgress || progress.isJobError)}
                out={progress && !progress.isJobProgress}
            >
                <Box
                    className={classNames(
                        classes.progressContainer,
                        'progress-container',
                    )}
                >
                    <div
                        className={classes.progressLabelContainer}
                        aria-label="job-progress"
                    >
                        {progress?.isJobError ? (
                            <Warning size={20} />
                        ) : (
                            <CircularProgress
                                variant="indeterminate"
                                color="inherit"
                                size={20}
                            />
                        )}
                        <div className={classes.progressLabel}>
                            {progress?.label && (
                                <Typography variant="subtitle2">
                                    {polyglot.t(
                                        progress?.label || 'publishing',
                                    )}
                                </Typography>
                            )}
                            {progress &&
                                progress?.type === 'publisher' &&
                                progress.status && (
                                    <Typography
                                        variant="caption"
                                        title={progress?.status}
                                        className={classes.progressStatus}
                                        noWrap={true}
                                    >
                                        {polyglot.t(progress.status)}
                                    </Typography>
                                )}

                            {progress?.type === 'enricher' && (
                                <Typography variant="caption">
                                    {progress.subLabel}
                                </Typography>
                            )}
                        </div>

                        <Button
                            className={classes.cancelButton}
                            color="inherit"
                            onClick={() => {
                                setIsCancelDialogOpen(true);
                            }}
                        >
                            <Cancel />
                        </Button>
                    </div>
                    <LinearProgress
                        classes={{
                            root: classes.progress,
                            colorPrimary: classes.colorPrimary,
                            barColorPrimary: classes.barColorPrimary,
                        }}
                        variant="determinate"
                        value={
                            progress && progress.target
                                ? (progress.progress / progress.target) * 100
                                : 0
                        }
                    />
                </Box>
            </Fade>
            <CancelPublicationDialog
                isOpen={isCancelDialogOpen}
                title={
                    (progress?.type === 'publisher' &&
                        'cancelPublicationTitle') ||
                    'cancelEnrichmentTitle'
                }
                content={
                    (progress?.type === 'publisher' &&
                        'cancelPublicationContent') ||
                    'cancelEnrichmentContent'
                }
                onCancel={() => {
                    setIsCancelDialogOpen(false);
                }}
                onConfirm={() => {
                    if (!progress) {
                        return;
                    }
                    jobsApi.cancelJob(progress.type);
                    if (progress.type === 'publisher') {
                        handleCancelPublication();
                        setProgress();
                    }
                    setIsCancelDialogOpen(false);
                }}
            />
        </>
    );
};
JobProgressComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    handlePublishSuccess: PropTypes.func.isRequired,
    handlePublishError: PropTypes.func.isRequired,
    handleCancelPublication: PropTypes.func.isRequired,
};
const mapDispatchToProps = {
    handlePublishSuccess: () => publishSuccess(),
    handlePublishError: error => publishError(error),
    handleCancelPublication: () => publicationCleared(),
};
export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(JobProgressComponent);
