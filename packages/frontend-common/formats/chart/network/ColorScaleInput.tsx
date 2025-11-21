import { FormControl, FormHelperText, TextField } from '@mui/material';
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer';
import { useEffect, useState } from 'react';
import type { ArrayInputComponentProps } from '../../../form-fields/ArrayInput';
import { ColorPickerInput } from '../../../form-fields/ColorPickerInput';
import { useTranslate } from '../../../i18n/I18NContext';

export function ColorScaleInput({
    value: initialValue,
    onChange,
}: ColorScaleInputProps) {
    const { translate } = useTranslate();

    const handleChange = useDebouncedCallback(
        (value: ColorScaleItemMaybe) => {
            onChange(value);
        },
        { wait: 100 },
    );

    const [value, setValue] = useState<ColorScaleItem>(initialValue ?? {});

    const handleValuesChange = (values: string) => {
        setValue({ ...value, values });
    };

    const handleColorChange = (color: string) => {
        setValue({ ...value, color });
    };

    useEffect(() => {
        handleChange(value);
    }, [handleChange, value]);

    return (
        <>
            <ColorPickerInput
                label={translate('Color')}
                value={value?.color ?? ''}
                onChange={handleColorChange}
            />
            <FormControl
                sx={{
                    width: '100%',
                    maxWidth: '384px',
                }}
            >
                <TextField
                    label={translate('values')}
                    value={value?.values ?? ''}
                    onChange={(e) => handleValuesChange(e.target.value)}
                    multiline
                    minRows={2}
                    maxRows={8}
                    inputProps={{
                        'aria-multiline': 'true',
                    }}
                />
                <FormHelperText>
                    {translate('one_value_per_line')}
                </FormHelperText>
            </FormControl>
        </>
    );
}

export type ColorScaleItem = {
    color?: string;
    values?: string;
};

export type ColorScaleItemMaybe = ColorScaleItem | undefined;

export type ColorScaleInputProps = ArrayInputComponentProps<ColorScaleItem>;
