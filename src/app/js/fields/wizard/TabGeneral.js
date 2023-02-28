import React from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import { TextField as MUITextField } from '@mui/material';

import FieldLabelInput from '../FieldLabelInput';
import FieldInternal from '../FieldInternal';
import SourceValueToggleConnected from '../sourceValue/SourceValueToggle';
import TransformerList from '../transformers/TransformerList';

import { field as fieldPropTypes } from '../../propTypes';

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
}) => {
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
                    isSubresourceField: !!subresourceUri,
                    currentEditedField,
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
};

export default TabGeneralComponent;
