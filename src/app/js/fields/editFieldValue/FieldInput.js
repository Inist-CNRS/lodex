import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import { getEditionComponent } from '../../formats';
import CompositeFieldInput from './CompositeFieldInput';
import { fromFields } from '../../sharedSelectors';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

export const FieldInputComponent = ({
    field,
    completedField,
    p: polyglot,
    input,
}) => {
    let label = field.label;
    if (completedField) {
        label = `${label} (${polyglot.t('completes_field_X', {
            field: completedField.label,
        })})`;
    }

    if (field.composedOf) {
        return <CompositeFieldInput label={label} field={field} />;
    }

    const Component = getEditionComponent(field);

    if (Component.isReduxFormReady) {
        return (
            <Component
                key={field.name}
                name={field.name}
                disabled={field.name === 'uri'}
                label={label}
                fullWidth
                field={field}
                {...input}
            />
        );
    }

    return (
        <Field
            key={field.name}
            name={field.name}
            component={Component}
            disabled={field.name === 'uri'}
            label={label}
            field={field}
            fullWidth
            {...input}
        />
    );
};

FieldInputComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    completedField: fieldPropTypes,
    p: polyglotPropTypes.isRequired,
    input: PropTypes.shape({}),
};

FieldInputComponent.defaultProps = {
    completedField: null,
    input: null,
};

const mapStateToProps = (state, { field }) => ({
    completedField: fromFields.getCompletedField(state, field),
});

const EditDetailsField = compose(
    connect(mapStateToProps),
    translate,
)(FieldInputComponent);

export default EditDetailsField;
