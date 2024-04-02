import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { OutlinedInput } from '@mui/material';
import { IMaskInput } from 'react-imask';
import { getTenantMaxSize } from '../../../common/tools/tenantTools';

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
                    mask: new RegExp(
                        `^[a-z0-9-]{1,${getTenantMaxSize(window.__DBNAME__)}}$`,
                    ),
                    definitions,
                },
            ]}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name, value } })}
        />
    );
});

const NameField = (inputProps) => {
    const { defaultValue } = inputProps;
    return (
        <OutlinedInput
            type="text"
            fullWidth
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
