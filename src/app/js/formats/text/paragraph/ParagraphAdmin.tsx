import { MenuItem, TextField } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import { useCallback } from 'react';

export const defaultArgs = {
    paragraphWidth: '100%',
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
};

type ParagraphArgs = {
    paragraphWidth?: string;
    colors?: string;
};

type ParagraphAdminProps = {
    args?: ParagraphArgs;
    onChange: (args: ParagraphArgs) => void;
};

const ParagraphAdmin = ({
    args = defaultArgs,
    onChange,
}: ParagraphAdminProps) => {
    const { translate } = useTranslate();
    const {
        colors = defaultArgs.colors,
        paragraphWidth = defaultArgs.paragraphWidth,
    } = args;

    const handleParagraphWidth = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                paragraphWidth: event.target.value,
            });
        },
        [onChange, args],
    );

    const handleColors = useCallback(
        (colors: string) => {
            onChange({
                ...args,
                colors,
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
                    label={translate('list_format_select_image_width')}
                    onChange={handleParagraphWidth}
                    value={paragraphWidth}
                >
                    <MenuItem value="10%">{translate('ten_percent')}</MenuItem>
                    <MenuItem value="20%">
                        {translate('twenty_percent')}
                    </MenuItem>
                    <MenuItem value="30%">
                        {translate('thirty_percent')}
                    </MenuItem>
                    <MenuItem value="50%">
                        {translate('fifty_percent')}
                    </MenuItem>
                    <MenuItem value="80%">
                        {translate('eighty_percent')}
                    </MenuItem>
                    <MenuItem value="100%">
                        {translate('hundred_percent')}
                    </MenuItem>
                </TextField>
                <ColorPickerParamsAdmin
                    colors={colors}
                    onChange={handleColors}
                    monochromatic={true}
                />
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default ParagraphAdmin;
