import { ListItem } from '@mui/material';
import { useCallback, useMemo, type HTMLAttributes } from 'react';
import FieldRepresentation from '../../../admin-app/src/fields/FieldRepresentation';
import { AutoComplete } from '../../form-fields/AutoCompleteField';
import { useTranslate } from '../../i18n/I18NContext';
import { useListField } from '../api/useListField';
import type { Field } from '../types';

export function getFieldSelectorOptions(fieldsByName: Record<string, Field>) {
    return Object.keys(fieldsByName)
        .filter((name) => {
            const field = fieldsByName[name];
            return field?.scope === 'document';
        })
        .toSorted((a, b) => {
            const fieldA = fieldsByName[a]!;
            const fieldB = fieldsByName[b]!;

            const fieldALabel = fieldA.label?.toLowerCase() ?? '';
            const fieldBLabel = fieldB.label?.toLowerCase() ?? '';

            const localeCompare = fieldALabel.localeCompare(fieldBLabel);
            if (localeCompare !== 0) {
                return localeCompare;
            }

            return fieldA.name.localeCompare(fieldB.name);
        });
}

type FieldSelectorProps = {
    name?: string;
    label?: string;
    onChange?: (fieldName: string | null) => void;
    value?: string | null;
};

export function FieldSelector({
    label,
    name = 'fieldToFilter',
    value,
    onChange,
}: FieldSelectorProps) {
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
        return getFieldSelectorOptions(fieldsByName);
    }, [fieldsByName]);

    const getOptionLabel = useCallback(
        (fieldName: string) => {
            return fieldsByName[fieldName]
                ? `[${fieldsByName[fieldName].name}] ${fieldsByName[fieldName].label}`
                : fieldName;
        },
        [fieldsByName],
    );

    const renderOption = useCallback(
        (props: HTMLAttributes<HTMLLIElement>, fieldName: string) => {
            const field = fieldsByName[fieldName];
            return (
                <ListItem
                    {...props}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    {field ? <FieldRepresentation field={field} /> : fieldName}
                </ListItem>
            );
        },
        [fieldsByName],
    );

    return (
        <AutoComplete
            name={name}
            label={label ?? translate('field_to_filter')}
            disabled={isFieldListPending}
            options={options}
            getOptionLabel={getOptionLabel}
            renderOption={renderOption}
            value={value}
            onChange={(_, newValue) => onChange?.(newValue)}
        />
    );
}
