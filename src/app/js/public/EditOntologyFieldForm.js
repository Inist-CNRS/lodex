import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import translate from 'redux-polyglot/translate';
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import Alert from '../lib/Alert';
import { polyglot as polyglotPropTypes } from '../propTypes';
import FormCheckboxField from '../lib/FormCheckboxField';
import { configureField } from './publication';
import { fromPublication } from './selectors';

export const FORM_NAME = 'ONTOLOGY_FIELD_FORM';

const validate = (values) => {
    const errors = Object.keys(values).reduce((currentErrors, field) => {
        if (values[field] !== false && values[field] !== true) {
            return {
                ...currentErrors,
                [field]: 'Required',
            };
        }
        return currentErrors;
    }, {});

    return errors;
};

export const EditOntologyFieldFormComponent = ({ publicationError, handleSubmit, p: polyglot }) => (
    <form id="field_form" onSubmit={() => handleSubmit()}>
        {publicationError && <Alert><p>{publicationError}</p></Alert>}
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

const mapStateToProps = state => ({
    publicationError: fromPublication.getError(state),
});

const mapDispatchToProps = {
    onSaveField: configureField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        onSubmit: ({ onSaveField }) => (values) => {
            onSaveField(values);
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
