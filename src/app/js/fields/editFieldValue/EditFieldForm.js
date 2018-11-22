import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import translate from 'redux-polyglot/translate';
import { reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';

import Alert from '../../lib/components/Alert';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import FieldInput from './FieldInput';

export const FORM_NAME = 'PROPERTY_FORM';

export const EditFieldFormComponent = ({ field, error, handleSubmit }) => (
    <form id="field_form" onSubmit={handleSubmit}>
        {error && (
            <Alert>
                <p>{error}</p>
            </Alert>
        )}
        <FieldInput field={field} />
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
    translate,
    withHandlers({
        onSubmit: ({ onSaveProperty }) => values => {
            onSaveProperty(values);
        },
    }),
    withProps(({ resource }) => ({
        initialValues: resource,
    })),
    reduxForm({
        form: FORM_NAME,
    }),
)(EditFieldFormComponent);
