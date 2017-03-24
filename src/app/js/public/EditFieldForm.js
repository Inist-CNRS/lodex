import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import translate from 'redux-polyglot/translate';
import { reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';

import Alert from '../lib/Alert';
import { polyglot as polyglotPropTypes } from '../propTypes';
import FieldInput from './FieldInput';
import PositionInput from './PositionInput';

export const FORM_NAME = 'PROPERTY_FORM';

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

export const EditFieldFormComponent = ({ field, error, handleSubmit }) => (
    <form id="field_form" onSubmit={handleSubmit}>
        {error && <Alert><p>{error}</p></Alert>}
        <FieldInput field={field} />
        <PositionInput field={field} />
    </form>
);

EditFieldFormComponent.defaultProps = {
    resource: null,
    error: null,
    saving: false,
};

EditFieldFormComponent.propTypes = {
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
};


export default compose(
    withHandlers({
        onSubmit: ({ onSaveProperty }) => (values) => {
            onSaveProperty(values);
        },
    }),
    withProps(({ resource, field }) => ({
        initialValues: { ...resource, position: field.position, field },
    })),
    reduxForm({
        form: FORM_NAME,
        validate,
    }),
    translate,
)(EditFieldFormComponent);
