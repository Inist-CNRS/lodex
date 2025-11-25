import { labelByStatus, TaskStatus, toast } from '@lodex/common';
import CancelButton from '@lodex/frontend-common/components/CancelButton';
import FormSourceCodeField from '@lodex/frontend-common/components/FormSourceCodeField';
import { AutoCompleteField } from '@lodex/frontend-common/form-fields/AutoCompleteField.tsx';
import { SwitchField } from '@lodex/frontend-common/form-fields/SwitchField';
import { TextField } from '@lodex/frontend-common/form-fields/TextField';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { ListAlt as ListAltIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    FormGroup,
    ListItem,
    Stack,
    Typography,
} from '@mui/material';
import { useDebouncedValue } from '@tanstack/react-pacer/debouncer';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { createEnrichment, updateEnrichment } from '../api/enrichment';
import { getJobLogs } from '../api/job';
import type { State } from '../reducers';
import { fromEnrichments } from '../selectors';
import { DeleteEnrichmentButton } from './DeleteEnrichmentButton';
import EnrichmentCatalogConnected from './EnrichmentCatalog';
import EnrichmentLogsDialogComponent from './EnrichmentLogsDialog';
import EnrichmentPreview from './EnrichmentPreview';
import EnrichmentStatus from './EnrichmentStatus';
import {
    launchEnrichment,
    loadEnrichments,
    retryEnrichment,
    type Enrichment,
} from './index';
import RunButton from './RunButton';
import { useListDataSource } from './useListDataSource.tsx';
import {
    usePreviewDataSource,
    type UsePreviewDataSourceParams,
} from './usePreviewDataSource.tsx';

type NewEnrichment = Omit<Partial<Enrichment>, '_id'>;

export type EnrichmentFormProps = {
    history: {
        push: (path: string) => void;
    };
    initialValues?: Partial<Enrichment>;
    match: string;
    onLaunchEnrichment: (params: { id: string }) => void;
    onLoadEnrichments: () => void;
    onRetryEnrichment: (params: { id: string }) => void;
    isEnrichmentRunning?: boolean;
};

export const EnrichmentForm = ({
    history,
    initialValues,
    onLoadEnrichments,
    onRetryEnrichment,
}: EnrichmentFormProps) => {
    const enrichmentId = initialValues?._id;

    const { translate } = useTranslate();

    const formMethods = useForm<NewEnrichment>({
        defaultValues: initialValues,
        mode: 'onChange',
    });

    const { handleSubmit, watch, setValue, formState } = formMethods;
    const formValues = watch();

    const {
        isDataSourceListPending,
        dataSources,
        getDataSourceById,
        getDataSourceLabel,
    } = useListDataSource();

    const selectedDataSource = useMemo(() => {
        return formValues?.dataSource
            ? getDataSourceById(formValues?.dataSource)
            : undefined;
    }, [formValues?.dataSource, getDataSourceById]);

    const datasetFields = useMemo(() => {
        return selectedDataSource?.columns.map((column) => column.name) ?? [];
    }, [selectedDataSource]);

    const selectedColumn = useMemo(() => {
        return formValues?.sourceColumn && selectedDataSource
            ? selectedDataSource.columns.find(
                  (col) => col.name === formValues.sourceColumn,
              )
            : undefined;
    }, [formValues?.sourceColumn, selectedDataSource]);

    const subPathOptions = useMemo(() => {
        return selectedColumn?.subPaths ?? [];
    }, [selectedColumn]);

    const [debouncedFormValues] = useDebouncedValue<
        NewEnrichment,
        UsePreviewDataSourceParams
    >(formValues, {
        wait: 300,
    });

    const previewDataSourceParams = useMemo(() => {
        if (debouncedFormValues?.advancedMode) {
            return {
                dataSource: selectedDataSource,
                rule: debouncedFormValues?.rule,
            };
        }
        return {
            dataSource: selectedDataSource,
            sourceColumn: debouncedFormValues?.sourceColumn,
            subPath: debouncedFormValues?.subPath,
        };
    }, [debouncedFormValues, selectedDataSource]);

    const { previewData, isPreviewPending } = usePreviewDataSource(
        previewDataSourceParams,
    );

    const handleDataSourceChange = (value: string) => {
        setValue('dataSource', value);
    };

    const handleSourceColumnChange = (value: string) => {
        setValue('subPath', '');
        setValue('sourceColumn', value);
    };

    const [openCatalog, setOpenCatalog] = React.useState(false);
    const [openEnrichmentLogs, setOpenEnrichmentLogs] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [enrichmentLogs, setEnrichmentLogs] = React.useState<string[]>([]);

    const handleAddEnrichment = async (enrichment: NewEnrichment) => {
        const res = await createEnrichment(enrichment);
        if (res.response) {
            toast(translate('enrichment_added_success'), {
                type: 'success',
            });
            history.push(`/data/enrichment/${res.response._id}`);
        } else {
            toast(`${res.error}`, {
                type: 'error',
            });
        }
    };

    const handleUpdateEnrichment = async (enrichment: NewEnrichment) => {
        const res = await updateEnrichment({
            ...initialValues,
            ...enrichment,
        });
        if (res.response) {
            toast(translate('enrichment_updated_success'), {
                type: 'success',
            });
            onLoadEnrichments();
        } else {
            toast(`${res.error}`, {
                type: 'error',
            });
        }
    };

    const onSubmit = async (enrichment: NewEnrichment) => {
        setIsLoading(true);
        if (enrichmentId) {
            await handleUpdateEnrichment(enrichment);
        } else {
            await handleAddEnrichment(enrichment);
        }
        setIsLoading(false);
    };

    const handleBack = () => {
        history.push('/data/enrichment');
    };

    const handleGetLogs = useCallback(async () => {
        if (initialValues?.jobId) {
            getJobLogs(initialValues.jobId as string).then(
                (result: {
                    response: {
                        logs: string[];
                    };
                }) => {
                    setEnrichmentLogs(result.response.logs.reverse());
                },
                () => {
                    toast(translate('logs_error'), {
                        type: 'error',
                    });
                },
            );
        }
    }, [initialValues?.jobId, translate]);

    useEffect(() => {
        handleGetLogs();
    }, [handleGetLogs, initialValues?.status]);

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box mt={3} display="flex" gap="3rem">
                    <Stack sx={{ flex: 2 }} gap={2}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            gap="1rem"
                            mb="1rem"
                        >
                            <TextField
                                name="name"
                                label={translate('fieldName')}
                                required
                                fullWidth
                                validate={(value) => {
                                    if (!value) {
                                        return translate(
                                            'This field is required',
                                        );
                                    }
                                }}
                            />
                            {enrichmentId && <RunButton id={enrichmentId} />}
                        </Box>
                        {enrichmentId && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                gap="1rem"
                            >
                                {translate('enrichment_error_count', {
                                    errorCount: initialValues.errorCount ?? 0,
                                })}
                                <Button
                                    color="primary"
                                    onClick={(event) => {
                                        onRetryEnrichment({
                                            id: enrichmentId,
                                        });
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }}
                                    disabled={
                                        (initialValues.errorCount ?? 0) === 0
                                    }
                                >
                                    {translate('retry')}
                                </Button>
                            </Box>
                        )}
                        {enrichmentId && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                gap="1rem"
                            >
                                <Typography>
                                    {translate('enrichment_status')} : &nbsp;
                                    <EnrichmentStatus id={enrichmentId} />
                                </Typography>
                                <Button
                                    sx={{
                                        paddingRight: 0,
                                        paddingLeft: 0,
                                        textDecoration: 'underline',
                                    }}
                                    onClick={() => setOpenEnrichmentLogs(true)}
                                >
                                    {translate('see_logs')}
                                </Button>
                                <EnrichmentLogsDialogComponent
                                    isOpen={openEnrichmentLogs}
                                    logs={enrichmentLogs}
                                    handleClose={() =>
                                        setOpenEnrichmentLogs(false)
                                    }
                                />
                            </Box>
                        )}

                        <Box>
                            <AutoCompleteField
                                clearIdentifier={() => {
                                    handleDataSourceChange('');
                                }}
                                options={dataSources}
                                name="dataSource"
                                label={translate('dataSource')}
                                required
                                disabled={isDataSourceListPending}
                                value={formValues?.dataSource ?? ''}
                                onChange={(_, newValue) => {
                                    handleDataSourceChange(newValue);
                                }}
                                getOptionLabel={getDataSourceLabel}
                                renderOption={(props, option) => {
                                    const dataSource =
                                        getDataSourceById(option);
                                    if (!dataSource) {
                                        return null;
                                    }

                                    const statusLabel = dataSource.isEmpty
                                        ? 'enrichment_status_empty'
                                        : dataSource.status &&
                                            dataSource.status !==
                                                TaskStatus.FINISHED
                                          ? labelByStatus[
                                                dataSource.status ?? ''
                                            ]
                                          : null;
                                    return (
                                        <ListItem
                                            {...props}
                                            key={dataSource.id}
                                            disabled={dataSource.isEmpty}
                                        >
                                            <Typography>
                                                {dataSource.name}{' '}
                                                {statusLabel &&
                                                    `(${translate(statusLabel)})`}
                                            </Typography>
                                        </ListItem>
                                    );
                                }}
                            />
                        </Box>

                        <FormGroup>
                            <SwitchField
                                name="advancedMode"
                                label={translate('advancedMode')}
                            />
                        </FormGroup>

                        {formValues?.advancedMode && (
                            <FormSourceCodeField
                                name="rule"
                                label={translate('expand_rules')}
                                width="100%"
                            />
                        )}

                        {!formValues?.advancedMode && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                gap="1rem"
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
                                <EnrichmentCatalogConnected
                                    isOpen={openCatalog}
                                    handleClose={() => setOpenCatalog(false)}
                                />
                            </Box>
                        )}

                        {!formValues?.advancedMode && (
                            <Box display="flex" gap="1rem" mb="1rem">
                                <AutoCompleteField
                                    clearIdentifier={() => {
                                        handleSourceColumnChange('');
                                    }}
                                    options={datasetFields}
                                    name="sourceColumn"
                                    label={translate('sourceColumn')}
                                    required
                                    disabled={!selectedDataSource}
                                    value={formValues?.sourceColumn ?? ''}
                                    onChange={(_, newValue) => {
                                        handleSourceColumnChange(newValue);
                                    }}
                                />
                                <AutoCompleteField
                                    name="subPath"
                                    label={translate('subPath')}
                                    options={subPathOptions}
                                    disabled={!selectedColumn}
                                />
                            </Box>
                        )}

                        <Box
                            display="flex"
                            justifyContent={
                                enrichmentId ? 'space-between' : 'flex-end'
                            }
                        >
                            {enrichmentId && (
                                <DeleteEnrichmentButton
                                    disabled={
                                        initialValues?.status ===
                                            TaskStatus.IN_PROGRESS ||
                                        initialValues?.status ===
                                            TaskStatus.PENDING ||
                                        isLoading
                                    }
                                    id={enrichmentId}
                                    onDeleteStart={() => setIsLoading(true)}
                                    onDeleteEnd={() => {
                                        setIsLoading(false);
                                    }}
                                    history={history}
                                />
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
                                        isLoading ||
                                        initialValues?.status ===
                                            TaskStatus.IN_PROGRESS ||
                                        initialValues?.status ===
                                            TaskStatus.PENDING ||
                                        formState.isValid === false
                                    }
                                >
                                    {translate('save')}
                                </Button>
                            </Box>
                        </Box>
                    </Stack>
                    <Box width="25rem">
                        <EnrichmentPreview
                            isPending={isPreviewPending}
                            lines={previewData}
                            sourceColumn={selectedColumn?.name}
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
        match: { params: { enrichmentId: string } };
    },
): Pick<EnrichmentFormProps, 'initialValues'> => {
    const enrichment = fromEnrichments
        .enrichments(state)
        .find((enrichment) => enrichment._id === match.params.enrichmentId);
    return {
        initialValues: {
            dataSource: 'dataset',
            ...enrichment,
        },
    };
};
const mapDispatchToProps = {
    onLaunchEnrichment: launchEnrichment,
    onLoadEnrichments: loadEnrichments,
    onRetryEnrichment: retryEnrichment,
};

export default compose<EnrichmentFormProps, Record<string, never>>(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(EnrichmentForm);
