import React, { useCallback, useEffect, useMemo } from 'react';

import EnrichmentCatalogConnected from './EnrichmentCatalog';
import EnrichmentLogsDialogComponent from './EnrichmentLogsDialog';
import EnrichmentPreview from './EnrichmentPreview';

import { ListAlt as ListAltIcon } from '@mui/icons-material';
import { Box, Button, FormGroup, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import {
    launchEnrichment,
    loadEnrichments,
    retryEnrichment,
    type Enrichment,
} from './index';
import { TaskStatus, toast } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import CancelButton from '@lodex/frontend-common/components/CancelButton';
import {
    createEnrichment,
    getPreviewEnrichment,
    updateEnrichment,
} from '../api/enrichment';
import { getJobLogs } from '../api/job';
import { fromEnrichments, fromParsing } from '../selectors';
import { getKeys } from '../subresource/SubresourceForm';
import { DeleteEnrichmentButton } from './DeleteEnrichmentButton';
import EnrichmentStatus from './EnrichmentStatus';
import RunButton from './RunButton';
import { FormProvider, useForm } from 'react-hook-form';
import { TextField } from '@lodex/frontend-common/form-fields/TextField';
import { SwitchField } from '@lodex/frontend-common/form-fields/SwitchField';
import { AutoCompleteField } from '@lodex/frontend-common/form-fields/AutoCompleteField.tsx';
import FormSourceCodeField from '@lodex/frontend-common/components/FormSourceCodeField';
import type { State } from '../reducers';

type NewEnrichment = Omit<Partial<Enrichment>, '_id'>;

export type EnrichmentFormProps = {
    datasetFields: string[];
    excerptLines: Record<string, unknown>[];
    history: {
        push: (path: string) => void;
    };
    initialValues?: Enrichment;
    match: string;
    onLaunchEnrichment: (params: { id: string }) => void;
    onLoadEnrichments: () => void;
    onRetryEnrichment: (params: { id: string }) => void;
    isEnrichmentRunning?: boolean;
    status?: string;
};

export const EnrichmentForm = ({
    datasetFields,
    excerptLines,
    history,
    initialValues,
    onLoadEnrichments,
    onRetryEnrichment,
    status,
}: EnrichmentFormProps) => {
    const formMethods = useForm<NewEnrichment>({
        defaultValues: initialValues,
        mode: 'onChange',
    });
    const { handleSubmit, watch, setValue, formState } = formMethods;
    const formValues = watch();
    const { translate } = useTranslate();
    const [openCatalog, setOpenCatalog] = React.useState(false);
    const [openEnrichmentLogs, setOpenEnrichmentLogs] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [dataPreviewEnrichment, setDataPreviewEnrichment] = React.useState(
        [],
    );
    const [enrichmentLogs, setEnrichmentLogs] = React.useState<string[]>([]);

    const isEditMode = !!initialValues?._id;

    const optionsIdentifier = useMemo(() => {
        const sourceColumn = formValues?.sourceColumn;
        const firstExcerptLine =
            typeof sourceColumn === 'string' && sourceColumn in excerptLines[0]
                ? excerptLines[0]?.[sourceColumn] || []
                : [];
        return getKeys(firstExcerptLine);
    }, [excerptLines, formValues?.sourceColumn]);

    const handleSourcePreview = useCallback(async () => {
        const formValues = watch();
        if (formValues?.advancedMode && !formValues?.rule) {
            return;
        }

        if (!formValues?.advancedMode && !formValues?.sourceColumn) {
            return;
        }

        const res = await getPreviewEnrichment(
            formValues?.advancedMode
                ? { rule: formValues.rule }
                : {
                      sourceColumn: formValues?.sourceColumn,
                      subPath: formValues.subPath,
                  },
        );
        if (res.response) {
            setDataPreviewEnrichment(res.response);
        } else {
            setDataPreviewEnrichment([]);
        }
    }, [watch]);

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
        handleSourcePreview();
        setIsLoading(true);
        if (isEditMode) {
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

    useEffect(() => {
        // We skip preview update if the enrichment has not completed
        if (status === TaskStatus.IN_PROGRESS) {
            return;
        }

        const timeout = setTimeout(handleSourcePreview, 500);
        return () => clearTimeout(timeout);
    }, [
        formValues.rule,
        formValues.sourceColumn,
        formValues.subPath,
        handleSourcePreview,
        status,
    ]);

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
                                    validate={(value) => {
                                        if (!value) {
                                            return translate(
                                                'This field is required',
                                            );
                                        }
                                    }}
                                />
                                {isEditMode && (
                                    <RunButton id={initialValues?._id} />
                                )}
                            </Box>
                            {isEditMode && (
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    gap={2}
                                    mb={2}
                                >
                                    {translate('enrichment_error_count', {
                                        errorCount:
                                            initialValues.errorCount ?? 0,
                                    })}
                                    <Button
                                        color="primary"
                                        onClick={(event) => {
                                            onRetryEnrichment({
                                                id: initialValues._id,
                                            });
                                            event.preventDefault();
                                            event.stopPropagation();
                                        }}
                                        disabled={
                                            (initialValues.errorCount ?? 0) ===
                                            0
                                        }
                                    >
                                        {translate('retry')}
                                    </Button>
                                </Box>
                            )}
                            {isEditMode && (
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    gap={2}
                                >
                                    <Typography>
                                        {translate('enrichment_status')} :
                                        &nbsp;
                                        <EnrichmentStatus
                                            id={initialValues?._id}
                                        />
                                    </Typography>
                                    <Button
                                        sx={{
                                            paddingRight: 0,
                                            paddingLeft: 0,
                                            textDecoration: 'underline',
                                        }}
                                        onClick={() =>
                                            setOpenEnrichmentLogs(true)
                                        }
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
                        </Box>
                        <Box>
                            <FormGroup>
                                <SwitchField
                                    name="advancedMode"
                                    label={translate('advancedMode')}
                                />
                            </FormGroup>
                        </Box>

                        {formValues?.advancedMode && (
                            <Box mb={2}>
                                <FormSourceCodeField
                                    name="rule"
                                    label={translate('expand_rules')}
                                    width="100%"
                                />
                            </Box>
                        )}

                        {!formValues?.advancedMode && (
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
                                    <EnrichmentCatalogConnected
                                        isOpen={openCatalog}
                                        handleClose={() =>
                                            setOpenCatalog(false)
                                        }
                                    />
                                </Box>

                                <Box display="flex" gap={2} mb={2}>
                                    <AutoCompleteField
                                        clearIdentifier={() => {
                                            setValue('subPath', '');
                                        }}
                                        options={datasetFields}
                                        name="sourceColumn"
                                        label={translate('sourceColumn')}
                                        required
                                    />
                                    <AutoCompleteField
                                        name="subPath"
                                        label={translate('subPath')}
                                        options={optionsIdentifier}
                                        disabled={!formValues?.sourceColumn}
                                    />
                                </Box>
                            </Box>
                        )}

                        <Box
                            display="flex"
                            justifyContent={
                                isEditMode ? 'space-between' : 'flex-end'
                            }
                        >
                            {isEditMode && (
                                <DeleteEnrichmentButton
                                    disabled={
                                        initialValues?.status ===
                                            TaskStatus.IN_PROGRESS ||
                                        initialValues?.status ===
                                            TaskStatus.PENDING ||
                                        isLoading
                                    }
                                    id={initialValues._id}
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
                    </Box>
                    <Box width="25rem">
                        <EnrichmentPreview
                            lines={dataPreviewEnrichment}
                            sourceColumn={formValues.sourceColumn}
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
): Pick<
    EnrichmentFormProps,
    'initialValues' | 'status' | 'datasetFields' | 'excerptLines'
> => {
    const enrichment = fromEnrichments
        .enrichments(state)
        .find((enrichment) => enrichment._id === match.params.enrichmentId);
    return {
        initialValues: enrichment,
        status: enrichment?.status,
        datasetFields: fromParsing.getParsedExcerptColumns(state),
        excerptLines: fromParsing.getExcerptLines(state),
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
