import React, { useCallback, useEffect, useMemo } from 'react';

import PropTypes from 'prop-types';
import FormSourceCodeField from '../../lib/components/FormSourceCodeField';
import SubressourceFieldAutoComplete from '../subresource/SubressourceFieldAutoComplete';
import EnrichmentCatalogConnected from './EnrichmentCatalog';
import EnrichmentLogsDialogComponent from './EnrichmentLogsDialog';
import EnrichmentPreview from './EnrichmentPreview';

import { ListAlt as ListAltIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControlLabel,
    FormGroup,
    ListItem,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { change, Field, formValueSelector, reduxForm } from 'redux-form';
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

// UTILITARY PART
const ENRICHMENT_FORM = 'ENRICHMENT_FORM';

// @ts-expect-error TS7031
const renderSwitch = ({ input, label }) => (
    <FormGroup>
        <FormControlLabel
            control={
                <Switch
                    checked={input.value ? true : false}
                    onChange={input.onChange}
                />
            }
            label={label}
        />
    </FormGroup>
);

// @ts-expect-error TS7031
const renderTextField = ({ input, label, meta: { touched, error } }) => (
    <TextField
        placeholder={label}
        label={label}
        error={touched && !!error}
        helperText={touched && error}
        value={input.value === null ? '' : input.value}
        {...input}
        fullWidth
    />
);

// COMPONENT PART
export const EnrichmentForm = ({
    // @ts-expect-error TS7031
    datasetFields,
    // @ts-expect-error TS7031
    excerptLines,
    // @ts-expect-error TS7031
    formValues,
    // @ts-expect-error TS7031
    history,
    // @ts-expect-error TS7031
    initialValues,
    // @ts-expect-error TS7031
    onChangeWebServiceUrl,
    // @ts-expect-error TS7031
    onLoadEnrichments,
    // @ts-expect-error TS7031
    onRetryEnrichment,
    // @ts-expect-error TS7031
    status,
}) => {
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
        const firstExcerptLine =
            excerptLines[0]?.[formValues?.sourceColumn] || [];
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

    const handleSubmit = async () => {
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

    const handleGetLogs = async () => {
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
    };

    useEffect(() => {
        handleGetLogs();
    }, [initialValues?.status]);

    useEffect(() => {
        // We skip preview update if the enrichment has not completed
        if (status === IN_PROGRESS) {
            return;
        }

        const timeout = setTimeout(handleSourcePreview, 500);
        return () => clearTimeout(timeout);
    }, [
        formValues?.rule,
        formValues?.sourceColumn,
        formValues?.subPath,
        status,
    ]);

    return (
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
                        <Field
                            name="name"
                            component={renderTextField}
                            label={translate('fieldName')}
                        />
                        {/*
                         // @ts-expect-error TS2322 */}
                        {isEditMode && <RunButton id={initialValues?._id} />}
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
                                errorCount: initialValues.errorCount ?? 0,
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
                                disabled={(initialValues.errorCount ?? 0) === 0}
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
                                {translate('enrichment_status')} : &nbsp;
                                {/*
                                 // @ts-expect-error TS2322 */}
                                <EnrichmentStatus id={initialValues?._id} />
                            </Typography>
                            <Button
                                // @ts-expect-error TS2769
                                variant="link"
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
                                handleClose={() => setOpenEnrichmentLogs(false)}
                            />
                        </Box>
                    )}
                </Box>
                <Box>
                    <Field
                        name="advancedMode"
                        component={renderSwitch}
                        label={translate('advancedMode')}
                    />
                </Box>

                {formValues?.advancedMode && (
                    <Box mb={2}>
                        <Field
                            name="rule"
                            component={FormSourceCodeField}
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
                            <Field
                                name="webServiceUrl"
                                component={renderTextField}
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
                                handleClose={() => setOpenCatalog(false)}
                                selectedWebServiceUrl={
                                    formValues?.webServiceUrl
                                }
                                onChange={onChangeWebServiceUrl}
                            />
                        </Box>

                        <Box display="flex" gap={2} mb={2}>
                            <Field
                                name="sourceColumn"
                                type="text"
                                component={SubressourceFieldAutoComplete}
                                options={datasetFields}
                                // @ts-expect-error TS7006
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={translate('sourceColumn')}
                                        variant="outlined"
                                        aria-label="input-path"
                                    />
                                )}
                                // @ts-expect-error TS7006
                                renderOption={(props, option) => {
                                    return (
                                        <ListItem {...props}>
                                            <Typography>{option}</Typography>
                                        </ListItem>
                                    );
                                }}
                                clearIdentifier={() => {
                                    // @ts-expect-error TS2554
                                    change('subPath', '');
                                }}
                            />

                            <Field
                                name="subPath"
                                type="text"
                                component={SubressourceFieldAutoComplete}
                                options={optionsIdentifier}
                                // @ts-expect-error TS7006
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={translate('subPath')}
                                        aria-label="subPath"
                                        variant="outlined"
                                    />
                                )}
                                disabled={!formValues?.sourceColumn}
                                // @ts-expect-error TS7006
                                renderOption={(props, option) => {
                                    return (
                                        <ListItem {...props}>
                                            <Typography>{option}</Typography>
                                        </ListItem>
                                    );
                                }}
                            />
                        </Box>
                    </Box>
                )}

                <Box
                    display="flex"
                    justifyContent={isEditMode ? 'space-between' : 'flex-end'}
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
                            onClick={handleSubmit}
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
    );
};

// REDUX PART
const formSelector = formValueSelector(ENRICHMENT_FORM);

// @ts-expect-error TS7006
const mapStateToProps = (state, { match }) => {
    const enrichment = fromEnrichments
        .enrichments(state)
        // @ts-expect-error TS7006
        .find((enrichment) => enrichment._id === match.params.enrichmentId);
    return {
        formValues: formSelector(
            state,
            'sourceColumn',
            'subPath',
            'rule',
            'name',
            'webServiceUrl',
            'advancedMode',
        ),
        initialValues: enrichment,
        status: enrichment?.status,
        datasetFields: fromParsing.getParsedExcerptColumns(state),
        excerptLines: fromParsing.getExcerptLines(state),
    };
};
const mapDispatchToProps = {
    // @ts-expect-error TS7006
    onChangeWebServiceUrl: (value) =>
        change(ENRICHMENT_FORM, 'webServiceUrl', value),
    onLaunchEnrichment: launchEnrichment,
    onLoadEnrichments: loadEnrichments,
    onRetryEnrichment: retryEnrichment,
};

EnrichmentForm.propTypes = {
    datasetFields: PropTypes.array.isRequired,
    excerptLines: PropTypes.array.isRequired,
    formValues: PropTypes.shape({
        sourceColumn: PropTypes.string,
        subPath: PropTypes.string,
        rule: PropTypes.string,
        webServiceUrl: PropTypes.string,
        name: PropTypes.string,
        advancedMode: PropTypes.bool,
    }),
    history: PropTypes.object.isRequired,
    initialValues: PropTypes.any,
    match: PropTypes.object.isRequired,
    onChangeWebServiceUrl: PropTypes.func.isRequired,
    onLaunchEnrichment: PropTypes.func.isRequired,
    onLoadEnrichments: PropTypes.func.isRequired,
    onRetryEnrichment: PropTypes.func.isRequired,
    isEnrichmentRunning: PropTypes.bool,
    status: PropTypes.string,
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: ENRICHMENT_FORM,
    }),
    // @ts-expect-error TS2345
)(EnrichmentForm);
