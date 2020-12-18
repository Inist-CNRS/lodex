import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { reduxForm, change } from 'redux-form';

import { fromParsing } from '../../admin/selectors';
import { FIELD_FORM_NAME } from '../';
import { getTransformerMetas } from '../../../../common/transformers';

import StepUriAutogenerate from './StepUriAutogenerate';
import StepValueColumn from './StepValueColumn';
import StepUriConcat from './StepUriConcat';

export const StepValueComponent = ({ handleTransformerChange }) => (
    <div>
        <StepUriAutogenerate onChange={handleTransformerChange} />
        <StepValueColumn onChange={handleTransformerChange} />
        <StepUriConcat onChange={handleTransformerChange} />
    </div>
);

StepValueComponent.propTypes = {
    handleTransformerChange: PropTypes.func.isRequired,
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
            Array.isArray(valueTransformer)
                ? valueTransformer.length > 0
                    ? valueTransformer[0]
                    : null
                : valueTransformer,
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
