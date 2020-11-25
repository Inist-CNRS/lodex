import React from 'react';
import translate from 'redux-polyglot/translate';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import { MenuItem, TextField as MUITextField } from '@material-ui/core';

import Step from './Step';
import FormSelectField from '../../lib/components/FormSelectField';
import FieldLanguageInput from '../FieldLanguageInput';
import FieldLabelInput from '../FieldLabelInput';
import ClassList from '../ClassList';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';

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

export const StepIdentityComponent = ({
    field,
    isSubresourceField,
    p: polyglot,
    ...props
}) => {
    const getOperationIndex = field.transformers.findIndex(
        t => t.operation === 'GET',
    );

    return (
        <Step id="step-identity" label="field_wizard_step_identity" {...props}>
            <FieldLabelInput />
            {isSubresourceField && getOperationIndex !== -1 && (
                <Field
                    name={`transformers[${getOperationIndex}].args[0].value`}
                    component={TextField}
                    label="Name"
                    fullWidth
                />
            )}
            <Field
                name="cover"
                component={FormSelectField}
                label={polyglot.t('select_cover')}
                fullWidth
            >
                <MenuItem value="dataset">
                    {polyglot.t('cover_dataset')}
                </MenuItem>
                <MenuItem value="collection">
                    {polyglot.t('cover_collection')}
                </MenuItem>
            </Field>
            <FieldArray name="classes" component={ClassList} type="classes" />
            <FieldLanguageInput field={field} />
        </Step>
    );
};

StepIdentityComponent.propTypes = {
    isSubresourceField: PropTypes.bool,
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
    filter: PropTypes.string,
};

export default translate(StepIdentityComponent);
