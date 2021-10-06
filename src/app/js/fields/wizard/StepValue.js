import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { change } from 'redux-form';

import Step from './Step';
import { FIELD_FORM_NAME } from '../';
import { SCOPE_DATASET, SCOPE_GRAPHIC } from '../../../../common/scope';

import StepValueValue from './StepValueValue';
import StepValueColumn from './StepValueColumn';
import StepValueConcat from './StepValueConcat';
import StepValueSubresource from './StepValueSubresource';
import StepValueSubresourceField from './StepValueSubresourceField';

export const StepValueComponent = ({
    isSubresourceField,
    handleChange,
    filter,
    ...props
}) => (
    <Step id="step-value" label="field_wizard_step_value" {...props}>
        <StepValueValue onChange={handleChange} />
        {filter !== SCOPE_DATASET && filter !== SCOPE_GRAPHIC && (
            <>
                <StepValueColumn onChange={handleChange} />
                {!isSubresourceField && (
                    <>
                        <StepValueConcat onChange={handleChange} />
                        <StepValueSubresource onChange={handleChange} />
                        <StepValueSubresourceField onChange={handleChange} />
                    </>
                )}
            </>
        )}
    </Step>
);

StepValueComponent.propTypes = {
    isSubresourceField: PropTypes.bool,
    handleChange: PropTypes.func.isRequired,
    filter: PropTypes.string,
};

const mapDispatchToProps = dispatch => ({
    handleChange: valueTransformers => {
        return dispatch(
            change(FIELD_FORM_NAME, 'transformers', valueTransformers),
        );
    },
});

export default compose(connect(null, mapDispatchToProps))(StepValueComponent);
