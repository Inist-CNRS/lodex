import {
    Autocomplete as MuiAutocomplete,
    FormControl,
    TextField,
    ListItem,
    Typography,
    FormHelperText,
} from '@mui/material';
import { useController } from 'react-hook-form';
import { useTranslate } from '../i18n/I18NContext';

type AutocompleteProps = {
    name: string;
    clearIdentifier?: () => void;
    hint?: string;
    options: string[];
    label: string;
    disabled?: boolean;
    required?: boolean;
};

export const Autocomplete = ({
    name,
    clearIdentifier,
    hint,
    options,
    label,
    disabled = false,
    required = false,
}: AutocompleteProps) => {
    const { translate } = useTranslate();
    const { field, fieldState } = useController({
        name,
        rules: {
            required: required ? translate('error_field_required') : false,
        },
    });
    const error: string | undefined =
        (fieldState.isDirty && fieldState.error?.message) || undefined;

    return (
        <FormControl fullWidth error={!!error}>
            <MuiAutocomplete
                disabled={disabled}
                value={field.value || null}
                onChange={(_event, newValue, reason) => {
                    if (reason === 'clear' && clearIdentifier) {
                        clearIdentifier();
                    }
                    field.onChange(newValue);
                }}
                renderInput={(params) => (
                    <TextField
                        error={!!error}
                        {...params}
                        label={required ? `${label} *` : label}
                        variant="outlined"
                        aria-label="input-path"
                    />
                )}
                renderOption={(props, option) => {
                    return (
                        <ListItem {...props}>
                            <Typography>{option}</Typography>
                        </ListItem>
                    );
                }}
                options={options}
            />
            <FormHelperText>{error || hint}</FormHelperText>
        </FormControl>
    );
};
