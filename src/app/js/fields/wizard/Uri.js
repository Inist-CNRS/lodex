import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { reduxForm, change, formValueSelector } from 'redux-form';

import { fromParsing } from '../../admin/selectors';
import { FIELD_FORM_NAME } from '..';
import { getTransformerMetas } from '../../../../common/transformers';

import UriAutogenerate from './UriAutogenerate';
import UriConcat from './UriConcat';
import SourceValueFromColumns from '../sourceValue/SourceValueFromColumns';
import { GET_SOURCE_VALUE_FROM_TRANSFORMERS } from '../sourceValue/SourceValueToggle';

export const UriComponent = ({
    handleTransformerChange,
    updateTransformers,
    currentTransformers,
}) => {
    const [value, setValue] = React.useState(null);
    React.useEffect(() => {
        const { value: currentValue } =
            GET_SOURCE_VALUE_FROM_TRANSFORMERS(currentTransformers);
        setValue(currentValue);
    }, [currentTransformers]);

    return (
        <div>
            <UriAutogenerate onChange={handleTransformerChange} />
            <SourceValueFromColumns
                updateTransformers={updateTransformers}
                value={value}
            />
            <UriConcat onChange={handleTransformerChange} />
        </div>
    );
};

UriComponent.propTypes = {
    handleTransformerChange: PropTypes.func.isRequired,
    updateTransformers: PropTypes.func.isRequired,
    currentTransformers: PropTypes.array,
};

const mapStateToProps = (state, { currentEditedField }) => ({
    datasetFields: fromParsing.getParsedExcerptColumns(state),
    initialValues: currentEditedField,
    currentTransformers: formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    ),
});

const mapDispatchToProps = (
    dispatch,
    { currentEditedField: { transformers } },
) => ({
    handleTransformerChange: (valueTransformer) => {
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
    updateTransformers: (valueTransformers) => {
        return dispatch(
            change(FIELD_FORM_NAME, 'transformers', valueTransformers),
        );
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
)(UriComponent);
