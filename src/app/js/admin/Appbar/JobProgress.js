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
import { publish, publishSuccess, publishError } from '../publish';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { PENDING, SAVING_DATASET } from '../../../../common/progressStatus';
import classNames from 'classnames';
import { Cancel } from '@material-ui/icons';
import jobsApi from '../api/job';
import CancelPublicationDialog from './CancelPublicationDialog';
import { publicationCleared } from '../publication';
import Warning from '@material-ui/icons/Warning';
import { loadParsingResult } from '../parsing';
import { uploadSuccess } from '../upload';
import { clearPublished } from '../clear';
import { fromPublication } from '../selectors';

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
        hasPublishedDataset,
        p: polyglot,
        handlePublishSuccess,
        handlePublishError,
        handleCancelPublication,
        handleUploadSuccess,
        handleCancelImport,
        handleRepublish,
    } = props;
    const [progress, setProgress] = useState();
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

    useEffect(() => {
        const socket = io();
        socket.on('progress', data => {
            data.isJobProgress =
                data.status !== PENDING &&
                (data.type === 'enricher' ||
                    data.type === 'publisher' ||
                    data.type === 'import');
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

        socket.on('import', data => {
            if (data.isImporting) {
                handleUploadSuccess();
            }
            if (!data.isImporting && !data.success) {
                handleCancelImport();
            }
            if (data.success && hasPublishedDataset) {
                handleRepublish();
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
                            {(progress?.label || progress?.status) && (
                                <Typography variant="subtitle2">
                                    {polyglot.t(
                                        progress?.label || progress?.status,
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
                            {progress?.status === SAVING_DATASET &&
                                progress?.subLabel && (
                                    <Typography variant="caption">
                                        {`${progress.progress} ${polyglot.t(
                                            progress.subLabel,
                                        )}`}
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
                    {!!progress?.progress && !!progress?.target && (
                        <LinearProgress
                            classes={{
                                root: classes.progress,
                                colorPrimary: classes.colorPrimary,
                                barColorPrimary: classes.barColorPrimary,
                            }}
                            variant="determinate"
                            value={(progress.progress / progress.target) * 100}
                        />
                    )}
                </Box>
            </Fade>
            <CancelPublicationDialog
                isOpen={isCancelDialogOpen}
                title={
                    progress?.type === 'publisher'
                        ? 'cancelPublicationTitle'
                        : progress?.type === 'enricher'
                        ? 'cancelEnrichmentTitle'
                        : 'cancelImportTitle'
                }
                content={
                    progress?.type === 'publisher'
                        ? 'cancelPublicationContent'
                        : progress?.type === 'enricher'
                        ? 'cancelEnrichmentContent'
                        : 'cancelImportContent'
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
    hasPublishedDataset: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    handlePublishSuccess: PropTypes.func.isRequired,
    handlePublishError: PropTypes.func.isRequired,
    handleCancelPublication: PropTypes.func.isRequired,
    handleUploadSuccess: PropTypes.func.isRequired,
    handleCancelImport: PropTypes.func.isRequired,
    handleRepublish: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});
const mapDispatchToProps = {
    handlePublishSuccess: () => publishSuccess(),
    handlePublishError: error => publishError(error),
    handleCancelPublication: () => publicationCleared(),
    handleUploadSuccess: () => uploadSuccess(),
    handleCancelImport: () => loadParsingResult(),
    handleRepublish: async () => {
        await clearPublished();
        await publish();
    },
};
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(JobProgressComponent);
