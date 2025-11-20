import { useMemo } from 'react';
import { AutoComplete } from '../../form-fields/AutoCompleteField';
import { useTranslate } from '../../i18n/I18NContext';
import { useListField } from '../api/useListField';

export function FieldSelector({ value, onChange }: FieldSelectorProps) {
    const { translate } = useTranslate();

    const { isFieldListPending, fields } = useListField();

    const fieldsByName = useMemo(() => {
        return fields.reduce<Record<string, (typeof fields)[0]>>(
            (acc, field) => {
                acc[field.name] = field;
                return acc;
            },
            {},
        );
    }, [fields]);

    const options = useMemo(() => {
        return Object.keys(fieldsByName);
    }, [fieldsByName]);

    const getOptionLabel = useMemo(() => {
        return (fieldName: string) => {
            const field = fieldsByName[fieldName];
            if (field) {
                return `[${field.name}] ${field.label}`;
            }
            return fieldName;
        };
    }, [fieldsByName]);

    return (
        <AutoComplete
            name="fieldToFilter"
            label={translate('field_to_filter')}
            disabled={isFieldListPending}
            options={options}
            getOptionLabel={getOptionLabel}
            value={value}
            onChange={(_, newValue) => onChange?.(newValue)}
        />
    );
}

type FieldSelectorProps = {
    onChange?: (fieldName: string | null) => void;
    value?: string | null;
};
