import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { reduxForm, Field, formValueSelector, reset } from 'redux-form';
import {
    PlayArrow as PlayArrowIcon,
    Delete as DeleteIcon,
} from '@material-ui/icons';

import {
    createEnrichment,
    deleteEnrichment,
    launchEnrichment,
    previewDataEnrichment,
    previewDataEnrichmentClear,
    updateEnrichment,
} from '.';
import { fromEnrichments, fromParsing } from '../selectors';
import FormTextField from '../../lib/components/FormTextField';
import FormSelectField from '../../lib/components/FormSelectField';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import EnrichmentExcerpt from './EnrichmentExcerpt';

import debounce from 'lodash.debounce';
import {
    Box,
    Button,
    FormControlLabel,
    makeStyles,
    MenuItem,
    Snackbar,
    Switch,
} from '@material-ui/core';
import Alert from '../../lib/components/Alert';
import {
    PENDING,
    FINISHED,
    IN_PROGRESS,
} from '../../../../common/enrichmentStatus';

const DEBOUNCE_TIMEOUT = 2000;

const useStyles = makeStyles(theme => {
    return {
        enrichmentContainer: {
            display: 'flex',
            justifyContent: 'center',
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
            alignItems: 'center',
        },
        actionContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 20,
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
    p: polyglot,
}) => {
    const classes = useStyles();
    const [advancedMode, setAdvancedMode] = useState(
        initialValues?.advancedMode || false,
    );
    const [openSnackBar, setOpenSnackBar] = useState(false);

    useEffect(() => {
        setOpenSnackBar(!!errorEnrichment);
    }, [errorEnrichment]);

    const debouncePreview = useCallback(
        debounce(formValues => {
            getSourcePreview(formValues);
        }, DEBOUNCE_TIMEOUT),
        [],
    );

    useEffect(() => {
        debouncePreview(formValues);
    }, [formValues?.sourceColumn, formValues?.subPath, formValues?.rule]);

    useEffect(() => {
        return () => {
            onResetForm();
            onPreviewDataEnrichmentClear();
        };
    }, []);

    const getSourcePreview = formValues => {
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

    const handleSubmit = e => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        let payload = {
            name: formData.get('name'),
            advancedMode,
            status: initialValues?.status || PENDING,
        };

        if (!advancedMode) {
            payload = {
                ...payload,
                webServiceUrl: formData.get('webServiceUrl'),
                sourceColumn: formData.get('sourceColumn'),
                subPath: formData.get('subPath'),
            };
        } else {
            payload = {
                ...payload,
                rule: formData.get('rule'),
            };
        }

        if (isEdit) {
            onUpdateEnrichment({
                enrichment: { _id: initialValues._id, ...payload },
            });
        } else {
            onAddEnrichment({
                enrichment: payload,
                callback: id => history.push(`/data/enrichment/${id}`),
            });
        }
    };

    const handleDelete = e => {
        e.preventDefault();

        if (isEdit) {
            onDeleteEnrichment({
                id: initialValues._id,
            });
        }
    };

    const handleAdvancedMode = () => {
        setAdvancedMode(!advancedMode);
    };

    const handleLaunchEnrichment = () => {
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
                                onChange={handleAdvancedMode}
                                color="primary"
                            />
                        }
                        label={polyglot.t('advancedMode')}
                    />
                </div>
                {advancedMode ? (
                    <>
                        <Field
                            name="rule"
                            component={FormTextField}
                            label={polyglot.t('expand_rules')}
                            multiline
                            fullWidth
                            rows={30}
                            variant="outlined"
                        />
                        <div className={classes.excerptContainer}>
                            <EnrichmentExcerpt
                                lines={dataPreviewEnrichment}
                                loading={isDataPreviewLoading}
                            />
                        </div>
                    </>
                ) : (
                    <Box className={classes.simplifiedRules}>
                        <div className={classes.simplifiedRulesFormContainer}>
                            <Field
                                name="webServiceUrl"
                                component={FormTextField}
                                label={polyglot.t('webServiceUrl')}
                                fullWidth
                                style={{ marginBottom: 16 }}
                            />

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

                                <div style={{ fontSize: 24, marginLeft: 12 }}>
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

    const getActionButtons = () => {
        return (
            <div className={classes.actionContainer}>
                {[PENDING, IN_PROGRESS, FINISHED].includes(
                    initialValues?.status,
                ) && (
                    <Button
                        onClick={handleLaunchEnrichment}
                        variant="contained"
                        color="primary"
                        key="run"
                        disabled={[IN_PROGRESS].includes(initialValues?.status)}
                    >
                        <PlayArrowIcon className={classes.icon} />
                        {polyglot.t('run')}
                    </Button>
                )}

                {isEdit && (
                    <Button
                        variant="contained"
                        key="delete"
                        color="secondary"
                        onClick={handleDelete}
                        style={{ marginLeft: 24 }}
                    >
                        <DeleteIcon className={classes.icon} />
                        {polyglot.t('delete')}
                    </Button>
                )}
            </div>
        );
    };

    return (
        <>
            {getActionButtons()}
            <div className={classes.enrichmentContainer}>
                <form
                    id="enrichment_form"
                    onSubmit={handleSubmit}
                    className={classes.enrichmentForm}
                >
                    <Field
                        name="name"
                        component={FormTextField}
                        label={polyglot.t('fieldName')}
                        autoFocus
                        fullWidth
                        style={{ marginBottom: 24 }}
                    />
                    {getRuleFields()}
                    <ButtonWithStatus
                        raised
                        key="save"
                        color="primary"
                        type="submit"
                        loading={isLoading}
                        style={{ marginTop: 24 }}
                    >
                        {polyglot.t('save')}
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
        </>
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
    p: polyglotPropTypes.isRequired,
};

const formSelector = formValueSelector('ENRICHMENT_FORM');
const mapStateToProps = (state, { match }) => ({
    dataPreviewEnrichment: fromEnrichments.dataPreviewEnrichment(state),
    errorEnrichment: fromEnrichments.getError(state),
    excerptColumns: fromParsing.getParsedExcerptColumns(state),
    formValues: formSelector(state, 'sourceColumn', 'subPath', 'rule'),
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
    onResetForm: () => reset('ENRICHMENT_FORM'),
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
