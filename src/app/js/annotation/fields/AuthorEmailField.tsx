// @ts-expect-error TS6133
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { TextField } from '../../lib/components/TextField';

interface AuthorEmailFieldProps {
    form: object;
}

export function AuthorEmailField({
    form
}: AuthorEmailFieldProps) {
    const { translate } = useTranslate();
    return (
        <TextField
            form={form}
            name="authorEmail"
            label={translate('annotation.authorEmail')}
            helperText={translate('annotation.authorEmail_helpText')}
        />
    );
}
