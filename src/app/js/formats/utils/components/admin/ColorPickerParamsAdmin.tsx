import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useTranslate } from '../../../../i18n/I18NContext';

const multichromatic_maxLength = 100 * 8 - 1; // "#RRGGBB " is 8 chars, minus the last space, so we can set 100 pickers

type ColorItem = {
    color: string;
};

type ColorPickerParamsAdminProps = {
    colors?: string;
    onChange: (colors: string) => void;
    monochromatic?: boolean;
};

const ColorPickerParamsAdmin = ({
    colors = '',
    onChange,
    monochromatic = false,
}: ColorPickerParamsAdminProps) => {
    const { translate } = useTranslate();
    const [colorItems, setColorItems] = useState<ColorItem[]>(() =>
        colors.split(' ').map((color) => ({ color })),
    );

    useEffect(() => {
        setColorItems(colors.split(' ').map((color) => ({ color })));
    }, [colors]);

    const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColors = (e.target.value || '')
            .split(' ')
            .map((color) => ({ color }));

        setColorItems(newColors);
        onChange(e.target.value);
    };

    const handleChangePicker = (
        i: number,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const colorsBuffer = [...colorItems];
        colorsBuffer[i] = { color: e.target.value };

        setColorItems(colorsBuffer);
        onChange(colorsBuffer.map(({ color }) => color).join(' '));
    };

    const createColorPickers = () => {
        return (
            <Box display="flex" flexWrap="wrap" gap={1}>
                {colorItems.map((_, i) => (
                    <input
                        key={i}
                        name="color"
                        type="color"
                        onChange={(e) => handleChangePicker(i, e)}
                        value={colorItems[i].color}
                    />
                ))}
            </Box>
        );
    };

    const getStateColorsString = () => {
        return colorItems.map(({ color }) => color).join(' ');
    };

    return (
        <Box display="flex" flexWrap="wrap" width="100%">
            <Typography>
                {monochromatic ? translate('Color') : translate('colors_set')}
            </Typography>
            <TextField
                label={translate('colors_string')}
                onChange={handleChangeText}
                value={getStateColorsString()}
                inputProps={{
                    maxLength: monochromatic ? 7 : multichromatic_maxLength,
                }}
                fullWidth
                sx={{
                    marginBottom: 1,
                    marginTop: 1,
                }}
            />
            {createColorPickers()}
        </Box>
    );
};

export default ColorPickerParamsAdmin;
