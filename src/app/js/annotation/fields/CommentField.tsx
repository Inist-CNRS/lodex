// @ts-expect-error TS6133
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { TextField } from '../../lib/components/TextField';

interface CommentFieldProps {
    form: object;
}

export function CommentField({
    form
}: CommentFieldProps) {
    const { translate } = useTranslate();
    return (
        <TextField
            form={form}
            name="comment"
            label={`${translate('annotation.comment')} *`}
            multiline
        />
    );
}
