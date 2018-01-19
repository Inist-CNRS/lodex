import React from 'react';
import PropTypes from 'prop-types';

import Step from './Step';
import { field as fieldPropTypes } from '../../propTypes';
import FieldComposedOf from '../FieldComposedOf';
import FieldCompletes from '../FieldCompletes';

export const StepIdentityComponent = ({ field, fields, ...props }) => (
    <Step label="field_wizard_step_semantic" {...props}>
        <FieldCompletes field={field} fields={fields} />
        <FieldComposedOf field={field} fields={fields} />
    </Step>
);

StepIdentityComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
};

export default StepIdentityComponent;
