import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import translate from 'redux-polyglot/translate';
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form';

import Alert from '../lib/Alert';
import { polyglot as polyglotPropTypes } from '../propTypes';
import FormCheckboxField from '../lib/FormCheckboxField';

export const FORM_NAME = 'ONTOLOGY_FIELD_FORM';

const validate = (values) => {
    const errors = Object.keys(values).reduce((currentErrors, field) => {
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

export const EditOntologyFieldFormComponent = ({ error, handleSubmit, p: polyglot }) => (
    <form id="field_form" onSubmit={handleSubmit}>
        {error && <Alert><p>{error}</p></Alert>}
        <Field
            name="display_in_list"
            component={FormCheckboxField}
            label={polyglot.t('field_display_in_list')}
        />
        <Field
            name="display_in_resource"
            component={FormCheckboxField}
            label={polyglot.t('field_display_in_resource')}
        />
    </form>
);

EditOntologyFieldFormComponent.defaultProps = {
    resource: null,
    error: null,
    saving: false,
};

EditOntologyFieldFormComponent.propTypes = {
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
};


export default compose(
    withHandlers({
        onSubmit: ({ onSaveProperty }) => (values) => {
            onSaveProperty(values);
        },
    }),
    withProps(({ field, ...props }) => ({
        ...props,
        initialValues: field,
    })),
    reduxForm({
        form: FORM_NAME,
        validate,
    }),
    translate,
)(EditOntologyFieldFormComponent);
