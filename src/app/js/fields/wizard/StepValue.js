import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { change } from 'redux-form';

import Step from './Step';
import { field as fieldPropTypes } from '../../propTypes';
import { FIELD_FORM_NAME } from '../';
import { getTransformerMetas } from '../../../../common/transformers';

import StepValueValue from './StepValueValue';
import StepValueColumn from './StepValueColumn';
import StepValueConcat from './StepValueConcat';

export const StepValueComponent = ({ field, handleChange, ...props }) => (
    <Step id="step-value" label="field_wizard_step_value" {...props}>
        <StepValueValue
            field={field}
            onChange={e => handleChange(e.target.value)}
        />
        <StepValueColumn field={field} onChange={handleChange} />
        <StepValueConcat field={field} onChange={handleChange} />
    </Step>
);

StepValueComponent.propTypes = {
    handleChange: PropTypes.func.isRequired,
    field: fieldPropTypes.isRequired,
};

const mapDispatchToProps = (dispatch, { field: { transformers } }) => ({
    handleChange: valueTransformer => {
        let newTransformers = [];
        const firstTransformerIsValueTransformer =
            transformers &&
            transformers[0] &&
            transformers[0].operation &&
            getTransformerMetas(transformers[0].operation).type === 'value';

        newTransformers = [
            valueTransformer,
            ...transformers.slice(firstTransformerIsValueTransformer ? 1 : 0),
        ];

        dispatch(change(FIELD_FORM_NAME, 'transformers', newTransformers));
    },
});

export default compose(connect(null, mapDispatchToProps))(StepValueComponent);
