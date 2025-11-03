import { TextField, MenuItem } from '@mui/material';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

export const defaultArgs = {
    PDFWidth: '100%',
};

interface PDFAdminProps {
    args?: {
        PDFWidth?: string;
    };
    onChange(...args: unknown[]): unknown;
}

const PDFAdmin = ({ args = defaultArgs, onChange }: PDFAdminProps) => {
    const { translate } = useTranslate();
    // @ts-expect-error TS7006
    const handleWidth = (PDFWidth) => {
        const newArgs = {
            ...args,
            PDFWidth,
        };
        onChange(newArgs);
    };

    const { PDFWidth } = args || defaultArgs;

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={translate('list_format_select_image_width')}
                    onChange={(e) => handleWidth(e.target.value)}
                    value={PDFWidth}
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
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default PDFAdmin;
