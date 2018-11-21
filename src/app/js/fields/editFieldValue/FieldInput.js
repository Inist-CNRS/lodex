import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import { getEditionComponent, getPredicate } from '../../formats';
import CompositeFieldInput from './CompositeFieldInput';
import { fromFields } from '../../sharedSelectors';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

export class FieldInputComponent extends Component {
    validate = value => {
        const { field, p: polyglot } = this.props;
        const predicate = getPredicate(field);
        return predicate(value) ? undefined : polyglot.t('bad_format_details');
    };

    render() {
        const { field, completedField, p: polyglot, input } = this.props;

        let label = field.label;
        if (completedField) {
            label = `${label} (${polyglot.t('completes_field_X', {
                field: completedField.label,
            })})`;
        }

        if (field.composedOf) {
            return <CompositeFieldInput label={label} field={field} />;
        }

        const EditionComponent = getEditionComponent(field);

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
                validate={this.validate}
                fullWidth
                {...input}
            />
        );
    }
}

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
