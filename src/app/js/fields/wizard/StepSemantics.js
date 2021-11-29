import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Step from './Step';
import { field as fieldPropTypes } from '../../propTypes';
import FieldComposedOf from '../FieldComposedOf';
import FieldAnnotation from '../FieldAnnotation';
import FieldSchemeInput from '../FieldSchemeInput';

export const StepSemanticsComponent = ({ fields, ...props }) => {
    const { filter } = useParams();
    return (
        <Step id="step-semantics" label="field_wizard_step_semantic" {...props}>
            <FieldSchemeInput />
            <FieldAnnotation fields={fields} scope={filter} />
            <FieldComposedOf fields={fields} />
        </Step>
    );
};

StepSemanticsComponent.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    field: fieldPropTypes.isRequired,
};

export default StepSemanticsComponent;
