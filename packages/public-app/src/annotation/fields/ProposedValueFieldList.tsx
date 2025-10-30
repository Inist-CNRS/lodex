import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { AutocompleteField } from './AutoCompleteField/AutocompleteField';
import { AutocompleteMultipleField } from './AutoCompleteField/AutocompleteMultipleField';

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
                // @ts-expect-error TS2740
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
            // @ts-expect-error TS2322
            form={form}
            name={NAME}
            label={label}
            options={options}
            required
            supportsNewValues={supportsNewValues}
        />
    );
}
