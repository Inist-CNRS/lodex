import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { reduxForm, change } from 'redux-form';

import { field as fieldPropTypes } from '../../propTypes';
import { fromParsing } from '../../admin/selectors';
import { FIELD_FORM_NAME } from '../';
import { getTransformerMetas } from '../../../../common/transformers';

import StepUriAutogenerate from './StepUriAutogenerate';
import StepValueColumn from './StepValueColumn';
import StepUriConcat from './StepUriConcat';

export const StepValueComponent = ({
    datasetFields,
    field,
    handleTransformerChange,
}) => (
    <div>
        <StepUriAutogenerate field={field} onChange={handleTransformerChange} />
        <StepValueColumn
            datasetFields={datasetFields}
            field={field}
            onChange={handleTransformerChange}
        />
        <StepUriConcat field={field} onChange={handleTransformerChange} />
    </div>
);

StepValueComponent.propTypes = {
    datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleTransformerChange: PropTypes.func.isRequired,
    field: fieldPropTypes.isRequired,
};

const mapStateToProps = (state, { field }) => ({
    datasetFields: fromParsing.getParsedExcerptColumns(state),
    initialValues: field,
});

const mapDispatchToProps = (dispatch, { field: { transformers } }) => ({
    handleTransformerChange: valueTransformer => {
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

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: FIELD_FORM_NAME,
        enableReinitialize: true,
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
    }),
)(StepValueComponent);
