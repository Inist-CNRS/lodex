import { useTranslate } from '../../i18n/I18NContext';
import { TextField } from '../../lib/components/TextField';

interface AuthorNameFieldProps {
    form: object;
}

export function AuthorNameField({ form }: AuthorNameFieldProps) {
    const { translate } = useTranslate();

    return (
        <TextField
            // @ts-expect-error TS2740
            form={form}
            name="authorName"
            label={`${translate('annotation.authorName')} *`}
        />
    );
}
