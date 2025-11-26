import { FormControlLabel, Switch, TextField } from '@mui/material';
import { ArrayInput } from '../../../form-fields/ArrayInput';
import { useTranslate } from '../../../i18n/I18NContext';
import { ColorScaleInput, type ColorScaleItemMaybe } from './ColorScaleInput';

export function ColorScaleGroup({
    isAdvancedColorMode = false,
    captionTitle = '',
    colorScale = [],
    handleToggleAdvancedColors,
    handleCaptionTitleChange,
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
                <>
                    <TextField
                        label={translate('caption_title')}
                        value={captionTitle ?? ''}
                        onChange={(e) => {
                            handleCaptionTitleChange(e.target.value);
                        }}
                    />
                    <ArrayInput
                        Component={ColorScaleInput}
                        values={colorScale}
                        onChange={handleColorScaleChange}
                    />
                </>
            )}
        </>
    );
}

export type ColorScaleGroupProps = {
    isAdvancedColorMode?: boolean | undefined;
    captionTitle?: string | undefined;
    colorScale?: ColorScaleItemMaybe[] | undefined;
    handleToggleAdvancedColors(checked: boolean): void;
    handleCaptionTitleChange(title: string): void;
    handleColorScaleChange(colorScale: ColorScaleItemMaybe[]): void;
};
