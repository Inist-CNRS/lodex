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
import { toast } from 'react-toastify';
import { FINISHED } from '../../../../common/enrichmentStatus';
import { ERROR } from '../../../../common/progressStatus';
import { io } from 'socket.io-client';

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

const renderStatus = (initialValues, polyglot) => {
    if (initialValues?.status === 'PENDING') {
        return (
            <Typography component="span" variant="body2" color="warning.main">
                {polyglot.t('enrichment_status_pending')}
            </Typography>
        );
    }
    if (initialValues?.status === 'IN_PROGRESS') {
        return (
            <Typography component="span" variant="body2" color="info.main">
                {polyglot.t('enrichment_status_running')}
            </Typography>
        );
    }

    if (initialValues?.status === 'PAUSED') {
        return (
            <Typography component="span" variant="body2" color="info.main">
                {polyglot.t('enrichment_status_paused')}
            </Typography>
        );
    }

    if (initialValues?.status === 'FINISHED') {
        return (
            <Typography component="span" variant="body2" color="success.main">
                {polyglot.t('enrichment_status_done')}
            </Typography>
        );
    }

    if (initialValues?.status === 'ERROR') {
        return (
            <Typography component="span" variant="body2" color="error.main">
                {polyglot.t('enrichment_status_error')}
            </Typography>
        );
    }

    return (
        <Typography component="span" variant="body2" color="success.main">
            {polyglot.t('enrichment_status_not_started')}
        </Typography>
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
}) => {
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
            history.push('/data/enrichment');
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
        onLaunchEnrichment({
            id: initialValues._id,
            action: initialValues?.status === FINISHED ? 'relaunch' : 'launch',
        });
    };

    const handleGetLogs = async () => {
        if (initialValues?.jobId) {
            getJobLogs(initialValues.jobId).then(
                result => {
                    setEnrichmentLogs(result.response.logs.reverse());
                },
                () => {
                    toast(polyglot.t('enrichment_logs_error'), {
                        type: toast.TYPE.ERROR,
                    });
                },
            );
        }
    };

    useEffect(() => {
        handleGetLogs();
        const socket = io();
        socket.on(`enrichment-job-${initialValues?.jobId}`, data => {
            if (Array.isArray(data)) {
                setEnrichmentLogs(currentState => [...data, ...currentState]);
            } else {
                setEnrichmentLogs(currentState => [data, ...currentState]);
                let parsedData;
                try {
                    parsedData = JSON.parse(data);
                } catch {
                    console.error('Error parsing data', data);
                }

                if (
                    parsedData &&
                    [FINISHED, ERROR].includes(parsedData.status)
                ) {
                    onLoadEnrichments();
                }
            }
        });
        socket.on('connect_error', () => {
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
                            <Typography variant="body2">
                                {polyglot.t('enrichment_status')} :
                                {renderStatus(initialValues, polyglot)}
                            </Typography>
                            <Button
                                variant="link"
                                sx={{
                                    paddingRight: 0,
                                    textDecoration: 'underline',
                                }}
                                onClick={() => setOpenEnrichmentLogs(true)}
                            >
                                {polyglot.t('enrichment_see_logs')}
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
                            color="secondary"
                            sx={{ height: '100%' }}
                            onClick={handleDeleteEnrichment}
                            disabled={
                                initialValues?.status === 'RUNNING' || isLoading
                            }
                        >
                            {polyglot.t('delete')}
                        </Button>
                    )}
                    <Box>
                        <Button
                            variant="link"
                            color="secondary"
                            sx={{ height: '100%' }}
                            onClick={handleCancel}
                        >
                            {polyglot.t('cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ height: '100%' }}
                            onClick={handleSubmit}
                            disabled={
                                isLoading || initialValues?.status === 'RUNNING'
                            }
                        >
                            {polyglot.t('save')}
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
                <EnrichmentPreview
                    lines={dataPreviewEnrichment}
                    sourceColumn={formValues?.sourceColumn}
                />
            </Box>
        </Box>
    );
};

// REDUX PART
const formSelector = formValueSelector('ENRICHMENT_FORM');

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
});
const mapDispatchToProps = {
    onChangeWebServiceUrl: value =>
        change('ENRICHMENT_FORM', 'webServiceUrl', value),
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
};

export default compose(
    translate,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: ENRICHMENT_FORM,
    }),
)(EnrichmentForm);
