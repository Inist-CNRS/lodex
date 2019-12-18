import React from 'react';
import { formField as formFieldPropTypes } from '../../propTypes';
import DefaultEdition from '../DefaultFormat/DefaultEdition';

const EditionComponent = props => {
    const {
        input,
        label,
        meta: { touched, error },
    } = props;
    return (
        <DefaultEdition
            {...props}
            {...input}
            label={label}
            multiLine
            rows={4}
            errorText={touched && error}
        />
    );
};

EditionComponent.propTypes = formFieldPropTypes;

export default EditionComponent;
