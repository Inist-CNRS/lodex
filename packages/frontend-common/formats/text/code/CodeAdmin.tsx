import { MenuItem, TextField } from '@mui/material';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '../../../i18n/I18NContext';

export const defaultArgs = {
    languageToHighlight: '',
};

interface CodeAdminProps {
    args?: {
        languageToHighlight?: string;
    };
    onChange(...args: unknown[]): unknown;
}

const CodeAdmin = ({ args = defaultArgs, onChange }: CodeAdminProps) => {
    const { translate } = useTranslate();
    // @ts-expect-error TS7006
    const handleLanguageToHighlight = (languageToHighlight) => {
        onChange({ languageToHighlight });
    };

    const { languageToHighlight } = args || defaultArgs;

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={translate('list_of_language')}
                    onChange={(e) => handleLanguageToHighlight(e.target.value)}
                    value={languageToHighlight}
                >
                    <MenuItem value="xml">{'XML'}</MenuItem>
                    <MenuItem value="json">{'JSON'}</MenuItem>
                    <MenuItem value="ini">{'INI'}</MenuItem>
                    <MenuItem value="shell">{'Shell'}</MenuItem>
                    <MenuItem value="sql">{'SQL'}</MenuItem>
                    <MenuItem value="javascript">{'Javascript'}</MenuItem>
                </TextField>
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default CodeAdmin;
