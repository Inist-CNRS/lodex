import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import CompositeFieldInput from './CompositeFieldInput';
import FormTextField from '../lib/FormTextField';
import {
    fromPublication,
} from './selectors';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';

export const FieldInputComponent = ({ field, completedField, p: polyglot, input }) => {
    let label = field.label;
    if (completedField) {
        label = `${label} (${polyglot.t('complete_field_X', { field: completedField.label })})`;
    }

    if (field.composedOf) {
        return (
            <CompositeFieldInput label={label} field={field} />
        );
    }

    return (
        <Field
            key={field.name}
            name={field.name}
            component={FormTextField}
            disabled={field.name === 'uri'}
            label={label}
            fullWidth
            {...input}
        />
    );
};

FieldInputComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    completedField: fieldPropTypes,
    p: polyglotPropTypes.isRequired,
};

FieldInputComponent.defaultProps = {
    completedField: null,
};

const mapStateToProps = (state, { field }) => ({
    completedField: fromPublication.getCompletedField(state, field),
});

const EditDetailsField = compose(
    connect(mapStateToProps),
    translate,
)(FieldInputComponent);

export default EditDetailsField;
