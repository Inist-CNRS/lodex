import React from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import { TextField as MUITextField } from '@material-ui/core';

import FieldLanguageInput from '../FieldLanguageInput';
import FieldLabelInput from '../FieldLabelInput';
import FieldInternal from '../FieldInternal';
import ClassList from '../ClassList';

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
        {...input}
        {...custom}
    />
);

export const TabIdentityComponent = ({ field }) => {
    return (
        <>
            <FieldLabelInput />
            <Field name="scope" component={TextField} type="hidden" />
            <FieldArray name="classes" component={ClassList} type="classes" />
            <FieldLanguageInput field={field} />
            <FieldInternal field={field} />
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

TabIdentityComponent.propTypes = {
    field: fieldPropTypes.isRequired,
};

export default TabIdentityComponent;
