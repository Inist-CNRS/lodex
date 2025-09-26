import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import { Field } from 'redux-form';

import { getEditionComponent, getPredicate } from '../../formats';
import CompositeFieldInput from './CompositeFieldInput';
import { fromFields } from '../../sharedSelectors';
import isFieldRequired from '../../../../common/fields/isFieldRequired';
import isEmpty from '../../../../common/lib/isEmpty';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { translate } from '../../i18n/I18NContext';

// @ts-expect-error TS7006
const getLabel = (field, polyglot, completedField, required) => {
    let label = field.label;
    if (completedField) {
        label = `${label} (${polyglot.t('completes_field_X', {
            field: completedField.label,
        })})`;
    }
    if (required) {
        label = `${label}*`;
    }
    return label;
};

export const FieldInputComponent = ({
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    completedField,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    input,
}) => {
    const required = isFieldRequired(field);
    const label = getLabel(field, polyglot, completedField, required);

    // @ts-expect-error TS7006
    const validate = (value) => {
        if (required && isEmpty(value)) {
            return polyglot.t('error_overview_field_required');
        }
        const predicate = getPredicate(field);
        return predicate(value) ? undefined : polyglot.t('bad_format_details');
    };

    if (field.composedOf) {
        // @ts-expect-error TS2322
        return <CompositeFieldInput label={label} field={field} />;
    }

    const EditionComponent = getEditionComponent(field);

    // @ts-expect-error TS2339
    if (EditionComponent.isReduxFormReady) {
        return (
            <EditionComponent
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
            component={EditionComponent}
            disabled={field.name === 'uri'}
            label={label}
            field={field}
            validate={validate}
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

// @ts-expect-error TS7006
const mapStateToProps = (state, { field }) => ({
    // @ts-expect-error TS2339
    completedField: fromFields.getCompletedField(state, field),
});

const EditDetailsField = compose(
    connect(mapStateToProps),
    translate,
    // @ts-expect-error TS2345
)(FieldInputComponent);

export default EditDetailsField;
