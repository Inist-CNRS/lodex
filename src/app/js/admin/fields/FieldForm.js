import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field, FieldArray, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import FormTextField from '../../lib/FormTextField';
import FormSelectField from '../../lib/FormSelectField';
import SchemeAutoComplete from '../../lib/SchemeAutoComplete';
import {
    FIELD_FORM_NAME,
    saveField,
} from './';

import { fromFields } from '../';
import Format from '../../formats/FormatEdition';
import Alert from '../../lib/Alert';
import TransformerList from './TransformerList';

const validate = (values) => {
    const errors = ['name', 'label', 'cover'].reduce((currentErrors, field) => {
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

export const FieldFormComponent = ({
    error,
    field,
    isContribution,
    handleSubmit,
    p: polyglot,
}) => {
    if (!field) {
        return <span />;
    }

    return (
        <form id="field_form" onSubmit={handleSubmit}>
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
                name="cover"
                component={FormSelectField}
                label={polyglot.t('cover')}
                fullWidth
            >
                <MenuItem value="dataset" primaryText={polyglot.t('cover_dataset')} />
                <MenuItem value="collection" primaryText={polyglot.t('cover_collection')} />
            </Field>
            <SchemeAutoComplete name="scheme" />
            { isContribution ? null : <FieldArray name="transformers" component={TransformerList} /> }
            { isContribution ? null : <Field
                name="format"
                component={Format}
                label={polyglot.t('format')}
                fullWidth
            />}
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
    initialValues: fromFields.getEditedField(state),
    field: fromFields.getEditedField(state),
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
