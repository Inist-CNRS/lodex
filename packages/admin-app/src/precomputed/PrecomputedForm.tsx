import React, { useCallback, useEffect, type MouseEvent } from 'react';

import PrecomputedCatalogConnected from './PrecomputedCatalog';
import PrecomputedPreview from './PrecomputedPreview';
import PrecomputedFormLogsDialogComponent from './PrecomputedLogsDialog';
import PrecomputedFormDataDialogComponent from './PrecomputedDataDialog';
import SourceValueFromColumns from './SourceValueFromColumns';
import { FormProvider, useForm } from 'react-hook-form';
import { TextField } from '@lodex/frontend-common/form-fields/TextField';
import { type State } from '../reducers';

import { launchPrecomputed, loadPrecomputed } from './index';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fromPrecomputed, fromParsing } from '../selectors';
import { ListAlt as ListAltIcon } from '@mui/icons-material';
import { withRouter } from 'react-router';
import { Box, Button, Typography, type ButtonProps } from '@mui/material';
import {
    createPrecomputed,
    getPreviewPrecomputed,
    deletePrecomputed,
    updatePrecomputed,
} from '../api/precomputed';
import { getJobLogs } from '../api/job';
import {
    DEFAULT_TENANT,
    TaskStatus,
    type TaskStatusType,
    type NewPreComputation,
    toast,
} from '@lodex/common';
import { io } from 'socket.io-client';
import CancelButton from '@lodex/frontend-common/components/CancelButton';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { PrecomputedStatus } from './PrecomputedStatus';
import { RunButton } from './RunButton';

export type PrecomputedFormProps = {
    datasetFields: string[];
    formValues: NewPreComputation;
    history: {
        push: (path: string) => void;
    };
    initialValues?: {
        _id: string;
        status: TaskStatusType;
        jobId: string;
        startedAt: string;
        name: string;
        webServiceUrl: string;
        sourceColumns: string[];
        subPath: string;
        data: unknown;
    };
    onLaunchPrecomputed: (params: { id: string; action: string }) => void;
    onLoadPrecomputedData: () => void;
    isPrecomputedRunning: boolean;
    handleSubmit: () => void;
    submitting: boolean;
    children?: React.ReactNode;
};

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
    const [precomputedStatus, setPrecomputedStatus] = React.useState<
        TaskStatusType | undefined
    >(initialValues?.status);

    const formMethods = useForm<NewPreComputation>({
        defaultValues: {
            name: initialValues?.name,
            webServiceUrl: initialValues?.webServiceUrl,
            sourceColumns: initialValues?.sourceColumns,
            subPath: initialValues?.subPath,
        },
        mode: 'onChange',
    });

    const { handleSubmit, getValues, watch, setValue } = formMethods;

    const sourceColumns = watch('sourceColumns');
    const webServiceUrl = watch('webServiceUrl');

    const isEditMode = !!initialValues?._id;

    useEffect(() => {
        if (initialValues?.status) {
            setPrecomputedStatus(initialValues.status);
        }
    }, [initialValues?.status]);

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

    const handleAddPrecomputed = async (formValues: NewPreComputation) => {
        const res = await createPrecomputed(formValues);
        if (res.response) {
            toast(translate('precomputed_added_success'), {
                type: 'success',
            });
            history.push(`/data/precomputed/${res.response._id}`);
        } else {
            toast(`${res.error}`, {
                type: 'error',
            });
        }
    };

    const handleUpdatePrecomputed = async (formValues: NewPreComputation) => {
        if (!initialValues) {
            return;
        }
        const { data, ...precomputedDataToUpdate } = {
            ...initialValues,
            ...formValues,
        };
        const res = await updatePrecomputed(precomputedDataToUpdate);
        if (res.response) {
            toast(translate('precomputed_updated_success'), {
                type: 'success',
            });
            onLoadPrecomputedData();
        } else {
            toast(`${res.error}`, {
                type: 'error',
            });
        }
    };

    const onSubmit = async (values: NewPreComputation) => {
        setIsLoading(true);
        if (isEditMode) {
            await handleUpdatePrecomputed(values);
        } else {
            await handleAddPrecomputed(values);
        }
        setIsLoading(false);
    };

    const handleDeletePrecomputed = async () => {
        if (!initialValues) {
            return;
        }
        setIsLoading(true);
        const res = await deletePrecomputed(initialValues?._id);
        if (res.response) {
            toast(translate('precomputed_deleted_success'), {
                type: 'success',
            });
            history.push('/data/precomputed');
        } else {
            toast(`${res.error}`, {
                type: 'error',
            });
        }
        setIsLoading(false);
    };

    const handleBack = () => {
        history.push('/data/precomputed');
    };

    const handleLaunchPrecomputed = (event: MouseEvent) => {
        event.preventDefault();
        if (!initialValues) {
            return;
        }
        if (isPrecomputedRunning) {
            toast(translate('pending_precomputed'), {
                type: 'info',
            });
        }
        onLaunchPrecomputed({
            id: initialValues._id,
            action:
                precomputedStatus === TaskStatus.FINISHED
                    ? 'relaunch'
                    : 'launch',
        });
    };

    const handleGetLogs = useCallback(async () => {
        if (initialValues?.jobId) {
            getJobLogs(initialValues.jobId).then(
                (result: { response: { logs: string[] } }) => {
                    setPrecomputedLogs(result.response.logs.reverse());
                },
                () => {
                    toast(translate('logs_error'), {
                        type: 'error',
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
                if (Array.isArray(data)) {
                    setPrecomputedLogs((currentState) => [
                        ...data,
                        ...currentState,
                    ]);
                } else {
                    setPrecomputedLogs((currentState) => [
                        data,
                        ...currentState,
                    ]);
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
        <FormProvider {...formMethods}>
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
                                    required
                                    fullWidth
                                />
                                {isEditMode && (
                                    <RunButton
                                        variant="outlined"
                                        handleLaunchPrecomputed={
                                            handleLaunchPrecomputed
                                        }
                                        precomputedStatus={precomputedStatus}
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
                                        {translate('precomputed_status')} :
                                        &nbsp;
                                        <PrecomputedStatus
                                            status={precomputedStatus}
                                            startedAt={initialValues?.startedAt}
                                        />
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
                                            precomputedStatus ===
                                                TaskStatus.FINISHED && (
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
                                                        isOpen={
                                                            openPrecomputedData
                                                        }
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
                                    required
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
                                    required
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
                                        precomputedStatus ===
                                            TaskStatus.IN_PROGRESS ||
                                        precomputedStatus === TaskStatus.PENDING
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
        </FormProvider>
    );
};

const mapStateToProps = (
    state: State,
    {
        match,
    }: {
        match: { params: { precomputedId: string } };
    },
) => ({
    initialValues: fromPrecomputed
        .precomputed(state)
        .find((precomputed) => precomputed._id === match.params.precomputedId),
    datasetFields: fromParsing.getParsedExcerptColumns(state),
    isPrecomputedRunning: !!fromPrecomputed
        .precomputed(state)
        .find(
            (precomputedData) =>
                precomputedData.status === TaskStatus.IN_PROGRESS,
        ),
});
const mapDispatchToProps = {
    onLaunchPrecomputed: launchPrecomputed,
    onLoadPrecomputedData: loadPrecomputed,
};

export default compose<PrecomputedFormProps, Record<string, never>>(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(PrecomputedForm);
