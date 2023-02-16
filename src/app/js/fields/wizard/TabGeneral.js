import React from 'react';
import { Field, FieldArray, formValueSelector } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField as MUITextField } from '@mui/material';

import FieldLabelInput from '../FieldLabelInput';
import FieldInternal from '../FieldInternal';
import SourceValueToggleConnected from '../sourceValue/SourceValueToggle';
import TransformerList from '../transformers/TransformerList';

import { field as fieldPropTypes } from '../../propTypes';
import { FIELD_FORM_NAME } from '..';

export const isSubresourceTransformation = transformers => {
    const operations = transformers.map(t => t.operation).join('|');
    return (
        operations === 'COLUMN|PARSE|GET|STRING|REPLACE_REGEX|MD5|REPLACE_REGEX'
    );
};

const isSubResourceTransformationWithColumn = transformers => {
    const operations = transformers.map(t => t.operation).join('|');
    return operations.startsWith(
        'COLUMN|PARSE|GET|STRING|REPLACE_REGEX|REPLACE_REGEX|TRIM',
    );
};

export const isArbitraryValue = transformers => {
    return transformers[0]?.operation === 'VALUE';
};

const getHiddenTransformers = (
    isSubresourceField,
    isArbitraryValue,
    isSubResourceTransformationWithColumn,
) => {
    if (isSubResourceTransformationWithColumn) {
        return 7;
    }
    if (isSubresourceField && !isArbitraryValue) {
        return 3;
    }
    return 1;
};

const TextField = ({
    label,
    input,
    meta: { touched, invalid, error },
    ...custom
}) => (
    <MUITextField
        label={label}
        placeholder={label}
        error={touched && invalid}
        helperText={touched && error}
        variant="standard"
        {...input}
        {...custom}
    />
);

export const TabGeneralComponent = ({
    currentEditedField,
    subresourceUri,
    arbitraryMode,
    transformersLocked,
    isArbitraryValue,
    isSubResourceTransformationWithColumn,
}) => {
    const hideFirstTransformers = getHiddenTransformers(
        !!subresourceUri,
        isArbitraryValue,
        isSubResourceTransformationWithColumn,
    );
    return (
        <>
            <FieldLabelInput />
            <Field name="scope" component={TextField} type="hidden" />
            <FieldInternal field={currentEditedField} />
            <SourceValueToggleConnected
                selectedSubresourceUri={subresourceUri}
                arbitraryMode={arbitraryMode}
            />
            <FieldArray
                name="transformers"
                type="transform"
                rerenderOnEveryChange
                component={TransformerList}
                props={{
                    hideFirstTransformers,
                    transformersLocked,
                }}
            />
        </>
    );
};

TextField.propTypes = {
    label: PropTypes.string,
    input: PropTypes.shape({ name: PropTypes.string }),
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        invalid: PropTypes.bool,
        error: PropTypes.string,
    }),
};

TabGeneralComponent.propTypes = {
    currentEditedField: fieldPropTypes.isRequired,
    subresourceUri: PropTypes.string,
    arbitraryMode: PropTypes.bool.isRequired,
    transformersLocked: PropTypes.bool,
    isArbitraryValue: PropTypes.bool,
    isSubResourceTransformationWithColumn: PropTypes.bool,
};

const mapStateToProps = state => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    return {
        transformersLocked: isSubresourceTransformation(transformers || []),
        isArbitraryValue: isArbitraryValue(transformers || []),
        isSubResourceTransformationWithColumn: isSubResourceTransformationWithColumn(
            transformers || [],
        ),
    };
};

export default compose(connect(mapStateToProps))(TabGeneralComponent);
