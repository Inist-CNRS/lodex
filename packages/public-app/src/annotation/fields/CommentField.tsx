import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { TextField } from '@lodex/frontend-common/components/TextField';

interface CommentFieldProps {
    form: object;
}

export function CommentField({ form }: CommentFieldProps) {
    const { translate } = useTranslate();
    return (
        <TextField
            // @ts-expect-error TS2740
            form={form}
            name="comment"
            label={`${translate('annotation.comment')} *`}
            multiline
        />
    );
}
