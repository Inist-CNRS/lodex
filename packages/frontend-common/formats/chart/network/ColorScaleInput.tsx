import { FormControl, FormHelperText, TextField } from '@mui/material';
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer';
import { useEffect, useMemo, useState } from 'react';
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
        setValue({ ...value, values: values.split('\n') });
    };

    const handleCaptionChange = (caption: string) => {
        setValue({ ...value, caption });
    };

    const handleColorChange = (color: string) => {
        setValue({ ...value, color });
    };

    useEffect(() => {
        handleChange(value);
    }, [handleChange, value]);

    const values = useMemo(() => {
        if (typeof value?.values === 'string') {
            return value.values;
        }

        if (Array.isArray(value?.values)) {
            return value.values.join('\n');
        }

        return '';
    }, [value?.values]);

    return (
        <>
            <ColorPickerInput
                label={translate('Color')}
                value={value?.color ?? ''}
                onChange={handleColorChange}
            />
            <TextField
                label={translate('caption')}
                value={value?.caption ?? ''}
                onChange={(e) => handleCaptionChange(e.target.value)}
                sx={{
                    width: '100%',
                    maxWidth: '256px',
                }}
            />
            <FormControl
                sx={{
                    width: '100%',
                    maxWidth: '512px',
                }}
            >
                <TextField
                    label={translate('values')}
                    value={values}
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
    caption?: string;
    values?: string[] | string;
};

export type ColorScaleItemMaybe = ColorScaleItem | undefined;

export type ColorScaleInputProps = ArrayInputComponentProps<ColorScaleItem>;
