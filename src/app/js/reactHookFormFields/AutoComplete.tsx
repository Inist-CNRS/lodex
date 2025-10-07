import {
    Autocomplete as MuiAutocomplete,
    FormControl,
    TextField,
    ListItem,
    Typography,
    FormHelperText,
} from '@mui/material';
import { useController } from 'react-hook-form';

type AutocompleteProps = {
    name: string;
    clearIdentifier?: () => void;
    hint?: string;
    options: string[];
    label: string;
    disabled?: boolean;
};

export const Autocomplete = ({
    name,
    clearIdentifier,
    hint,
    options,
    label,
    disabled = false,
}: AutocompleteProps) => {
    const { field, fieldState } = useController({
        name,
    });
    const finalError: string | undefined =
        (fieldState.isTouched && fieldState.error?.message) || undefined;

    return (
        <FormControl fullWidth error={!!finalError}>
            <MuiAutocomplete
                disabled={disabled}
                onChange={(_event, newValue, reason) => {
                    if (reason === 'clear' && clearIdentifier) {
                        clearIdentifier();
                    }
                    field.onChange(newValue);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
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
            <FormHelperText>{finalError || hint}</FormHelperText>
        </FormControl>
    );
};
