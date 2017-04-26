import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../propTypes';
import FormSelectField from '../lib/components/FormSelectField';
import getFieldClassName from '../lib/getFieldClassName';
import { fromFields } from '../sharedSelectors';

export const PositionFieldComponent = ({ field, fields, p: polyglot, ...props }) => {
    const currentFieldIndex = fields.findIndex(f => f.name === field.name);
    const fieldItems = fields.map((otherField, index) => (
        otherField.name === field.name
        ? null
        : (
            <MenuItem
                className={`after_${getFieldClassName(otherField)}`}
                key={otherField.name}
                value={currentFieldIndex < index ? index : index + 1}
                primaryText={polyglot.t('after_field', { field: otherField.label })}
            />
        )
    ));

    return (
        <Field
            name="position"
            component={FormSelectField}
            label={polyglot.t('position')}
            className="field-position"
            fullWidth
            {...props}
        >
            {fieldItems}
        </Field>
    );
};

PositionFieldComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    fields: fromFields.getFields(state),
});

export default compose(
    translate,
    connect(mapStateToProps),
)(PositionFieldComponent);
