import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../propTypes';
import FormSelectField from '../lib/FormSelectField';
import { fromPublication } from './selectors';

export const PositionInputComponent = ({ field, fields, p: polyglot, input }) => {
    const currentFieldIndex = fields.findIndex(f => f.name === field.name);

    const fieldItems = fields.map((otherField, index) => (
        otherField.name === field.name
        ? null
        : (
            <MenuItem
                className={`after_${otherField.label.toLowerCase().replace(/\s/g, '_')}`}
                key={otherField.name}
                value={currentFieldIndex < index ? index : index + 1}
                primaryText={polyglot.t('after_field', { field: otherField.label })}
            />
        )
    ));

    return (
        <Field
            name="position"
            className="select-position"
            component={FormSelectField}
            label={polyglot.t('position')}
            fullWidth
            {...input}
        >
            <MenuItem
                className="first-position"
                key="first_position"
                value={0}
                primaryText={polyglot.t('first_position')}
            />

            {fieldItems}
        </Field>
    );
};

PositionInputComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    fields: fromPublication.getFields(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(PositionInputComponent);
