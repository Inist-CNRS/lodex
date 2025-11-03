import { MenuItem, TextField } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { useCallback } from 'react';

import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    level: 1,
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
};

type TitleArgs = {
    level?: number;
    colors?: string;
};

type TitleAdminProps = {
    args?: TitleArgs;
    onChange: (args: TitleArgs) => void;
};

const TitleAdmin = ({ args = defaultArgs, onChange }: TitleAdminProps) => {
    const { translate: t } = useTranslate();
    const { colors = defaultArgs.colors, level = defaultArgs.level } = args;

    const handleLevel = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                level: parseInt(event.target.value, 10),
            });
        },
        [onChange, args],
    );

    const handleColorsChange = useCallback(
        (colors: string) => {
            const colorValue = colors.split(' ')[0];
            onChange({
                ...args,
                colors: colorValue,
            });
        },
        [onChange, args],
    );

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={t('list_format_select_level')}
                    onChange={handleLevel}
                    value={level}
                    variant="standard"
                >
                    <MenuItem value={1}>{t('level1')}</MenuItem>
                    <MenuItem value={2}>{t('level2')}</MenuItem>
                    <MenuItem value={3}>{t('level3')}</MenuItem>
                    <MenuItem value={4}>{t('level4')}</MenuItem>
                </TextField>
                <ColorPickerParamsAdmin
                    colors={colors}
                    onChange={handleColorsChange}
                    monochromatic={true}
                />
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default TitleAdmin;
