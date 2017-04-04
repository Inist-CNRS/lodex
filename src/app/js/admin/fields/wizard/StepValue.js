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
import StepValueLink from './StepValueLink';
import StepValueConcat from './StepValueConcat';

export const StepValueComponent = ({
    datasetFields,
    field,
    handleChange,
    ...props
}) => (
    <Step label="field_wizard_step_value" {...props}>
        <StepValueValue
            field={field}
            onChange={handleChange}
        />
        <StepValueColumn
            datasetFields={datasetFields}
            field={field}
            onChange={handleChange}
        />
        <StepValueLink
            datasetFields={datasetFields}
            field={field}
            onChange={handleChange}
        />
        <StepValueConcat
            datasetFields={datasetFields}
            field={field}
            onChange={handleChange}
        />
    </Step>
);

StepValueComponent.propTypes = {
    datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleChange: PropTypes.func.isRequired,
    field: fieldPropTypes.isRequired,
};

const mapStateToProps = state => ({
    datasetFields: fromParsing.getParsedExcerptColumns(state),
});

const mapDispatchToProps = (dispatch, { field: { transformers } }) => ({
    handleChange: (valueTransformer) => {
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
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(StepValueComponent);
