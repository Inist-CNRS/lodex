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
    validate?: (value: string) => string | undefined;
    className?: string;
    variant?: 'standard' | 'outlined' | 'filled';
};

export const Autocomplete = ({
    name,
    clearIdentifier,
    hint,
    options,
    label,
    disabled = false,
    required = false,
    validate,
    className,
    variant = 'outlined',
}: AutocompleteProps) => {
    const { translate } = useTranslate();
    const { field, fieldState } = useController({
        name,
        rules: {
            required: required ? translate('error_field_required') : false,
            validate,
        },
    });
    const error: string | undefined =
        (fieldState.isDirty && fieldState.error?.message) || undefined;

    return (
        <FormControl className={className} fullWidth error={!!error}>
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
                        variant={variant}
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
