// @ts-expect-error TS6133
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { TextField } from '../../lib/components/TextField';

interface ProposedValueFieldTextProps {
    form: object;
    initialValue?: string;
}

export function ProposedValueFieldText({
    form,
    initialValue
}: ProposedValueFieldTextProps) {
    const { translate } = useTranslate();

    return (
        <TextField
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
