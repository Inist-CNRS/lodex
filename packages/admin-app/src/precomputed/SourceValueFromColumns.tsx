import React, { useEffect } from 'react';
import {
    Autocomplete,
    FormControl,
    FormHelperText,
    TextField,
} from '@mui/material';
import { useController } from 'react-hook-form';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

type SourceValueFromColumnsProps = {
    name: string;
    label: string;
    options: string[];
    required?: boolean;
};

const SourceValueFromColumns = ({
    name,
    label,
    options,
    required = false,
    ...props
}: SourceValueFromColumnsProps) => {
    const { translate } = useTranslate();
    const { field, fieldState } = useController({
        name,
        rules: {
            required,
            validate: (value) => {
                if (
                    required &&
                    (value === undefined ||
                        value === null ||
                        (value instanceof Array && value.length === 0))
                ) {
                    return translate('error_field_required');
                }
            },
        },
    });
    const { error, isDirty, isTouched } = fieldState;
    const [autocompleteValue, setAutocompleteValue] = React.useState(
        field.value,
    );
    useEffect(() => {
        setAutocompleteValue(field.value);
    }, [field.value]);

    return (
        <FormControl fullWidth error={!!error}>
            <Autocomplete
                data-testid="source-value-from-columns"
                multiple
                disableCloseOnSelect
                value={autocompleteValue || []}
                renderInput={(params) => {
                    return (
                        <TextField
                            placeholder={`${label} *`}
                            label={`${label} *`}
                            {...params}
                            error={(isDirty || isTouched) && !!error}
                            variant="outlined"
                            aria-label="input-path"
                        />
                    );
                }}
                options={options || []}
                {...props}
                onChange={(_event, newValue) => {
                    setAutocompleteValue(newValue);
                    field.onChange(newValue);
                }}
            />
            {error && <FormHelperText error>{error.message}</FormHelperText>}
        </FormControl>
    );
};

export default SourceValueFromColumns;
