import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { TextField } from '@lodex/frontend-common/components/TextField';

interface AuthorEmailFieldProps {
    form: object;
}

export function AuthorEmailField({ form }: AuthorEmailFieldProps) {
    const { translate } = useTranslate();
    return (
        <TextField
            // @ts-expect-error TS2740
            form={form}
            name="authorEmail"
            label={translate('annotation.authorEmail')}
            helperText={translate('annotation.authorEmail_helpText')}
        />
    );
}
