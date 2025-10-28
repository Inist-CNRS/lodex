import { useCallback } from 'react';
import {
    Autocomplete as MuiAutocomplete,
    FormControl,
    TextField,
    ListItem,
    Typography,
    FormHelperText,
    type AutocompleteProps as MuiAutocompleteProps,
    type TextFieldProps as MuiTextFieldProps,
} from '@mui/material';
import { useController } from 'react-hook-form';
import { useTranslate } from '../../../src/app/js/i18n/I18NContext';

export type AutoCompleteProps = Partial<
    MuiAutocompleteProps<any, false, false, true>
> & {
    name: string;
    clearIdentifier?: () => void;
    allowNewItem?: boolean;
    hint?: string;
    options: string[];
    label: string;
    required?: boolean;
    validate?: (value: string) => string | undefined;
    variant?: MuiTextFieldProps['variant'];
    InputProps?: MuiTextFieldProps;
};

type NotUndefined<T> = T extends undefined ? never : T;

export const AutoCompleteField = ({
    name,
    clearIdentifier,
    allowNewItem = false,
    hint,
    options,
    label: labelProp,
    disabled = false,
    required = false,
    validate,
    className,
    variant = 'outlined',
    InputProps,
    getOptionLabel: getOptionLabelProp,
    onInputChange,
    ...props
}: AutoCompleteProps) => {
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

    const label = required ? `${labelProp} *` : labelProp;

    const handleValueChosen = useCallback<
        NotUndefined<AutoCompleteProps['onChange']>
    >(
        (event, newValue, reason, details): void => {
            if (reason === 'clear' && clearIdentifier) {
                clearIdentifier();
            }

            props.onChange?.(event, newValue, reason, details);

            field.onChange(newValue);
        },
        [field.onChange, props.onChange, clearIdentifier],
    );

    const handleInputValueChange = useCallback<
        NotUndefined<AutoCompleteProps['onInputChange']>
    >(
        (event, value, reason) => {
            onInputChange?.(event, value, reason);
            if (allowNewItem) {
                field.onChange(value);
            }
        },
        [field.onChange, allowNewItem],
    );

    const getOptionLabel = useCallback(
        (option: any): any => getOptionLabelProp?.(option) ?? option,
        [getOptionLabelProp],
    );

    return (
        <FormControl className={className} fullWidth error={!!error}>
            <MuiAutocomplete
                {...props}
                getOptionLabel={getOptionLabel}
                disabled={disabled}
                value={field.value || null}
                onChange={handleValueChosen}
                onInputChange={handleInputValueChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        {...InputProps}
                        error={!!error}
                        label={label}
                        placeholder={label}
                        variant={variant}
                        aria-label="input-path"
                        helperText={
                            allowNewItem && field.value
                                ? `(${translate('actually')} ${
                                      getOptionLabel?.(field.value) ??
                                      field.value
                                  })`
                                : undefined
                        }
                    />
                )}
                renderOption={(props, option) => {
                    return (
                        <ListItem {...props}>
                            <Typography>{getOptionLabel(option)}</Typography>
                        </ListItem>
                    );
                }}
                options={options}
                noOptionsText={translate('no_option')}
            />
            {error ? (
                <FormHelperText error>{error}</FormHelperText>
            ) : (
                <FormHelperText>{hint}</FormHelperText>
            )}
        </FormControl>
    );
};
