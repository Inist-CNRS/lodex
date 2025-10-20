// @ts-expect-error TS6133
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { AutocompleteField } from '../../lib/components/AutocompleteField';
import { AutocompleteMultipleField } from '../../lib/components/AutocompleteMultipleField';

const NAME = 'proposedValue';

export type ProposedValueFieldListProps = {
    form: object;
    options: string[];
    multiple?: boolean;
    supportsNewValues?: boolean;
};

export function ProposedValueFieldList({
    form,
    options,
    multiple,
    supportsNewValues,
}: ProposedValueFieldListProps) {
    const { translate } = useTranslate();
    const label = `${translate('annotation.proposedValue')} *`;

    if (multiple) {
        return (
            <AutocompleteMultipleField
                form={form}
                name={NAME}
                label={label}
                options={options}
                required
                supportsNewValues={supportsNewValues}
            />
        );
    }

    return (
        <AutocompleteField
            form={form}
            name={NAME}
            label={label}
            options={options}
            required
            supportsNewValues={supportsNewValues}
        />
    );
}
