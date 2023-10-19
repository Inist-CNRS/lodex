import React, { useEffect } from 'react';
import { formField as formFieldPropTypes } from '../../propTypes';
import {
    Autocomplete,
    FormControl,
    FormHelperText,
    TextField,
} from '@mui/material';

const SourceValueFromColumns = ({
    input,
    meta: { touched, error, dirty },
    label,
    ...props
}) => {
    const [autocompleteValue, setAutocompleteValue] = React.useState(
        input.value,
    );
    useEffect(() => {
        setAutocompleteValue(input.value);
    }, [input.value]);

    return (
        <FormControl fullWidth error={!!error}>
            <Autocomplete
                data-testid="source-value-from-columns"
                multiple
                disableCloseOnSelect
                value={autocompleteValue || []}
                renderInput={params => {
                    return (
                        <TextField
                            placeholder={`${label} *`}
                            label={`${label} *`}
                            {...params}
                            error={(dirty || touched) && !!error}
                            variant="outlined"
                            aria-label="input-path"
                        />
                    );
                }}
                onChange={(event, newValue) => {
                    setAutocompleteValue(newValue);
                    input.onChange(newValue);
                }}
                {...props}
            />
            {(dirty || touched) && error && (
                <FormHelperText error>{error}</FormHelperText>
            )}
        </FormControl>
    );
};

SourceValueFromColumns.propTypes = formFieldPropTypes;

export default SourceValueFromColumns;
