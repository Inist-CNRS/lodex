import React from 'react';
import { FieldArray } from 'redux-form';
import { PropType } from 'redux-polyglot';

import Step from './Step';
import TransformerList from '../TransformerList';

export const StepTransformComponent = ({ isSubresourceField, ...props }) => (
    <Step id="step-transformers" label="field_wizard_step_tranforms" {...props}>
        <FieldArray
            name="transformers"
            component={props => (
                <TransformerList
                    hideFirstTransformers={isSubresourceField ? 3 : 0}
                    {...props}
                />
            )}
            type="transform"
        />
    </Step>
);

StepTransformComponent.propTypes = {
    isSubresourceField: PropType.bool,
};

export default StepTransformComponent;
