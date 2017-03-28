import React from 'react';
import { FieldArray } from 'redux-form';
import Step from './Step';

import TransformerList from '../TransformerList';

export const StepTransformComponent = props => (
    <Step label="field_wizard_step_tranforms" {...props}>
        <FieldArray name="transformers" component={TransformerList} type="transform" />
    </Step>
);

export default StepTransformComponent;
