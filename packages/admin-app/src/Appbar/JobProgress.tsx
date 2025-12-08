import {
    Box,
    Button,
    CircularProgress,
    Fade,
    LinearProgress,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { publish, publishSuccess, publishError } from '../publish';
import { connect } from 'react-redux';
import { DEFAULT_TENANT, ProgressStatus, toast } from '@lodex/common';
import { Cancel } from '@mui/icons-material';
import jobsApi from '../api/job';
import CancelProcessDialog from './CancelProcessDialog';
import { publicationCleared } from '../publication';
import Warning from '@mui/icons-material/Warning';
import { loadParsingResult } from '../parsing';
import { clearPublished } from '../clear';
import { fromPublication } from '../selectors';
import { finishProgress } from '../progress/reducer';
import { loadEnrichments } from '../enrichment';
import { loadPrecomputed } from '../precomputed';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

const styles = {
    progress: {
        width: '100%',
        display: 'flex',
        margin: '0 4px 0',
    },
    colorPrimary: { backgroundColor: 'var(--contrast-light)' },
    barColorPrimary: { backgroundColor: 'var(--contrast-main)' },
    progressContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginLeft: 'auto',
        marginRight: '20px',
        width: '250px',
        textAlign: 'center',
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
};

interface JobProgressComponentProps {
    hasPublishedDataset: boolean;
    handlePublishSuccess(...args: unknown[]): unknown;
    handlePublishError(...args: unknown[]): unknown;
    handleCancelPublication(...args: unknown[]): unknown;
    loadParsingResult(...args: unknown[]): unknown;
    handleRepublish(...args: unknown[]): unknown;
    finishProgress(...args: unknown[]): unknown;
    loadEnrichments(...args: unknown[]): unknown;
    loadPrecomputed(...args: unknown[]): unknown;
}

const JobProgressComponent = (props: JobProgressComponentProps) => {
    const {
        hasPublishedDataset,
        handlePublishSuccess,
        handlePublishError,
        handleCancelPublication,
        loadParsingResult,
        handleRepublish,
        finishProgress,
        loadEnrichments,
        loadPrecomputed,
    } = props;
    const { translate } = useTranslate();
    const [progress, setProgress] = useState();
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [hasLoadedParsingResult, setHasLoadedParsingResult] = useState(false);

    useEffect(() => {
        if (progress) {
            return;
        }
        setIsCancelDialogOpen(false);
    }, [progress]);

    useEffect(() => {
        const socket = io();
        const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;
        const dbName = sessionStorage.getItem('lodex-dbName');

        socket.on(`${dbName}_${tenant}-progress`, (data) => {
            data.isJobProgress =
                data.status !== ProgressStatus.PENDING &&
                (data.type === 'enricher' ||
                    data.type === 'precomputer' ||
                    data.type === 'publisher' ||
                    data.type === 'import');
            setProgress(data);
            if (data.status === ProgressStatus.PENDING) {
                finishProgress();
            }
        });

        socket.on(`${dbName}_${tenant}-publisher`, (data) => {
            if (data.success) {
                handlePublishSuccess();
                // @ts-expect-error TS2554
                setProgress();
            }
            if (!data.success && !data.isPublishing && data.message) {
                handlePublishError(data);
                if (data.message === 'cancelled_publish') {
                    toast(translate('cancelled_publish'), {
                        type: 'success',
                    });
                } else {
                    toast(`${translate('error')} : ${data.message}`, {
                        type: 'error',
                    });
                }
            }
        });

        socket.on(`${dbName}_${tenant}-import`, (data) => {
            if (!data.isImporting && data.success) {
                loadParsingResult();
                setHasLoadedParsingResult(false);
            }
            if (data.success && hasPublishedDataset) {
                handleRepublish();
            }
            if (data.message && data.message !== 'cancelled_import') {
                toast(`${translate('error')} : ${data.message}`, {
                    type: 'error',
                });
            }
            if (data.message === 'cancelled_import') {
                loadParsingResult();
                setHasLoadedParsingResult(false);
                toast(translate('cancelled_import'), {
                    type: 'success',
                });
            }
        });

        socket.on(`${dbName}_${tenant}-enricher`, (data) => {
            loadEnrichments();
            if (!data.isEnriching) {
                // @ts-expect-error TS2554
                setProgress();
            }
            if (data.message && data.message !== 'cancelled_enricher') {
                toast(`${translate('error')} : ${data.message}`, {
                    type: 'error',
                });
            }
            if (data.message === 'cancelled_enricher') {
                toast(translate('cancelled_enricher'), {
                    type: 'success',
                });
            }
        });

        socket.on(`${dbName}_${tenant}-precomputer`, (data) => {
            loadPrecomputed();
            if (!data.isPrecomputing) {
                // @ts-expect-error TS2554
                setProgress();
            }
            if (data.message && data.message !== 'cancelled_precomputer') {
                toast(`${translate('error')} : ${data.message}`, {
                    type: 'error',
                });
            }
            if (data.message === 'cancelled_precomputer') {
                toast(translate('cancelled_precomputer'), {
                    type: 'success',
                });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (
            progress &&
            // @ts-expect-error TS2339
            progress.status === ProgressStatus.SAVING_DATASET &&
            // @ts-expect-error TS2339
            progress.progress > 0 &&
            !hasLoadedParsingResult
        ) {
            loadParsingResult();
            setHasLoadedParsingResult(true);
        }
    }, [progress, hasLoadedParsingResult, loadParsingResult]);

    return (
        <>
            <Fade
                // @ts-expect-error TS2339
                in={progress && (progress.isJobProgress || progress.isJobError)}
            >
                <Box
                    className="progress-container"
                    sx={styles.progressContainer}
                >
                    <Box
                        sx={styles.progressLabelContainer}
                        aria-label="job-progress"
                    >
                        {/*
                     // @ts-expect-error TS2339 */}
                        {progress?.isJobError ? (
                            // @ts-expect-error TS2769
                            <Warning size={20} />
                        ) : (
                            <CircularProgress
                                variant="indeterminate"
                                color="inherit"
                                size={20}
                            />
                        )}
                        <Box sx={styles.progressLabel}>
                            {/*
                         // @ts-expect-error TS2339 */}
                            {(progress?.label || progress?.status) && (
                                <Typography variant="subtitle2">
                                    {translate(
                                        // @ts-expect-error TS2339
                                        progress?.label || progress?.status,
                                    )}
                                </Typography>
                            )}
                            {progress &&
                                // @ts-expect-error TS2339
                                progress?.type === 'publisher' &&
                                // @ts-expect-error TS2339
                                progress.status && (
                                    <Typography
                                        variant="caption"
                                        // @ts-expect-error TS2339
                                        title={progress?.status}
                                        sx={styles.progressStatus}
                                        noWrap={true}
                                    >
                                        {/*
                                     // @ts-expect-error TS2339 */}
                                        {translate(progress.status)}
                                    </Typography>
                                )}

                            {/*
                         // @ts-expect-error TS2339 */}
                            {(progress?.type === 'enricher' ||
                                // @ts-expect-error TS2339
                                progress?.type === 'precomputer') && (
                                <Typography variant="caption">
                                    {/*
                                 // @ts-expect-error TS2339 */}
                                    {progress.subLabel}
                                </Typography>
                            )}
                            {/* @ts-expect-error TS2339 */}
                            {progress?.status ===
                                ProgressStatus.SAVING_DATASET &&
                                // @ts-expect-error TS2339
                                progress?.subLabel && (
                                    <Typography variant="caption">
                                        {/*
                                     // @ts-expect-error TS2339 */}
                                        {`${progress.progress} ${translate(
                                            // @ts-expect-error TS2339
                                            progress.subLabel,
                                        )}`}
                                    </Typography>
                                )}
                        </Box>
                        {/* @ts-expect-error TS2339 */}
                        {progress?.status !==
                            ProgressStatus.UPLOADING_DATASET &&
                            // @ts-expect-error TS2339
                            progress?.type !== 'precomputer' && (
                                <Button
                                    sx={styles.cancelButton}
                                    color="inherit"
                                    onClick={() => {
                                        setIsCancelDialogOpen(true);
                                    }}
                                >
                                    <Cancel />
                                </Button>
                            )}
                    </Box>
                    {/*
                 // @ts-expect-error TS2339 */}
                    {!!progress?.progress && !!progress?.target && (
                        <LinearProgress
                            sx={{
                                ...styles.progress,
                                '& .MuiLinearProgress-colorPrimary': {
                                    ...styles.colorPrimary,
                                },
                                '& .MuiLinearProgress-barColorPrimary': {
                                    ...styles.barColorPrimary,
                                },
                            }}
                            variant="determinate"
                            // @ts-expect-error TS2339
                            value={(progress.progress / progress.target) * 100}
                        />
                    )}
                </Box>
            </Fade>
            {progress && (
                <CancelProcessDialog
                    isOpen={isCancelDialogOpen}
                    // @ts-expect-error TS2339
                    title={getTitle(progress?.type)}
                    // @ts-expect-error TS2339
                    content={getContent(progress?.type)}
                    onCancel={() => {
                        setIsCancelDialogOpen(false);
                    }}
                    onConfirm={() => {
                        if (!progress) {
                            return;
                        }
                        // @ts-expect-error TS2339
                        jobsApi.cancelJob(progress.type, progress.subLabel);
                        // @ts-expect-error TS2339
                        if (progress.type === 'publisher') {
                            handleCancelPublication();
                            // @ts-expect-error TS2554
                            setProgress();
                        }
                        setIsCancelDialogOpen(false);
                    }}
                />
            )}
        </>
    );
};

// @ts-expect-error TS7006
const getTitle = (type) => {
    switch (type) {
        case 'publisher':
            return 'cancelPublicationTitle';
        case 'precomputer':
            return 'cancelPrecomputerTitle';
        case 'enricher':
            return 'cancelEnrichmentTitle';
        default:
            return 'cancelImportTitle';
    }
};

// @ts-expect-error TS7006
const getContent = (type) => {
    switch (type) {
        case 'publisher':
            return 'cancelPublicationContent';
        case 'precomputer':
            return 'cancelPrecomputerContent';
        case 'enricher':
            return 'cancelEnrichmentContent';
        default:
            return 'cancelImportContent';
    }
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});
const mapDispatchToProps = {
    handlePublishSuccess: () => publishSuccess(),
    // @ts-expect-error TS7006
    handlePublishError: (error) => publishError(error),
    handleCancelPublication: () => publicationCleared(),
    loadParsingResult,
    handleRepublish: () => {
        clearPublished();
        publish();
    },
    finishProgress,
    loadEnrichments,
    loadPrecomputed,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(JobProgressComponent);
