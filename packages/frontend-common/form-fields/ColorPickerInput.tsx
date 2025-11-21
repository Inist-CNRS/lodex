import { FormControl, Stack, TextField } from '@mui/material';
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer';
import { useMemo } from 'react';
import { useTranslate } from '../i18n/I18NContext';

export function ColorPickerInput({
    value,
    label,
    onChange,
}: ColorPickerInputProps) {
    const { translate } = useTranslate();

    const handleChange = useDebouncedCallback(onChange, {
        wait: 100,
    });

    const { fieldValue, fieldBackgroundColor } = useMemo(() => {
        const fieldValue = value ?? '';
        const fieldBackgroundColor = fieldValue?.match(/^#([0-9a-fA-F]{6})$/)
            ? fieldValue
            : '#000000';

        return {
            fieldValue,
            fieldBackgroundColor,
        };
    }, [value]);

    return (
        <Stack
            direction="row"
            sx={{
                width: '100%',
            }}
            role="group"
            aria-label={label}
        >
            <TextField
                type="color"
                variant="outlined"
                value={fieldValue}
                onChange={(e) => handleChange(e.target.value)}
                InputProps={{
                    sx: {
                        width: 64,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        backgroundColor: fieldBackgroundColor,
                        '& input': {
                            height: '56px',
                            padding: '0',
                        },
                        '& input::-webkit-color-swatch': {
                            borderColor: 'transparent',
                        },
                        '& input::-moz-color-swatch': {
                            borderColor: 'transparent',
                        },
                    },
                }}
                inputProps={{
                    padding: 0,
                    'aria-label': translate('color_picker'),
                }}
                sx={{
                    '&:hover fieldset': {
                        borderRight: '1px solid',
                    },
                    '&:has(~ .MuiFormControl-root .Mui-focused) fieldset': {
                        borderRight: 'none',
                    },
                    '&:has(~ .MuiFormControl-root:hover) fieldset': {
                        borderRight: 'none',
                    },
                }}
            />
            <FormControl sx={{ flexGrow: 1 }}>
                <TextField
                    type="text"
                    variant="outlined"
                    label={label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    InputProps={{
                        sx: {
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,

                            '& fieldset': {
                                borderLeft: 'none',
                            },
                            '&:hover fieldset': {
                                borderLeft: '1px solid',
                            },
                            '&.Mui-focused fieldset': {
                                borderLeft: '2px solid',
                            },
                        },
                    }}
                />
            </FormControl>
        </Stack>
    );
}

export type ColorPickerInputProps = {
    label: string;
    value?: string;
    onChange(value: string): void;
};
