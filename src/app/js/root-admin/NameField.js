import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { OutlinedInput } from '@mui/material';
import { IMaskInput } from 'react-imask';

const definitions = {
    '#': /[0-9ux*]/i,
};

const TextMaskCustom = forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, name, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask={[
                {
                    mask: /^[a-zA-Z0-9-_]+$/,
                    definitions,
                },
            ]}
            inputRef={ref}
            onAccept={value => onChange({ target: { name, value } })}
        />
    );
});

const NameField = inputProps => {
    const { defaultValue } = inputProps;
    return (
        <OutlinedInput
            type="text"
            {...inputProps}
            label="Name"
            defaultValue={defaultValue}
            inputComponent={TextMaskCustom}
        />
    );
};

TextMaskCustom.propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
};

export default NameField;
