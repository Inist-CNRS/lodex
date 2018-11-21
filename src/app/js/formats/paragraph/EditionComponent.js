import React from 'react';
import { formField as formFieldPropTypes } from '../../propTypes';
import DefaultEdition from '../DefaultFormat/DefaultEdition';

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
            hintText={label}
            floatingLabelText={label}
            multiLine
            rows={4}
            errorText={touched && error}
        />
    );
};

FormTextField.propTypes = formFieldPropTypes;

export default FormTextField;
