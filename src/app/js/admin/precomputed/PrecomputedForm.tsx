import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type MouseEvent,
} from 'react';

import PrecomputedCatalogConnected from './PrecomputedCatalog';
import PrecomputedPreview from './PrecomputedPreview';
import PrecomputedFormLogsDialogComponent from './PrecomputedLogsDialog';
import PrecomputedFormDataDialogComponent from './PrecomputedDataDialog';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PropTypes from 'prop-types';
import SourceValueFromColumns from './SourceValueFromColumns';
import { useForm } from 'react-hook-form';
import { TextField } from '../../reactHookFormFields/TextField';

import { launchPrecomputed, loadPrecomputed } from '.';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fromPrecomputed, fromParsing } from '../selectors';
import { ListAlt as ListAltIcon } from '@mui/icons-material';
import { withRouter } from 'react-router';
import { Box, Button, Chip, Typography, type ButtonProps } from '@mui/material';
import {
    createPrecomputed,
    getPreviewPrecomputed,
    deletePrecomputed,
    updatePrecomputed,
} from '../api/precomputed';
import { getJobLogs } from '../api/job';
import { toast } from '../../../../common/tools/toast';
import {
    FINISHED,
    IN_PROGRESS,
    PENDING,
    ERROR,
    CANCELED,
    PAUSED,
    ON_HOLD,
} from '../../../../common/taskStatus';
import { io } from 'socket.io-client';
import CancelButton from '../../lib/components/CancelButton';
import { DEFAULT_TENANT } from '../../../../common/tools/tenantTools';
import getLocale from '../../../../common/getLocale';
import { useTranslate } from '../../i18n/I18NContext';

const required = (text: string) => (value: unknown) =>
    value && !(value instanceof Array && value.length === 0) ? undefined : text;

function getDisplayTimeStartedAt(startedAt: string) {
    if (!startedAt) {
        return;
    }

    const now = new Date();
    const startedAtDate = new Date(startedAt);
    const diff = now.getTime() - startedAtDate.getTime();

    const diffInMinutes = Math.floor(diff / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    const relativeTime = new Intl.RelativeTimeFormat(getLocale(), {
        numeric: 'auto',
    });
    let timeSinceStarted = '';

    if (diffInHours < 1) {
        timeSinceStarted = relativeTime.format(-diffInMinutes, 'minute');
    } else if (diffInDays < 1) {
        timeSinceStarted = relativeTime.format(-diffInHours, 'hour');
    } else {
        timeSinceStarted = relativeTime.format(-diffInDays, 'day');
    }
    return timeSinceStarted;
}

export const StatusChip = ({
    label,
    color,
    startedAt,
    sx,
}: {
    label: string;
    color?:
        | 'default'
        | 'primary'
        | 'secondary'
        | 'error'
        | 'info'
        | 'success'
        | 'warning';
    startedAt?: string | null;
    sx?: object;
}) => {
    const [spentTime, setSpentTime] = useState(
        startedAt ? getDisplayTimeStartedAt(startedAt) : '',
    );
    useEffect(() => {
        if (!startedAt) return;
        const interval = setInterval(() => {
            setSpentTime(getDisplayTimeStartedAt(startedAt));
        }, 59000);
        return () => clearInterval(interval);
    }, [startedAt]);
    const finalLabel = `${label}${startedAt ? ` (${spentTime})` : ''}`;
    return <Chip component="span" label={finalLabel} color={color} sx={sx} />;
};

StatusChip.propTypes = {
    color: PropTypes.string,
    label: PropTypes.string.isRequired,
    startedAt: PropTypes.string,
    sx: PropTypes.object,
};

export const renderStatus = (
    status: string,
    translate: (key: string) => string,
    startedAt: string | null = null,
) => {
    if (status === PENDING) {
        return (
            <StatusChip
                label={translate('precomputed_status_pending')}
                color="warning"
                startedAt={startedAt}
            />
        );
    }
    if (status === IN_PROGRESS) {
        return (
            <StatusChip
                label={translate('precomputed_status_running')}
                color="info"
                startedAt={startedAt}
            />
        );
    }

    if (status === PAUSED) {
        return (
            <StatusChip
                label={translate('precomputed_status_paused')}
                color="info"
            />
        );
    }

    if (status === FINISHED) {
        return (
            <StatusChip
                label={translate('precomputed_status_done')}
                color="success"
            />
        );
    }

    if (status === ERROR) {
        return (
            <StatusChip
                label={translate('precomputed_status_error')}
                color="error"
            />
        );
    }

    if (status === CANCELED) {
        return (
            <StatusChip
                label={translate('precomputed_status_canceled')}
                color="warning"
            />
        );
    }

    if (status === ON_HOLD) {
        return (
            <StatusChip
                label={translate('precomputed_status_hold')}
                sx={{ backgroundColor: '#539CE1', color: '#fff' }}
                startedAt={startedAt}
            />
        );
    }

    return (
        <StatusChip
            label={translate('precomputed_status_not_started')}
            sx={{ backgroundColor: 'neutral' }}
        />
    );
};

export const RunButton = ({
    handleLaunchPrecomputed,
    precomputedStatus,
    translate,
    variant = 'contained',
}: {
    handleLaunchPrecomputed: {
        (event: any): void;
        (event: any): void;
        (arg0: any): void;
    };
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

type PreComputation = {
    name: string;
    webServiceUrl: string;
    sourceColumns: string[];
    subPath: string;
};

type PrecomputedFormProps = {
    datasetFields: string[];
    formValues: PreComputation;
    history: any;
    initialValues: any;
    onLaunchPrecomputed: (params: { id: string; action: string }) => void;
    onLoadPrecomputedData: () => void;
    isPrecomputedRunning: boolean;
    handleSubmit: () => void;
    submitting: boolean;
};

// COMPONENT PART
export const PrecomputedForm = ({
    datasetFields,
    history,
    initialValues,
    onLaunchPrecomputed,
    onLoadPrecomputedData,
    isPrecomputedRunning,
    submitting,
}: PrecomputedFormProps) => {
    const { translate } = useTranslate();
    const [openCatalog, setOpenCatalog] = React.useState(false);
    const [openPrecomputedLogs, setOpenPrecomputedLogs] = React.useState(false);
    const [openPrecomputedData, setOpenPrecomputedData] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [dataPreviewPrecomputed, setDataPreviewPrecomputed] = React.useState(
        [],
    );
    const [precomputedLogs, setPrecomputedLogs] = React.useState<string[]>([]);
    const [precomputedStatus, setPrecomputedStatus] = React.useState<string>(
        initialValues?.status,
    );

    const { handleSubmit, getValues, watch, control, setValue } =
        useForm<PreComputation>({
            defaultValues: initialValues,
            mode: 'onChange',
        });

    const sourceColumns = watch('sourceColumns');
    const webServiceUrl = watch('webServiceUrl');

    const requiredField = useMemo(
        () => required(translate('error_field_required')),
        [translate],
    );

    const isEditMode = !!initialValues?._id;

    const handleSourcePreview = async (formValues: {
        name?: string;
        webServiceUrl?: string;
        sourceColumns: string[];
        subPath?: string;
    }) => {
        if (!formValues?.sourceColumns) {
            return;
        }

        const res = await getPreviewPrecomputed({
            sourceColumns: formValues?.sourceColumns,
        });
        if (res.response) {
            setDataPreviewPrecomputed(res.response);
        } else {
            setDataPreviewPrecomputed([]);
        }
    };

    const handleAddPrecomputed = async (formValues: PreComputation) => {
        const res = await createPrecomputed(formValues);
        if (res.response) {
            toast(translate('precomputed_added_success'), {
                type: toast.TYPE.SUCCESS,
            });
            history.push(`/data/precomputed/${res.response._id}`);
        } else {
            toast(`${res.error}`, {
                type: toast.TYPE.ERROR,
            });
        }
    };

    const handleUpdatePrecomputed = async (formValues: PreComputation) => {
        const { data, ...precomputedDataToUpdate } = {
            ...initialValues,
            ...formValues,
        };
        const res = await updatePrecomputed(precomputedDataToUpdate);
        if (res.response) {
            toast(translate('precomputed_updated_success'), {
                type: toast.TYPE.SUCCESS,
            });
            onLoadPrecomputedData();
        } else {
            toast(`${res.error}`, {
                type: toast.TYPE.ERROR,
            });
        }
    };

    const onSubmit = async (values: PreComputation) => {
        setIsLoading(true);
        if (isEditMode) {
            await handleUpdatePrecomputed(values);
        } else {
            await handleAddPrecomputed(values);
        }
        setIsLoading(false);
    };

    const handleDeletePrecomputed = async () => {
        setIsLoading(true);
        const res = await deletePrecomputed(initialValues._id);
        if (res.response) {
            toast(translate('precomputed_deleted_success'), {
                type: toast.TYPE.SUCCESS,
            });
            history.push('/data/precomputed');
        } else {
            toast(`${res.error}`, {
                type: toast.TYPE.ERROR,
            });
        }
        setIsLoading(false);
    };

    const handleBack = () => {
        history.push('/data/precomputed');
    };

    const handleLaunchPrecomputed = (event: Event) => {
        event.preventDefault();
        if (isPrecomputedRunning) {
            toast(translate('pending_precomputed'), {
                type: toast.TYPE.INFO,
            });
        }
        onLaunchPrecomputed({
            id: initialValues._id,
            action: precomputedStatus === FINISHED ? 'relaunch' : 'launch',
        });
    };

    const handleGetLogs = useCallback(async () => {
        if (initialValues?.jobId) {
            getJobLogs(initialValues.jobId).then(
                (result: any) => {
                    setPrecomputedLogs(result.response.logs.reverse());
                },
                () => {
                    toast(translate('logs_error'), {
                        type: toast.TYPE.ERROR,
                    });
                },
            );
        }
    }, [initialValues, translate]);

    useEffect(() => {
        handleGetLogs();
        const socket = io();
        const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;
        const dbName = sessionStorage.getItem('lodex-dbName');
        socket.on(
            `${dbName}_${tenant}-precomputed-job-${initialValues?.jobId}`,
            (data) => {
                let lastLine;
                let parsedData;
                if (Array.isArray(data)) {
                    setPrecomputedLogs((currentState: any) => [
                        ...data,
                        ...currentState,
                    ]);
                    lastLine = data[0];
                } else {
                    setPrecomputedLogs((currentState) => [
                        data,
                        ...currentState,
                    ]);
                    lastLine = data;
                }
                try {
                    parsedData = JSON.parse(lastLine);
                } catch {
                    console.error('Error parsing data', lastLine);
                }

                if (parsedData && parsedData.status) {
                    setPrecomputedStatus(parsedData.status);
                }
            },
        );
        socket.on('${tenant}-connect_error', () => {
            handleGetLogs();
        });
        return () => {
            socket.disconnect();
        };
    }, [handleGetLogs, initialValues?.jobId]);

    useEffect(() => {
        const formValues = getValues();
        handleSourcePreview(formValues);
    }, [getValues, sourceColumns, webServiceUrl]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box mt={3} display="flex" gap={6}>
                <Box sx={{ flex: 2 }}>
                    <Box>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={2}
                            mb={2}
                        >
                            <TextField
                                name="name"
                                label={translate('fieldName')}
                                validate={requiredField}
                                control={control}
                                fullWidth
                            />
                            {isEditMode && (
                                <RunButton
                                    variant="outlined"
                                    handleLaunchPrecomputed={
                                        handleLaunchPrecomputed
                                    }
                                    precomputedStatus={precomputedStatus}
                                    translate={translate}
                                />
                            )}
                        </Box>
                        {isEditMode && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={2}
                                sx={{ marginBottom: 2 }}
                            >
                                <Typography>
                                    {translate('precomputed_status')} : &nbsp;
                                    {renderStatus(
                                        precomputedStatus,
                                        translate,
                                        initialValues?.startedAt,
                                    )}
                                </Typography>
                                <Box>
                                    <Button
                                        variant={
                                            'link' as ButtonProps['variant']
                                        }
                                        sx={{
                                            paddingRight: 0,
                                            paddingLeft: 0,
                                            textDecoration: 'underline',
                                        }}
                                        onClick={() =>
                                            setOpenPrecomputedLogs(true)
                                        }
                                    >
                                        {translate('see_logs')}
                                    </Button>
                                    <PrecomputedFormLogsDialogComponent
                                        isOpen={openPrecomputedLogs}
                                        logs={precomputedLogs}
                                        handleClose={() =>
                                            setOpenPrecomputedLogs(false)
                                        }
                                    />
                                    {isEditMode &&
                                        precomputedStatus === FINISHED && (
                                            <>
                                                <Button
                                                    variant={
                                                        'link' as ButtonProps['variant']
                                                    }
                                                    sx={{
                                                        marginLeft: 2,
                                                        paddingRight: 0,
                                                        paddingLeft: 0,
                                                        textDecoration:
                                                            'underline',
                                                    }}
                                                    onClick={() =>
                                                        setOpenPrecomputedData(
                                                            true,
                                                        )
                                                    }
                                                >
                                                    {translate('see_data')}
                                                </Button>
                                                <PrecomputedFormDataDialogComponent
                                                    isOpen={openPrecomputedData}
                                                    precomputedID={
                                                        initialValues._id
                                                    }
                                                    handleClose={() =>
                                                        setOpenPrecomputedData(
                                                            false,
                                                        )
                                                    }
                                                />
                                            </>
                                        )}
                                </Box>
                            </Box>
                        )}
                    </Box>

                    <Box>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={2}
                            mb={2}
                        >
                            <TextField
                                name="webServiceUrl"
                                label={translate('webServiceUrl')}
                                control={control}
                                validate={requiredField}
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setOpenCatalog(true)}
                                style={{ height: '100%' }}
                            >
                                <ListAltIcon fontSize="medium" />
                            </Button>
                            <PrecomputedCatalogConnected
                                isOpen={openCatalog}
                                handleClose={() => setOpenCatalog(false)}
                                selectedWebServiceUrl={webServiceUrl}
                                onChange={(value: string) => {
                                    setValue('webServiceUrl', value);
                                }}
                            />
                        </Box>

                        <Box display="flex" gap={2} mb={2}>
                            <SourceValueFromColumns
                                name="sourceColumns"
                                label={translate('sourceColumns')}
                                options={datasetFields}
                                control={control}
                                validate={requiredField}
                            />
                        </Box>
                    </Box>

                    <Box
                        display="flex"
                        justifyContent={
                            isEditMode ? 'space-between' : 'flex-end'
                        }
                    >
                        {isEditMode && (
                            <Button
                                variant="contained"
                                color="warning"
                                sx={{ height: '100%' }}
                                onClick={handleDeletePrecomputed}
                                disabled={isLoading}
                            >
                                {translate('delete')}
                            </Button>
                        )}
                        <Box>
                            <CancelButton
                                sx={{ height: '100%' }}
                                onClick={handleBack}
                            >
                                {translate('back')}
                            </CancelButton>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ height: '100%' }}
                                type="submit"
                                disabled={
                                    submitting ||
                                    isLoading ||
                                    precomputedStatus === IN_PROGRESS ||
                                    precomputedStatus === PENDING
                                }
                            >
                                {translate('save')}
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Box width="25rem">
                    <PrecomputedPreview
                        lines={dataPreviewPrecomputed}
                        sourceColumns={sourceColumns}
                    />
                </Box>
            </Box>
        </form>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { match }) => ({
    initialValues: fromPrecomputed
        // @ts-expect-error TS2345
        .precomputed(state)
        // @ts-expect-error TS2345
        .find((precomputed) => precomputed._id === match.params.precomputedId),
    // @ts-expect-error TS2322
    datasetFields: fromParsing.getParsedExcerptColumns(state),
    isPrecomputedRunning: !!fromPrecomputed
        // @ts-expect-error TS2339
        .precomputed(state)
        // @ts-expect-error TS7006
        .find((precomputedData) => precomputedData.status === IN_PROGRESS),
});
const mapDispatchToProps = {
    onLaunchPrecomputed: launchPrecomputed,
    onLoadPrecomputedData: loadPrecomputed,
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(PrecomputedForm);
