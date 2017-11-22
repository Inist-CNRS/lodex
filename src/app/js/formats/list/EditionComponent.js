import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import FormTextField from '../../lib/components/FormTextField';

const format = v => v && v.join(';');
const normalize = v => v && v.split(';');

const EditionComponent = ({ name, disabled, label, fullWidth, ...input }) => (
    <Field
        key={name}
        name={name}
        component={FormTextField}
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
