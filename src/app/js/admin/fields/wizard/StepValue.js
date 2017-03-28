import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { change } from 'redux-form';

import Step from './Step';
import { field as fieldPropTypes } from '../../../propTypes';
import { fromParsing } from '../../selectors';
import { FIELD_FORM_NAME } from '../';
import { getTransformerMetas } from '../../../../../common/transformers';

import StepValueValue from './StepValueValue';
import StepValueColumn from './StepValueColumn';

export const StepValueComponent = ({
    datasetFields,
    field,
    handleTransformerChange,
    ...props
}) => (
    <Step label="field_wizard_step_value" {...props}>
        <StepValueValue
            field={field}
            onChange={handleTransformerChange}
        />
        <StepValueColumn
            datasetFields={datasetFields}
            field={field}
            onChange={handleTransformerChange}
        />
    </Step>
);

StepValueComponent.propTypes = {
    datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleComposedOfChange: PropTypes.func.isRequired,
    handleTransformerChange: PropTypes.func.isRequired,
    field: fieldPropTypes.isRequired,
};

const mapStateToProps = state => ({
    datasetFields: fromParsing.getParsedExcerptColumns(state),
});

const mapDispatchToProps = (dispatch, { field: { transformers } }) => ({
    handleTransformerChange: (valueTransformer) => {
        let newTransformers = [];
        const firstTransformerIsValueTransformer =
            transformers
            && transformers[0]
            && transformers[0].operation
            && getTransformerMetas(transformers[0].operation).type === 'value';

        newTransformers = [
            valueTransformer,
            ...transformers.slice(firstTransformerIsValueTransformer ? 1 : 0),
        ];

        dispatch(change(FIELD_FORM_NAME, 'transformers', newTransformers));
    },
    handleComposedOfChange: (composedOf) => {
        const firstTransformerIsValueTransformer =
            transformers
            && transformers[0]
            && transformers[0].operation
            && getTransformerMetas(transformers[0].operation).type === 'value';

        if (firstTransformerIsValueTransformer) {
            dispatch(change(FIELD_FORM_NAME, 'transformers', transformers.slice(1)));
        }

        dispatch(change(FIELD_FORM_NAME, 'composedOf', composedOf));
    },
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(StepValueComponent);
