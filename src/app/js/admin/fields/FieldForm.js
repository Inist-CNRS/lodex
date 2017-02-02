import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field, FieldArray, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import { polyglot as polyglotPropTypes } from '../../lib/propTypes';
import FormTextField from '../../lib/FormTextField';
import FormSelectField from '../../lib/FormSelectField';
import FormAutoCompleteField from '../../lib/FormAutoCompleteField';
import { FIELD_FORM_NAME, getEditedField, saveField } from './';

import Alert from '../../lib/Alert';
import TransformerList from './TransformerList';

const validate = (values) => {
    const errors = ['username', 'password'].reduce((currentErrors, field) => {
        if (!values[field]) {
            return {
                ...currentErrors,
                [field]: 'Required',
            };
        }
        return currentErrors;
    }, {});

    return errors;
};

const styles = {
    schemeLabel: {
        fontSize: '0.9rem',
        margin: 0,
        padding: '0.2rem 0',
    },
    schemeUri: {
        fontSize: '0.7rem',
        color: 'grey',
        margin: 0,
        padding: 0,
    },
};

export const FieldFormComponent = ({ error, field, handleSubmit, p: polyglot }) => {
    if (!field) {
        return <span />;
    }

    return (
        <form id="login_form" onSubmit={handleSubmit}>
            {error && <Alert><p>{error}</p></Alert>}
            <Field
                name="name"
                component={FormTextField}
                label={polyglot.t('fieldName')}
                fullWidth
            />
            <Field
                name="label"
                component={FormTextField}
                label={polyglot.t('fieldLabel')}
                fullWidth
            />
            <Field
                name="label"
                component={FormSelectField}
                label={polyglot.t('cover')}
                fullWidth
            >
                <MenuItem value="dataset" primaryText={polyglot.t('cover_dataset')} />
                <MenuItem value="collection" primaryText={polyglot.t('cover_collection')} />
            </Field>
            <Field
                name="scheme"
                component={FormAutoCompleteField}
                label={polyglot.t('scheme')}
                fullWidth
                fetch={query => ({
                    url: `http://lov.okfn.org/dataset/lov/api/v2/vocabulary/autocomplete?q=${query}`,
                })}
                parseResponse={response => (response && response.results ? response.results.map(r => ({
                    text: r.uri[0],
                    value: (
                        <MenuItem style={{ lineHeight: 1 }} value={r.uri[0]}>
                            <div style={styles.schemeLabel}><b>{r['http://purl.org/dc/terms/title@en'][0]}</b></div>
                            <small style={styles.schemeUri}>{r.uri[0]}</small>
                        </MenuItem>),
                })) : [])}
            />
            <FieldArray name="transformers" component={TransformerList} />
        </form>
    );
};

FieldFormComponent.defaultProps = {
};

FieldFormComponent.propTypes = {
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    initialValues: getEditedField(state),
    field: getEditedField(state),
});

const mapDispatchToProps = {
    handleSubmit: saveField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: FIELD_FORM_NAME,
        validate,
        enableReinitialize: true,
    }),
    translate,
)(FieldFormComponent);
