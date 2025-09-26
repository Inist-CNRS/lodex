import React, { useEffect, useMemo, useState } from 'react';

import PrecomputedCatalogConnected from './PrecomputedCatalog';
import PrecomputedPreview from './PrecomputedPreview';
import PrecomputedFormLogsDialogComponent from './PrecomputedLogsDialog';
import PrecomputedFormDataDialogComponent from './PrecomputedDataDialog';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PropTypes from 'prop-types';
import SourceValueFromColumns from './SourceValueFromColumns';

import { launchPrecomputed, loadPrecomputed } from '.';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import { compose } from 'recompose';
import {
    Field,
    formValueSelector,
    reduxForm,
    change,
    SubmissionError,
    // @ts-expect-error TS7016
} from 'redux-form';
import { fromPrecomputed, fromParsing } from '../selectors';
import { ListAlt as ListAltIcon } from '@mui/icons-material';
// @ts-expect-error TS7016
import { withRouter } from 'react-router';
import {
    Box,
    Button,
    Chip,
    ListItem,
    TextField,
    Typography,
} from '@mui/material';
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

// UTILITARY PART
const PRECOMPUTED_FORM = 'PRECOMPUTED_FORM';

// @ts-expect-error TS7006
const required = (text) => (value) =>
    value && !(value instanceof Array && value.length === 0) ? undefined : text;

// @ts-expect-error TS7031
const renderTextField = ({ input, label, meta: { touched, error } }) => {
    return (
        <TextField
            placeholder={`${label} *`}
            label={`${label} *`}
            error={touched && !!error}
            helperText={touched && error}
            value={input.value === null ? '' : input.value}
            {...input}
            fullWidth
        />
    );
};

// @ts-expect-error TS7006
function getDisplayTimeStartedAt(startedAt) {
    if (!startedAt) {
        return;
    }

    const now = new Date();
    const startedAtDate = new Date(startedAt);
    // @ts-expect-error TS2362
    const diff = now - startedAtDate;

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

// @ts-expect-error TS7006
export const renderStatus = (status, translate, startedAt = null) => {
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

// @ts-expect-error TS7031
export const StatusChip = ({ label, color, startedAt, sx }) => {
    const [spentTime, setSpentTime] = useState(
        startedAt ? getDisplayTimeStartedAt(startedAt) : '',
    );
    useEffect(() => {
        if (!startedAt) return;
        const interval = setInterval(() => {
            setSpentTime(getDisplayTimeStartedAt(startedAt));
        }, 59000);
        return () => clearInterval(interval);
    }, []);
    const finalLabel = `${label}${startedAt ? ` (${spentTime})` : ''}`;
    return <Chip component="span" label={finalLabel} color={color} sx={sx} />;
};

StatusChip.propTypes = {
    color: PropTypes.string,
    label: PropTypes.string.isRequired,
    startedAt: PropTypes.string,
    sx: PropTypes.object,
};

export const renderRunButton = (
    // @ts-expect-error TS7006
    handleLaunchPrecomputed,
    // @ts-expect-error TS7006
    precomputedStatus,
    // @ts-expect-error TS7006
    translate,
    // @ts-expect-error TS7006
    variant,
) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isClicked, setIsClicked] = useState(false);
    // @ts-expect-error TS7006
    const handleClick = (event) => {
        handleLaunchPrecomputed(event);
        setIsClicked(true);
    };

    return (
        <Button
            color="primary"
            variant={variant || 'contained'}
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

// COMPONENT PART
export const PrecomputedForm = ({
    // @ts-expect-error TS7031
    datasetFields,
    // @ts-expect-error TS7031
    formValues,
    // @ts-expect-error TS7031
    history,
    // @ts-expect-error TS7031
    initialValues,
    // @ts-expect-error TS7031
    onChangeWebServiceUrl,
    // @ts-expect-error TS7031
    onLaunchPrecomputed,
    // @ts-expect-error TS7031
    onLoadPrecomputedData,
    // @ts-expect-error TS7031
    isPrecomputedRunning,
    // @ts-expect-error TS7031
    handleSubmit: formHandleSubmit,
    // @ts-expect-error TS7031
    submitting,
}) => {
    const { translate } = useTranslate();
    const [openCatalog, setOpenCatalog] = React.useState(false);
    const [openPrecomputedLogs, setOpenPrecomputedLogs] = React.useState(false);
    const [openPrecomputedData, setOpenPrecomputedData] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [dataPreviewPrecomputed, setDataPreviewPrecomputed] = React.useState(
        [],
    );
    const [precomputedLogs, setPrecomputedLogs] = React.useState([]);
    const [precomputedStatus, setPrecomputedStatus] = React.useState(
        initialValues?.status,
    );

    const requiredField = useMemo(
        () => required(translate('error_field_required')),
        [translate('error_field_required')],
    );

    const isEditMode = !!initialValues?._id;

    // @ts-expect-error TS7006
    const handleSourcePreview = async (formValues) => {
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

    const handleAddPrecomputed = async () => {
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

    const handleUpdatePrecomputed = async () => {
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

    // @ts-expect-error TS7006
    const handleSubmit = async (values) => {
        const validation = {
            name: requiredField(values.name),
            webServiceUrl: requiredField(values.webServiceUrl),
            sourceColumns: requiredField(values.sourceColumns),
        };
        if (Object.values(validation).some((value) => value !== undefined)) {
            throw new SubmissionError({
                ...validation,
                _error: 'Tous les champs doivent être remplis',
            });
        }

        setIsLoading(true);
        if (isEditMode) {
            await handleUpdatePrecomputed();
        } else {
            await handleAddPrecomputed();
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

    // @ts-expect-error TS7006
    const handleLaunchPrecomputed = (event) => {
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

    const handleGetLogs = async () => {
        if (initialValues?.jobId) {
            getJobLogs(initialValues.jobId).then(
                // @ts-expect-error TS7006
                (result) => {
                    setPrecomputedLogs(result.response.logs.reverse());
                },
                () => {
                    toast(translate('logs_error'), {
                        type: toast.TYPE.ERROR,
                    });
                },
            );
        }
    };

    // @ts-expect-error TS2345
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
                    // @ts-expect-error TS2345
                    setPrecomputedLogs((currentState) => [
                        ...data,
                        ...currentState,
                    ]);
                    lastLine = data[0];
                } else {
                    // @ts-expect-error TS2345
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
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        handleSourcePreview(formValues);
    }, [formValues?.sourceColumns]);

    return (
        <form onSubmit={formHandleSubmit(handleSubmit)}>
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
                                validate={[requiredField]}
                                component={renderTextField}
                                label={translate('fieldName')}
                            />
                            {isEditMode &&
                                // @ts-expect-error TS2554
                                renderRunButton(
                                    handleLaunchPrecomputed,
                                    precomputedStatus,
                                    translate,
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
                                        // @ts-expect-error TS2769
                                        variant="link"
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
                                                    // @ts-expect-error TS2769
                                                    variant="link"
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
                            <Field
                                name="webServiceUrl"
                                validate={[requiredField]}
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
                            <PrecomputedCatalogConnected
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
                                name="sourceColumns"
                                label={translate('sourceColumns')}
                                validate={[requiredField]}
                                component={SourceValueFromColumns}
                                options={datasetFields}
                                value={
                                    initialValues
                                        ? initialValues.sourceColumns
                                        : []
                                }
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
                        sourceColumns={formValues?.sourceColumns}
                    />
                </Box>
            </Box>
        </form>
    );
};

// REDUX PART
const formSelector = formValueSelector(PRECOMPUTED_FORM);

// @ts-expect-error TS7006
const mapStateToProps = (state, { match }) => ({
    formValues: formSelector(state, 'sourceColumns', 'name', 'webServiceUrl'),
    initialValues: fromPrecomputed
        // @ts-expect-error TS2339
        .precomputed(state)
        // @ts-expect-error TS7006
        .find((precomputed) => precomputed._id === match.params.precomputedId),
    // @ts-expect-error TS2339
    datasetFields: fromParsing.getParsedExcerptColumns(state),
    // @ts-expect-error TS2339
    excerptLines: fromParsing.getExcerptLines(state),
    isPrecomputedRunning: !!fromPrecomputed
        // @ts-expect-error TS2339
        .precomputed(state)
        // @ts-expect-error TS7006
        .find((precomputedData) => precomputedData.status === IN_PROGRESS),
});
const mapDispatchToProps = {
    // @ts-expect-error TS7006
    onChangeWebServiceUrl: (value) =>
        change(PRECOMPUTED_FORM, 'webServiceUrl', value),
    onLaunchPrecomputed: launchPrecomputed,
    onLoadPrecomputedData: loadPrecomputed,
};

PrecomputedForm.propTypes = {
    datasetFields: PropTypes.array.isRequired,
    excerptLines: PropTypes.array.isRequired,
    formValues: PropTypes.shape({
        sourceColumns: PropTypes.arrayOf(PropTypes.string),
        subPath: PropTypes.string,
        webServiceUrl: PropTypes.string,
        name: PropTypes.string,
    }),
    history: PropTypes.object.isRequired,
    initialValues: PropTypes.any,
    match: PropTypes.object.isRequired,
    onChangeWebServiceUrl: PropTypes.func.isRequired,
    onLaunchPrecomputed: PropTypes.func.isRequired,
    onLoadPrecomputedData: PropTypes.func.isRequired,
    isPrecomputedRunning: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: PRECOMPUTED_FORM,
    }),
)(PrecomputedForm);
