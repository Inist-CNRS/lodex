import {
    FormControl,
    FormHelperText,
    ListItem,
    Autocomplete as MuiAutocomplete,
    TextField,
    Typography,
    type AutocompleteProps as MuiAutocompleteProps,
    type TextFieldProps as MuiTextFieldProps,
} from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { useTranslate } from '../i18n/I18NContext';

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

export const AutoComplete = ({
    name,
    className,
    error,
    getOptionLabel,
    disabled,
    value,
    onChange,
    onInputChange,
    InputProps,
    label,
    variant,
    allowNewItem = false,
    options,
    hint,
    renderOption,
    sx,
    ...props
}: Omit<
    MuiAutocompleteProps<any, false, false, true>,
    'getOptionLabel' | 'renderInput'
> & {
    error?: string;
    hint?: string;
    label: string;
    name: string;
    InputProps?: MuiTextFieldProps;
    variant?: MuiTextFieldProps['variant'];
    allowNewItem?: boolean;
    getOptionLabel: (option: any) => string;
}) => {
    const { translate } = useTranslate();
    const renderOptionMemo = useMemo<
        MuiAutocompleteProps<any, false, false, true>['renderOption']
    >(() => {
        if (renderOption) {
            return renderOption;
        }

        return (props, option) => {
            const label = getOptionLabel(option);
            return (
                <ListItem
                    {...props}
                    key={props.key}
                    role="option"
                    aria-label={label}
                >
                    <Typography>{label}</Typography>
                </ListItem>
            );
        };
    }, [renderOption, getOptionLabel]);

    return (
        <FormControl
            className={className}
            fullWidth
            error={!!error}
            role="group"
            aria-label={`aria-group-${name}`}
            sx={sx}
        >
            <MuiAutocomplete
                {...props}
                renderOption={renderOptionMemo}
                getOptionLabel={getOptionLabel}
                disabled={disabled}
                value={value}
                onChange={onChange}
                onInputChange={onInputChange}
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
                            allowNewItem && value
                                ? `(${translate('actually')} ${
                                      getOptionLabel?.(value) ?? value
                                  })`
                                : undefined
                        }
                    />
                )}
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
    renderOption,
    onChange,
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

            onChange?.(event, newValue, reason, details);

            field.onChange(newValue);
        },
        [field, onChange, clearIdentifier],
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
        [field, allowNewItem, onInputChange],
    );

    const getOptionLabel = useCallback(
        (option: any): any => getOptionLabelProp?.(option) ?? option,
        [getOptionLabelProp],
    );

    return (
        <AutoComplete
            className={className}
            fullWidth
            error={error}
            value={field.value || null}
            onChange={handleValueChosen}
            onInputChange={handleInputValueChange}
            disabled={disabled}
            getOptionLabel={getOptionLabel}
            name={name}
            label={label}
            options={options}
            variant={variant}
            InputProps={InputProps}
            allowNewItem={allowNewItem}
            hint={hint}
            renderOption={renderOption}
        />
    );
};
