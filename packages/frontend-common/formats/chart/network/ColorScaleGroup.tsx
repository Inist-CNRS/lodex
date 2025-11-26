import { FormControlLabel, Switch } from '@mui/material';
import { ArrayInput } from '../../../form-fields/ArrayInput';
import { useTranslate } from '../../../i18n/I18NContext';
import { ColorScaleInput, type ColorScaleItemMaybe } from './ColorScaleInput';

export function ColorScaleGroup({
    isAdvancedColorMode = false,
    colorScale = [],
    handleToggleAdvancedColors,
    handleColorScaleChange,
}: ColorScaleGroupProps) {
    const { translate } = useTranslate();
    return (
        <>
            <FormControlLabel
                control={
                    <Switch
                        checked={isAdvancedColorMode}
                        onChange={(_, checked) =>
                            handleToggleAdvancedColors(checked)
                        }
                    />
                }
                label={translate('advanced_color_mode')}
            />

            {isAdvancedColorMode && (
                <ArrayInput
                    Component={ColorScaleInput}
                    values={colorScale}
                    onChange={handleColorScaleChange}
                />
            )}
        </>
    );
}

export type ColorScaleGroupProps = {
    isAdvancedColorMode?: boolean | undefined;
    colorScale?: ColorScaleItemMaybe[] | undefined;
    handleToggleAdvancedColors(checked: boolean): void;
    handleColorScaleChange(colorScale: ColorScaleItemMaybe[]): void;
};
