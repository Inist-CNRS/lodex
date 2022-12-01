import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { Field, formValueSelector, reduxForm, reset, change } from 'redux-form';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';

import {
    createEnrichment,
    deleteEnrichment,
    launchEnrichment,
    loadEnrichments,
    previewDataEnrichment,
    previewDataEnrichmentClear,
    updateEnrichment,
} from '.';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import FormSelectField from '../../lib/components/FormSelectField';
import FormTextField from '../../lib/components/FormTextField';
import { fromEnrichments, fromParsing } from '../selectors';
import EnrichmentExcerpt from './EnrichmentExcerpt';

import {
    Box,
    Button,
    FormControlLabel,
    makeStyles,
    MenuItem,
    Snackbar,
    Switch,
} from '@material-ui/core';
import { FINISHED, PENDING } from '../../../../common/enrichmentStatus';
import Alert from '../../lib/components/Alert';
import EnrichmentSidebar from './EnrichmentSidebar';

import ListAltIcon from '@material-ui/icons/ListAlt';
import FormSourceCodeField from '../../lib/components/FormSourceCodeField';
import { EnrichmentContext } from './EnrichmentContext';
import EnrichmentCatalogDialog from './EnrichmentCatalog';

const DEBOUNCE_TIMEOUT = 2000;

const useStyles = makeStyles(theme => {
    return {
        enrichmentPageContainer: {
            display: 'flex',
            flexDirection: 'row',
        },
        enrichmentFormContainer: {
            display: 'flex',
            justifyContent: 'center',
            flex: 3,
            marginRight: 20,
        },
        enrichmentForm: {
            width: '100%',
            maxWidth: '900px',
        },
        switchMode: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        simplifiedRulesFormContainer: {
            flex: '4',
            borderRadius: 4,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
        },
        excerptContainer: {
            flex: '2',
            borderLeft: '1px solid rgb(95, 99, 104, 0.5)',
        },
        simplifiedRules: {
            border: '1px solid rgb(95, 99, 104, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.up('md')]: {
                flexDirection: 'row',
            },
        },
        valuesContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        actionContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 20,
        },
        advancedRulesFormContainer: {
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.up('md')]: {
                flexDirection: 'row',
            },
        },
        advancedRulesEditor: {
            display: 'flex',
            flex: '4 !important',
            height: '350px !important',
        },
    };
});

export const EnrichmentFormComponent = ({
    dataPreviewEnrichment,
    excerptColumns,
    errorEnrichment,
    formValues,
    history,
    initialValues,
    isDataPreviewLoading,
    isEdit,
    isLoading,
    onAddEnrichment,
    onDeleteEnrichment,
    onLaunchEnrichment,
    onPreviewDataEnrichment,
    onPreviewDataEnrichmentClear,
    onUpdateEnrichment,
    onResetForm,
    onChangeWebServiceUrl,
    onLoadEnrichments,
    match,
    p: polyglot,
}) => {
    const classes = useStyles();
    const [advancedMode, setAdvancedMode] = useState(
        initialValues?.advancedMode || false,
    );
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [openCatalog, setOpenCatalog] = useState(false);

    useEffect(() => {
        setOpenSnackBar(!!errorEnrichment);
    }, [errorEnrichment]);

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            getSourcePreview(advancedMode, formValues);
        }, DEBOUNCE_TIMEOUT);
        return () => {
            clearTimeout(debounceTimeout);
        };
    }, [
        formValues?.sourceColumn,
        formValues?.subPath,
        formValues?.rule,
        advancedMode,
    ]);

    useEffect(() => {
        const enrichmentExist = match.params.enrichmentId && initialValues;
        if (match.params.enrichmentId && !enrichmentExist) {
            history.push('/data/enrichment');
        }
        return () => {
            onResetForm();
            onPreviewDataEnrichmentClear();
        };
    }, []);

    const getSourcePreview = (advancedMode, formValues) => {
        if (advancedMode && !formValues?.rule) {
            return;
        }

        if (!advancedMode && !formValues?.sourceColumn) {
            return;
        }
        onPreviewDataEnrichment(
            advancedMode
                ? { rule: formValues.rule }
                : {
                      sourceColumn: formValues.sourceColumn,
                      subPath: formValues.subPath,
                  },
        );
    };

    const saveEnrichment = e => {
        e.preventDefault();

        let payload = {
            name: formValues.name,
            advancedMode,
            status: initialValues?.status || PENDING,
        };

        if (advancedMode) {
            payload = {
                ...payload,
                rule: formValues.rule,
            };
        } else {
            payload = {
                ...payload,
                webServiceUrl: formValues.webServiceUrl,
                sourceColumn: formValues.sourceColumn,
                subPath: formValues.subPath,
            };
        }

        if (isEdit) {
            onUpdateEnrichment({
                enrichment: {
                    _id: initialValues._id,
                    jobId: initialValues.jobId,
                    ...payload,
                },
            });
        } else {
            onAddEnrichment({
                enrichment: payload,
                callback: id => history.push(`/data/enrichment/${id}`),
            });
        }
    };

    const deleteEnrichment = e => {
        e.preventDefault();
        onDeleteEnrichment({
            id: initialValues._id,
        });
        history.push(`/data/enrichment`);
    };

    const toggleAdvancedMode = () => {
        setAdvancedMode(!advancedMode);
    };

    const launchEnrichment = () => {
        onLaunchEnrichment({
            id: initialValues._id,
            action: initialValues?.status === FINISHED ? 'relaunch' : 'launch',
        });
    };

    const getRuleFields = () => {
        const columnItems = excerptColumns.map(column => (
            <MenuItem key={column} value={column}>
                {column}
            </MenuItem>
        ));

        return (
            <Box>
                <div className={classes.switchMode}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={advancedMode}
                                onChange={toggleAdvancedMode}
                                color="primary"
                                name="advancedMode"
                            />
                        }
                        label={polyglot.t('advancedMode')}
                    />
                </div>
                {advancedMode ? (
                    <div
                        style={{
                            display: 'flex',
                        }}
                        className={classes.advancedRulesFormContainer}
                    >
                        <Field
                            name="rule"
                            component={FormSourceCodeField}
                            label={polyglot.t('expand_rules')}
                            className={classes.advancedRulesEditor}
                        />
                        <div className={classes.excerptContainer}>
                            <EnrichmentExcerpt
                                lines={dataPreviewEnrichment}
                                loading={isDataPreviewLoading}
                                advancedMode
                            />
                        </div>
                    </div>
                ) : (
                    <Box className={classes.simplifiedRules}>
                        <div className={classes.simplifiedRulesFormContainer}>
                            <div className={classes.valuesContainer}>
                                <Field
                                    name="webServiceUrl"
                                    component={FormTextField}
                                    label={polyglot.t('webServiceUrl')}
                                    fullWidth
                                    style={{ marginBottom: 16 }}
                                />
                                <div style={{ margin: '10px 0px 0px 10px' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => setOpenCatalog(true)}
                                    >
                                        <ListAltIcon fontSize="small" />
                                    </Button>
                                    <EnrichmentCatalogDialog
                                        isOpen={openCatalog}
                                        handleClose={() =>
                                            setOpenCatalog(false)
                                        }
                                        selectedWebServiceUrl={
                                            formValues?.webServiceUrl
                                        }
                                        onChange={onChangeWebServiceUrl}
                                    />
                                </div>
                            </div>
                            <div className={classes.valuesContainer}>
                                <Field
                                    name="sourceColumn"
                                    component={FormSelectField}
                                    label={polyglot.t('sourceColumn')}
                                    fullWidth
                                    style={{ marginBottom: 20 }}
                                >
                                    <MenuItem key={null} value={null}>
                                        {polyglot.t('none')}
                                    </MenuItem>
                                    {columnItems}
                                </Field>

                                <div
                                    style={{
                                        fontSize: 24,
                                        marginLeft: 12,
                                        marginTop: 15,
                                    }}
                                >
                                    •
                                </div>
                                <Field
                                    name="subPath"
                                    component={FormTextField}
                                    label={polyglot.t('subPath')}
                                    fullWidth
                                    style={{ marginLeft: 12 }}
                                    helperText={polyglot.t('subPathHelper')}
                                />
                            </div>
                        </div>
                        <div className={classes.excerptContainer}>
                            <EnrichmentExcerpt
                                lines={dataPreviewEnrichment}
                                loading={isDataPreviewLoading}
                            />
                        </div>
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <div className={classes.enrichmentPageContainer}>
            <div className={classes.enrichmentFormContainer}>
                <form
                    id="enrichment_form"
                    onSubmit={saveEnrichment}
                    className={classes.enrichmentForm}
                >
                    <Field
                        name="name"
                        component={FormTextField}
                        label={polyglot.t('fieldName')}
                        autoFocus
                        fullWidth
                        style={{ marginBottom: 24 }}
                        disabled={isEdit}
                    />
                    {getRuleFields()}
                    <ButtonWithStatus
                        raised
                        key="save"
                        color="primary"
                        type="submit"
                        loading={isLoading}
                        style={{ marginTop: 24 }}
                        name="submit-enrichment"
                    >
                        {polyglot.t(isEdit ? 'save' : 'add_more')}
                    </ButtonWithStatus>
                </form>

                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    onClose={() => setOpenSnackBar(!openSnackBar)}
                >
                    <Alert variant="filled" severity="success">
                        {polyglot.t('error')}: {errorEnrichment}
                    </Alert>
                </Snackbar>
            </div>
            <EnrichmentContext.Provider
                value={{
                    isEdit,
                    enrichment: initialValues,
                    handleLaunchEnrichment: launchEnrichment,
                    handleDeleteEnrichment: deleteEnrichment,
                    onLoadEnrichments,
                }}
            >
                <EnrichmentSidebar />
            </EnrichmentContext.Provider>
        </div>
    );
};

EnrichmentFormComponent.propTypes = {
    dataPreviewEnrichment: PropTypes.array,
    errorEnrichment: PropTypes.string,
    excerptColumns: PropTypes.arrayOf(PropTypes.string),
    formValues: PropTypes.shape({
        sourceColumn: PropTypes.string,
        subPath: PropTypes.string,
        rule: PropTypes.string,
        webServiceUrl: PropTypes.string,
        name: PropTypes.string,
    }),
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }),
    initialValues: PropTypes.any,
    isDataPreviewLoading: PropTypes.bool,
    isEdit: PropTypes.bool,
    isLoading: PropTypes.bool.isRequired,
    onAddEnrichment: PropTypes.func.isRequired,
    onUpdateEnrichment: PropTypes.func.isRequired,
    onDeleteEnrichment: PropTypes.func.isRequired,
    onLaunchEnrichment: PropTypes.func.isRequired,
    onPreviewDataEnrichment: PropTypes.func.isRequired,
    onPreviewDataEnrichmentClear: PropTypes.func.isRequired,
    onResetForm: PropTypes.func.isRequired,
    onLoadEnrichments: PropTypes.func.isRequired,
    onChangeWebServiceUrl: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    p: polyglotPropTypes.isRequired,
};

const formSelector = formValueSelector('ENRICHMENT_FORM');
const mapStateToProps = (state, { match }) => ({
    dataPreviewEnrichment: fromEnrichments.dataPreviewEnrichment(state),
    errorEnrichment: fromEnrichments.getError(state),
    excerptColumns: fromParsing.getParsedExcerptColumns(state),
    formValues: formSelector(
        state,
        'sourceColumn',
        'subPath',
        'rule',
        'name',
        'webServiceUrl',
    ),
    initialValues: fromEnrichments
        .enrichments(state)
        .find(enrichment => enrichment._id === match.params.enrichmentId),
    isLoading: fromEnrichments.isLoading(state),
    isDataPreviewLoading: fromEnrichments.isDataPreviewLoading(state),
    lines: fromParsing.getExcerptLines(state),
});

const mapDispatchToProps = {
    onAddEnrichment: createEnrichment,
    onDeleteEnrichment: deleteEnrichment,
    onLaunchEnrichment: launchEnrichment,
    onUpdateEnrichment: updateEnrichment,
    onPreviewDataEnrichment: previewDataEnrichment,
    onPreviewDataEnrichmentClear: previewDataEnrichmentClear,
    onLoadEnrichments: loadEnrichments,
    onResetForm: () => reset('ENRICHMENT_FORM'),
    onChangeWebServiceUrl: value =>
        change('ENRICHMENT_FORM', 'webServiceUrl', value),
};

const validate = (values, { p: polyglot }) => {
    const errors = ['name', 'rule'].reduce((currentErrors, field) => {
        if (!values[field]) {
            return {
                ...currentErrors,
                [field]: polyglot.t('required'),
            };
        }
        return currentErrors;
    }, {});

    return errors;
};

export default compose(
    translate,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: 'ENRICHMENT_FORM',
        validate,
    }),
)(EnrichmentFormComponent);
