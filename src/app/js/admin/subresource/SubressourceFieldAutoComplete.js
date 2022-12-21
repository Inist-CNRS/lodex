import React from 'react';

import { FormControl, FormHelperText } from '@material-ui/core';
import Autocomplete from '@mui/material/Autocomplete';

import { formField as formFieldPropTypes } from '../../propTypes';

const SubressourceFieldAutoComplete = ({
    input,
    hint,
    meta: { touched, error },
    ...props
}) => {
    return (
        <FormControl fullWidth>
            <Autocomplete
                error={touched && error}
                {...input}
                onChange={(event, newValue) => {
                    input.onChange(newValue);
                }}
                {...props}
            />
            <FormHelperText>{hint}</FormHelperText>
        </FormControl>
    );
};

SubressourceFieldAutoComplete.propTypes = formFieldPropTypes;

export default SubressourceFieldAutoComplete;
