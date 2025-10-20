// @ts-expect-error TS6133
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { TextField } from '../../lib/components/TextField';

interface AuthorNameFieldProps {
    form: object;
}

export function AuthorNameField({
    form
}: AuthorNameFieldProps) {
    const { translate } = useTranslate();

    return (
        <TextField
            form={form}
            name="authorName"
            label={`${translate('annotation.authorName')} *`}
        />
    );
}
