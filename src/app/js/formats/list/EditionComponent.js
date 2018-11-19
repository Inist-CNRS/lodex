import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import FormTextField from '../../lib/components/FormTextField';

const format = v => {
    try {
        return v && v.join(';');
    } catch (error) {
        return error;
    }
};
const normalize = v => v && v.split(';');

const SafeFormTextField = ({ input, label, polyglot, ...props }) => {
    if (input.value instanceof Error) {
        return <p>{polyglot.t('bad_format', { label })}</p>;
    }
    return (
        <FormTextField
            {...props}
            input={input}
            label={label}
            polyglot={polyglot}
        />
    );
};

const EditionComponent = ({ name, disabled, label, fullWidth, ...input }) => (
    <Field
        key={name}
        name={name}
        component={SafeFormTextField}
        disabled={name === 'uri'}
        label={label}
        fullWidth
        {...input}
        format={format}
        normalize={normalize}
    />
);

EditionComponent.propTypes = {
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool, // eslint-disable-line
};

EditionComponent.defaultProps = {
    className: null,
};

EditionComponent.isReduxFormReady = true;

export default EditionComponent;
