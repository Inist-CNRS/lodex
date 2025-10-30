import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { TextField } from '../../lib/components/TextField';

interface ProposedValueFieldTextProps {
    form: object;
    initialValue?: string;
}

export function ProposedValueFieldText({
    form,
    initialValue,
}: ProposedValueFieldTextProps) {
    const { translate } = useTranslate();

    return (
        <TextField
            // @ts-expect-error TS2740
            form={form}
            name="proposedValue"
            label={`${translate('annotation.proposedValue')} *`}
            required
            initialValue={initialValue}
            multiline
            clearable
        />
    );
}
