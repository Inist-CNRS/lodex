import React, { PropTypes } from 'react';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../propTypes';
import FormSelectField from '../../lib/components/FormSelectField';
import getFieldClassName from '../../lib/getFieldClassName';

export const PositionFieldComponent = ({ field, fields, p: polyglot, ...props }) => {
    const currentFieldIndex = fields.findIndex(f => f.name === field.name);

    const fieldItems = fields.map((otherField, index) => (
        otherField.name === field.name
        ? null
        : (
            <MenuItem
                className={`after_${getFieldClassName(field)}`}
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

export default translate(PositionFieldComponent);
