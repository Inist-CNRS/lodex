import { TextField } from '@mui/material';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

export const defaultArgs = {
    delimiter: '',
};

interface LatexAdminProps {
    args?: {
        delimiter?: string;
    };
    onChange(...args: unknown[]): unknown;
}

const LatexAdmin = ({ args = defaultArgs, onChange }: LatexAdminProps) => {
    const { translate } = useTranslate();
    // @ts-expect-error TS7006
    const handleDelimiter = (e) => {
        const delimiter = String(e.target.value);
        const newArgs = { ...args, delimiter };
        onChange(newArgs);
    };

    const { delimiter } = args || defaultArgs;

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    label={translate('choose_delimiter')}
                    type="string"
                    onChange={handleDelimiter}
                    value={delimiter}
                    fullWidth
                />
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default LatexAdmin;
