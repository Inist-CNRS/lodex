import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { TextField } from '@lodex/frontend-common/components/TextField';

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
