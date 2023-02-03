import React, { useEffect, useMemo } from 'react';

import EnrichmentCatalogConnected from './EnrichmentCatalog';
import FormSourceCodeField from '../../lib/components/FormSourceCodeField';
import translate from 'redux-polyglot/translate';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PropTypes from 'prop-types';
import SubressourceFieldAutoComplete from '../subresource/SubressourceFieldAutoComplete';

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
import { createEnrichment, getPreviewEnrichment } from '../api/enrichment';
import EnrichmentPreview from './EnrichmentPreview';

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

const EnrichmentForm2 = ({
    datasetFields,
    excerptLines,
    formValues,
    initialValues,
    p: polyglot,
    onChangeWebServiceUrl,
}) => {
    const [openCatalog, setOpenCatalog] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [dataPreviewEnrichment, setDataPreviewEnrichment] = React.useState(
        [],
    );

    const optionsIdentifier = useMemo(() => {
        const firstExcerptLine =
            excerptLines[0]?.[formValues.sourceColumn] || [];
        return getKeys(firstExcerptLine);
    }, [excerptLines, formValues.sourceColumn]);

    const handleSourcePreview = async formValues => {
        if (formValues.advancedMode && !formValues?.rule) {
            return;
        }

        if (!formValues.advancedMode && !formValues?.sourceColumn) {
            return;
        }

        const res = await getPreviewEnrichment(
            formValues.advancedMode
                ? { rule: formValues.rule }
                : {
                      sourceColumn: formValues.sourceColumn,
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
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        await handleAddEnrichment();
        setIsLoading(false);
    };

    useEffect(() => {
        handleSourcePreview(formValues);
    }, [formValues]);
    return (
        <Box mt={3} display="flex" gap={6}>
            <Box sx={{ flex: 2 }}>
                <Box>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={2}
                    >
                        <Field
                            name="name"
                            component={renderTextField}
                            label={polyglot.t('fieldName')}
                        />
                        <Button
                            color="primary"
                            variant="contained"
                            sx={{ height: '100%' }}
                            startIcon={<PlayArrowIcon />}
                        >
                            {polyglot.t('run')}
                        </Button>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={2}
                    >
                        <Typography variant="body2">
                            {polyglot.t('enrichment_status')} :
                            {initialValues?.status}
                        </Typography>
                        <Button
                            variant="link"
                            sx={{
                                paddingRight: 0,
                                textDecoration: 'underline',
                            }}
                        >
                            {polyglot.t('enrichment_see_logs')}
                        </Button>
                    </Box>
                </Box>
                <Box>
                    <Field
                        name="advancedMode"
                        component={renderSwitch}
                        label={polyglot.t('advancedMode')}
                    />
                </Box>

                {formValues.advancedMode && (
                    <Box mb={2}>
                        <Field
                            name="rule"
                            component={FormSourceCodeField}
                            label={polyglot.t('expand_rules')}
                            width="100%"
                        />
                    </Box>
                )}

                {!formValues.advancedMode && (
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
                                disabled={!formValues.sourceColumn}
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

                <Box display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ height: '100%' }}
                    >
                        {polyglot.t('delete')}
                    </Button>
                    <Box>
                        <Button
                            variant="link"
                            color="secondary"
                            sx={{ height: '100%' }}
                        >
                            {polyglot.t('cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ height: '100%' }}
                            onClick={handleSubmit}
                        >
                            {polyglot.t('save')}
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
                <EnrichmentPreview
                    lines={dataPreviewEnrichment}
                    sourceColumn={formValues.sourceColumn}
                />
            </Box>
        </Box>
    );
};

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
};

EnrichmentForm2.propTypes = {
    formValues: PropTypes.shape({
        sourceColumn: PropTypes.string,
        subPath: PropTypes.string,
        rule: PropTypes.string,
        webServiceUrl: PropTypes.string,
        name: PropTypes.string,
        advancedMode: PropTypes.bool,
    }),
    initialValues: PropTypes.any,
    datasetFields: PropTypes.array.isRequired,
    excerptLines: PropTypes.array.isRequired,
    onChangeWebServiceUrl: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: ENRICHMENT_FORM,
    }),
)(EnrichmentForm2);
