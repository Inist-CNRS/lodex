import React from 'react';
import PropTypes from 'prop-types';

import Step from './Step';
import { field as fieldPropTypes } from '../../propTypes';
import FieldComposedOf from '../FieldComposedOf';
import FieldAnnotation from '../FieldAnnotation';
import FieldSchemeInput from '../FieldSchemeInput';

export const StepSemanticsComponent = ({ field, fields, ...props }) => (
    <Step id="step-semantics" label="field_wizard_step_semantic" {...props}>
        <FieldSchemeInput />
        <FieldAnnotation field={field} fields={fields} />
        <FieldComposedOf field={field} fields={fields} />
    </Step>
);

StepSemanticsComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
};

export default StepSemanticsComponent;
