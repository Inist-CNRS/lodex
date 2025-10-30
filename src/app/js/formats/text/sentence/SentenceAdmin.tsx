import { TextField } from '@mui/material';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

export const defaultArgs = {
    prefix: '',
    suffix: '',
};

interface SentenceAdminProps {
    args?: {
        prefix?: string;
        suffix?: string;
    };
    onChange(...args: unknown[]): unknown;
}

const SentenceAdmin = ({
    args = defaultArgs,
    onChange,
}: SentenceAdminProps) => {
    const { translate } = useTranslate();
    // @ts-expect-error TS7006
    const handlePrefix = (prefix) => {
        const newArgs = { ...args, prefix };
        onChange(newArgs);
    };

    // @ts-expect-error TS7006
    const handleSuffix = (suffix) => {
        const newArgs = { ...args, suffix };
        onChange(newArgs);
    };

    const { prefix, suffix } = args || defaultArgs;

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    key="prefix"
                    label={translate('prefix')}
                    onChange={(e) => handlePrefix(e.target.value)}
                    value={prefix}
                    sx={{ flexGrow: 1 }}
                />
                <TextField
                    key="suffix"
                    label={translate('suffix')}
                    onChange={(e) => handleSuffix(e.target.value)}
                    value={suffix}
                    sx={{ flexGrow: 1 }}
                />
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default SentenceAdmin;
