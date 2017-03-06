import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import CompositeEditDetailsField from './CompositeEditDetailsField';
import FormTextField from '../../lib/FormTextField';
import {
    fromPublication,
} from '../selectors';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

export const EditDetailsFieldComponent = ({ field, completedField, p: polyglot }) => {
    let label = field.label;
    if (completedField) {
        label = `${label} (${polyglot.t('complete_field_X', { field: completedField.label })})`;
    }

    if (field.composedOf) {
        return (
            <CompositeEditDetailsField label={label} field={field} />
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
        />
    );
};

EditDetailsFieldComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    completedField: fieldPropTypes,
    p: polyglotPropTypes.isRequired,
};

EditDetailsFieldComponent.defaultProps = {
    completedField: null,
};

const mapStateToProps = (state, { field }) => ({
    completedField: fromPublication.getCompletedField(state, field),
});

const EditDetailsField = compose(
    connect(mapStateToProps),
    translate,
)(EditDetailsFieldComponent);

export default EditDetailsField;
