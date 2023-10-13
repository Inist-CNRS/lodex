import React, { useEffect, useMemo } from 'react';

import EnrichmentCatalogConnected from './EnrichmentCatalog';
import EnrichmentPreview from './EnrichmentPreview';
import FormSourceCodeField from '../../lib/components/FormSourceCodeField';
import EnrichmentLogsDialogComponent from './EnrichmentLogsDialog';
import translate from 'redux-polyglot/translate';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PropTypes from 'prop-types';
import SubressourceFieldAutoComplete from '../subresource/SubressourceFieldAutoComplete';

import { launchEnrichment, loadEnrichments } from '.';
import { getKeys } from '../subresource/SubresourceForm';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, formValueSelector, reduxForm, change } from 'redux-form';
import { fromEnrichments, fromParsing } from '../selectors';
import { ListAlt as ListAltIcon } from '@mui/icons-material';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { withRouter } from 'react-router';
import {
    Box,
    Button,
    Chip,
    FormControlLabel,
    FormGroup,
    ListItem,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import {
    createEnrichment,
    getPreviewEnrichment,
    deleteEnrichment,
    updateEnrichment,
} from '../api/enrichment';
import { getJobLogs } from '../api/job';
import { toast } from '../../../../common/tools/toast';
import {
    FINISHED,
    IN_PROGRESS,
    PENDING,
    ERROR,
    CANCELED,
    PAUSED,
} from '../../../../common/taskStatus';
import { io } from 'socket.io-client';
import CancelButton from '../../lib/components/CancelButton';

// UTILITARY PART
const ENRICHMENT_FORM = 'ENRICHMENT_FORM';

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

export const renderStatus = (status, polyglot) => {
    if (status === PENDING) {
        return (
            <Chip
                component="span"
                label={polyglot.t('enrichment_status_pending')}
                color="warning"
            />
        );
    }
    if (status === IN_PROGRESS) {
        return (
            <Chip
                component="span"
                label={polyglot.t('enrichment_status_running')}
                color="info"
            />
        );
    }

    if (status === PAUSED) {
        return (
            <Chip
                component="span"
                label={polyglot.t('enrichment_status_paused')}
                color="info"
            />
        );
    }

    if (status === FINISHED) {
        return (
            <Chip
                component="span"
                label={polyglot.t('enrichment_status_done')}
                color="success"
            />
        );
    }

    if (status === ERROR) {
        return (
            <Chip
                component="span"
                label={polyglot.t('enrichment_status_error')}
                color="error"
            />
        );
    }

    if (status === CANCELED) {
        return (
            <Chip
                component="span"
                label={polyglot.t('enrichment_status_canceled')}
                color="warning"
            />
        );
    }

    return (
        <Chip
            component="span"
            label={polyglot.t('enrichment_status_not_started')}
            sx={{ backgroundColor: 'neutral' }}
        />
    );
};

// COMPONENT PART
export const EnrichmentForm = ({
    datasetFields,
    excerptLines,
    formValues,
    history,
    initialValues,
    p: polyglot,
    onChangeWebServiceUrl,
    onLaunchEnrichment,
    onLoadEnrichments,
    isEnrichmentRunning,
}) => {
    const [openCatalog, setOpenCatalog] = React.useState(false);
    const [openEnrichmentLogs, setOpenEnrichmentLogs] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [dataPreviewEnrichment, setDataPreviewEnrichment] = React.useState(
        [],
    );
    const [enrichmentLogs, setEnrichmentLogs] = React.useState([]);
    const [enrichmentStatus, setEnrichmentStatus] = React.useState(
        initialValues?.status,
    );

    const isEditMode = !!initialValues?._id;

    const optionsIdentifier = useMemo(() => {
        const firstExcerptLine =
            excerptLines[0]?.[formValues?.sourceColumn] || [];
        return getKeys(firstExcerptLine);
    }, [excerptLines, formValues?.sourceColumn]);

    const handleSourcePreview = async formValues => {
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
    };

    const handleAddEnrichment = async () => {
        const res = await createEnrichment(formValues);
        if (res.response) {
            toast(polyglot.t('enrichment_added_success'), {
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
            toast(polyglot.t('enrichment_updated_success'), {
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
        setIsLoading(true);
        if (isEditMode) {
            await handleUpdateEnrichment();
        } else {
            await handleAddEnrichment();
        }
        setIsLoading(false);
    };

    const handleDeleteEnrichment = async () => {
        setIsLoading(true);
        const res = await deleteEnrichment(initialValues._id);
        if (res.response) {
            toast(polyglot.t('enrichment_deleted_success'), {
                type: toast.TYPE.SUCCESS,
            });
            history.push('/data/enrichment');
        } else {
            toast(`${res.error}`, {
                type: toast.TYPE.ERROR,
            });
        }
        setIsLoading(false);
    };

    const handleCancel = () => {
        history.push('/data/enrichment');
    };

    const handleLaunchEnrichment = () => {
        if (isEnrichmentRunning) {
            toast(polyglot.t('pending_enrichment'), {
                type: toast.TYPE.INFO,
            });
        }
        onLaunchEnrichment({
            id: initialValues._id,
            action: enrichmentStatus === FINISHED ? 'relaunch' : 'launch',
        });
    };

    const handleGetLogs = async () => {
        if (initialValues?.jobId) {
            getJobLogs(initialValues.jobId).then(
                result => {
                    setEnrichmentLogs(result.response.logs.reverse());
                },
                () => {
                    toast(polyglot.t('logs_error'), {
                        type: toast.TYPE.ERROR,
                    });
                },
            );
        }
    };

    useEffect(() => {
        handleGetLogs();
        const socket = io();
        const tenant = sessionStorage.getItem('lodex-tenant') || 'default';
        const dbName = sessionStorage.getItem('lodex-dbName');
        socket.on(
            `${dbName}_${tenant}-enrichment-job-${initialValues?.jobId}`,
            data => {
                let lastLine;
                let parsedData;
                if (Array.isArray(data)) {
                    setEnrichmentLogs(currentState => [
                        ...data,
                        ...currentState,
                    ]);
                    lastLine = data[0];
                } else {
                    setEnrichmentLogs(currentState => [data, ...currentState]);
                    lastLine = data;
                }
                try {
                    parsedData = JSON.parse(lastLine);
                } catch {
                    console.error('Error parsing data', lastLine);
                }

                if (parsedData && parsedData.status) {
                    setEnrichmentStatus(parsedData.status);
                }
            },
        );
        socket.on('${tenant}-connect_error', () => {
            handleGetLogs();
        });
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        handleSourcePreview(formValues);
    }, [formValues?.rule, formValues?.sourceColumn, formValues?.subPath]);

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
                            label={polyglot.t('fieldName')}
                        />
                        {isEditMode && (
                            <Button
                                color="primary"
                                variant="contained"
                                sx={{ height: '100%' }}
                                startIcon={<PlayArrowIcon />}
                                onClick={handleLaunchEnrichment}
                                disabled={
                                    enrichmentStatus === IN_PROGRESS ||
                                    enrichmentStatus === PENDING
                                }
                            >
                                {polyglot.t('run')}
                            </Button>
                        )}
                    </Box>
                    {isEditMode && (
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={2}
                        >
                            <Typography>
                                {polyglot.t('enrichment_status')} : &nbsp;
                                {renderStatus(enrichmentStatus, polyglot)}
                            </Typography>
                            <Button
                                variant="link"
                                sx={{
                                    paddingRight: 0,
                                    textDecoration: 'underline',
                                }}
                                onClick={() => setOpenEnrichmentLogs(true)}
                            >
                                {polyglot.t('see_logs')}
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
                        label={polyglot.t('advancedMode')}
                    />
                </Box>

                {formValues?.advancedMode && (
                    <Box mb={2}>
                        <Field
                            name="rule"
                            component={FormSourceCodeField}
                            label={polyglot.t('expand_rules')}
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
                                label={polyglot.t('webServiceUrl')}
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
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label={polyglot.t('sourceColumn')}
                                        variant="outlined"
                                        aria-label="input-path"
                                    />
                                )}
                                renderOption={(props, option) => {
                                    return (
                                        <ListItem {...props}>
                                            <Typography>{option}</Typography>
                                        </ListItem>
                                    );
                                }}
                                clearIdentifier={() => {
                                    change('subPath', '');
                                }}
                            />

                            <Field
                                name="subPath"
                                type="text"
                                component={SubressourceFieldAutoComplete}
                                options={optionsIdentifier}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label={polyglot.t('subPath')}
                                        aria-label="subPath"
                                        variant="outlined"
                                    />
                                )}
                                disabled={!formValues?.sourceColumn}
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
                        <Button
                            variant="contained"
                            color="warning"
                            sx={{ height: '100%' }}
                            onClick={handleDeleteEnrichment}
                            disabled={
                                enrichmentStatus === IN_PROGRESS ||
                                enrichmentStatus === PENDING ||
                                isLoading
                            }
                        >
                            {polyglot.t('delete')}
                        </Button>
                    )}
                    <Box>
                        <CancelButton
                            sx={{ height: '100%' }}
                            onClick={handleCancel}
                        >
                            {polyglot.t('cancel')}
                        </CancelButton>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ height: '100%' }}
                            onClick={handleSubmit}
                            disabled={
                                isLoading ||
                                enrichmentStatus === IN_PROGRESS ||
                                enrichmentStatus === PENDING
                            }
                        >
                            {polyglot.t('save')}
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

const mapStateToProps = (state, { match }) => ({
    formValues: formSelector(
        state,
        'sourceColumn',
        'subPath',
        'rule',
        'name',
        'webServiceUrl',
        'advancedMode',
    ),
    initialValues: fromEnrichments
        .enrichments(state)
        .find(enrichment => enrichment._id === match.params.enrichmentId),
    datasetFields: fromParsing.getParsedExcerptColumns(state),
    excerptLines: fromParsing.getExcerptLines(state),
    isEnrichmentRunning: !!fromEnrichments
        .enrichments(state)
        .find(enrichment => enrichment.status === IN_PROGRESS),
});
const mapDispatchToProps = {
    onChangeWebServiceUrl: value =>
        change(ENRICHMENT_FORM, 'webServiceUrl', value),
    onLaunchEnrichment: launchEnrichment,
    onLoadEnrichments: loadEnrichments,
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
    p: polyglotPropTypes.isRequired,
    isEnrichmentRunning: PropTypes.bool,
};

export default compose(
    translate,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: ENRICHMENT_FORM,
    }),
)(EnrichmentForm);
