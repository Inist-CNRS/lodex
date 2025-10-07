import React, { useCallback, useEffect, useMemo } from 'react';

import EnrichmentCatalogConnected from './EnrichmentCatalog';
import EnrichmentLogsDialogComponent from './EnrichmentLogsDialog';
import EnrichmentPreview from './EnrichmentPreview';

import { ListAlt as ListAltIcon } from '@mui/icons-material';
import { Box, Button, ListItem, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { launchEnrichment, loadEnrichments, retryEnrichment } from '.';
import { IN_PROGRESS, PENDING } from '../../../../common/taskStatus';
import { toast } from '../../../../common/tools/toast';
import { useTranslate } from '../../i18n/I18NContext';
import CancelButton from '../../lib/components/CancelButton';
import {
    createEnrichment,
    getPreviewEnrichment,
    updateEnrichment,
} from '../api/enrichment';
import { getJobLogs } from '../api/job';
import { fromEnrichments, fromParsing } from '../selectors';
import { getKeys } from '../subresource/SubresourceForm';
import { DeleteEnrichmentButton } from './DeleteEnrichmentButton';
import { default as EnrichmentStatus } from './EnrichmentStatus';
import { default as RunButton } from './RunButton';
import { FormProvider, useForm } from 'react-hook-form';
import { TextField } from '../../reactHookFormFields/TextField';
import { Switch } from '../../reactHookFormFields/Switch';
import { Autocomplete } from '../../reactHookFormFields/AutoComplete';
import FormSourceCodeField from '../../lib/components/FormSourceCodeField';

type Enrichment = {
    _id: string;
    name: string;
    advancedMode: boolean;
    rule: string;
    sourceColumn: string;
    errorCount?: number;
    jobId: string;
    status: string;
    webServiceUrl: string;
    sourceColumns: string[];
    subPath: string;
};

type NewEnrichment = Omit<Enrichment, '_id'>;

type EnrichmentFormProps = {
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

// COMPONENT PART
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
        defaultValues: {
            name: initialValues?.name,
            webServiceUrl: initialValues?.webServiceUrl,
            sourceColumns: initialValues?.sourceColumns,
            subPath: initialValues?.subPath,
        },
        mode: 'onChange',
    });
    const { handleSubmit, getValues, setValue } = formMethods;
    const formValues = getValues();
    const { translate } = useTranslate();
    const [openCatalog, setOpenCatalog] = React.useState(false);
    const [openEnrichmentLogs, setOpenEnrichmentLogs] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [dataPreviewEnrichment, setDataPreviewEnrichment] = React.useState(
        [],
    );
    const [enrichmentLogs, setEnrichmentLogs] = React.useState([]);

    const isEditMode = !!initialValues?._id;

    const optionsIdentifier = useMemo(() => {
        const firstExcerptLine = formValues?.sourceColumn
            ? excerptLines[0]?.[formValues?.sourceColumn] || []
            : [];
        return getKeys(firstExcerptLine);
    }, [excerptLines, formValues?.sourceColumn]);

    const handleSourcePreview = useCallback(async () => {
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
    }, [formValues]);

    const handleAddEnrichment = async () => {
        const res = await createEnrichment(formValues);
        if (res.response) {
            toast(translate('enrichment_added_success'), {
                type: toast.TYPE.SUCCESS,
            });
            history.push(`/data/enrichment/${res.response._id}`);
        } else {
            toast(`${res.error}`, {
                type: toast.TYPE.ERROR,
            });
        }
    };

    const handleUpdateEnrichment = async () => {
        const enrichmentToUpdate = {
            ...initialValues,
            ...formValues,
        };
        const res = await updateEnrichment(enrichmentToUpdate);
        if (res.response) {
            toast(translate('enrichment_updated_success'), {
                type: toast.TYPE.SUCCESS,
            });
            onLoadEnrichments();
        } else {
            toast(`${res.error}`, {
                type: toast.TYPE.ERROR,
            });
        }
    };

    const onSubmit = async () => {
        handleSourcePreview();
        setIsLoading(true);
        if (isEditMode) {
            await handleUpdateEnrichment();
        } else {
            await handleAddEnrichment();
        }
        setIsLoading(false);
    };

    const handleCancel = () => {
        history.push('/data/enrichment');
    };

    const handleGetLogs = useCallback(async () => {
        if (initialValues?.jobId) {
            getJobLogs(initialValues.jobId).then(
                // @ts-expect-error TS7006
                (result) => {
                    setEnrichmentLogs(result.response.logs.reverse());
                },
                () => {
                    toast(translate('logs_error'), {
                        type: toast.TYPE.ERROR,
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
        if (status === IN_PROGRESS) {
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
                                        variant="link"
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
                            <Switch
                                name="advancedMode"
                                label={translate('advancedMode')}
                            />
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
                                    <Autocomplete
                                        clearIdentifier={() => {
                                            setValue('subPath', '');
                                        }}
                                        options={datasetFields}
                                        name="sourceColumn"
                                        label={translate('sourceColumn')}
                                    />
                                    <Autocomplete
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
                                        initialValues?.status === IN_PROGRESS ||
                                        initialValues?.status === PENDING ||
                                        isLoading
                                    }
                                    id={initialValues._id}
                                    // @ts-expect-error TS2322
                                    translate={translate}
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
                                    onClick={handleCancel}
                                >
                                    {translate('cancel')}
                                </CancelButton>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ height: '100%' }}
                                    type="submit"
                                    disabled={
                                        isLoading ||
                                        initialValues?.status === IN_PROGRESS ||
                                        initialValues?.status === PENDING
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
                            sourceColumn={formValues?.sourceColumn}
                        />
                    </Box>
                </Box>
            </form>
        </FormProvider>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { match }) => {
    const enrichment = fromEnrichments
        .enrichments(state)
        // @ts-expect-error TS7006
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

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(EnrichmentForm);
