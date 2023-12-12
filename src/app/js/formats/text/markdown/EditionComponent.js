import React from 'react';
import { formField as formFieldPropTypes } from '../../../propTypes';
import DefaultEdition from '../../DefaultFormat/DefaultEdition';

const FormTextField = props => {
    const {
        input,
        label,
        meta: { touched, error },
    } = props;
    return (
        <DefaultEdition
            {...props}
            {...input}
            placeholder={label}
            label={label}
            multiline
            rows={4}
            error={touched && !!error}
            helperText={touched && error}
        />
    );
};

FormTextField.propTypes = formFieldPropTypes;

export default FormTextField;
