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
    initialValue,
}: ProposedValueFieldProps) {
    if (
        // @ts-expect-error TS2339
        field.annotationFormat === 'list' &&
        // @ts-expect-error TS2339
        field.annotationFormatListOptions?.length
    ) {
        return (
            <ProposedValueFieldList
                form={form}
                // @ts-expect-error TS2339
                options={field.annotationFormatListOptions}
                // @ts-expect-error TS2339
                multiple={field.annotationFormatListKind === 'multiple'}
                supportsNewValues={
                    // @ts-expect-error TS2339
                    field.annotationFormatListSupportsNewValues !== false
                }
            />
        );
    }

    return <ProposedValueFieldText form={form} initialValue={initialValue} />;
}
