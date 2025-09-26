import React from 'react';

import { FormControl, FormHelperText, Autocomplete } from '@mui/material';

import { formField as formFieldPropTypes } from '../../propTypes';

const SubressourceFieldAutoComplete = ({
    // @ts-expect-error TS7031
    input,
    // @ts-expect-error TS7031
    hint,
    // @ts-expect-error TS7031
    meta: { touched, error },
    // @ts-expect-error TS7031
    clearIdentifier,
    // @ts-expect-error TS7031
    error: rootError,
    ...props
}) => {
    const finalError = rootError || (touched && error) || undefined;
    return (
        <FormControl fullWidth error={!!finalError}>
            <Autocomplete
                error={finalError}
                {...input}
                onChange={(event, newValue, reason) => {
                    if (reason === 'clear') {
                        clearIdentifier();
                    }
                    input.onChange(newValue);
                }}
                {...props}
            />
            <FormHelperText>{finalError || hint}</FormHelperText>
        </FormControl>
    );
};

SubressourceFieldAutoComplete.propTypes = formFieldPropTypes;

export default SubressourceFieldAutoComplete;
