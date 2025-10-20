// @ts-expect-error TS6133
import React from 'react';

import { ProposedValueFieldList } from './ProposedValueFieldList';
import { ProposedValueFieldText } from './ProposedValueFieldText';

interface ProposedValueFieldProps {
    field: object;
    form: object;
    initialValue?: string;
}

export function ProposedValueField({
    form,
    field,
    initialValue
}: ProposedValueFieldProps) {
    if (
        field.annotationFormat === 'list' &&
        field.annotationFormatListOptions?.length
    ) {
        return (
            <ProposedValueFieldList
                form={form}
                options={field.annotationFormatListOptions}
                multiple={field.annotationFormatListKind === 'multiple'}
                supportsNewValues={
                    field.annotationFormatListSupportsNewValues !== false
                }
            />
        );
    }

    return <ProposedValueFieldText form={form} initialValue={initialValue} />;
}
