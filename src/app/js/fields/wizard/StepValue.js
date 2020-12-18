import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { change } from 'redux-form';

import Step from './Step';
import { FIELD_FORM_NAME } from '../';

import StepValueValue from './StepValueValue';
import StepValueColumn from './StepValueColumn';
import StepValueConcat from './StepValueConcat';
import StepValueSubresource from './StepValueSubresource';

export const StepValueComponent = ({ handleChange, ...props }) => (
    <Step id="step-value" label="field_wizard_step_value" {...props}>
        <StepValueValue onChange={handleChange} />
        <StepValueColumn onChange={handleChange} />
        <StepValueConcat onChange={handleChange} />
        <StepValueSubresource onChange={handleChange} />
    </Step>
);

StepValueComponent.propTypes = {
    handleChange: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    handleChange: valueTransformers => {
        return dispatch(
            change(FIELD_FORM_NAME, 'transformers', valueTransformers),
        );
    },
});

export default compose(connect(null, mapDispatchToProps))(StepValueComponent);
