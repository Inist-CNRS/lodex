import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from '@mui/material';
// @ts-expect-error TS6133
import React, { useMemo } from 'react';
import { useTranslate } from '../../../i18n/I18NContext';
import { hasFieldMultipleValues } from '../helpers/field';
import { UserProvidedValueIcon } from './UserProvidedValueIcon';

interface AnnotationProposedValueProps {
    field: {
        annotationFormat?: 'text' | 'list';
        annotationFormatListKind?: 'single' | 'multiple';
        annotationFormatListOptions?: string[];
    };
    proposedValue: string | string[];
}

export function AnnotationProposedValue({
    proposedValue,
    field,
}: AnnotationProposedValueProps) {
    const { translate } = useTranslate();

    const hasMultipleValues = useMemo(() => {
        return hasFieldMultipleValues(field);
    }, [field]);

    const fieldSuggestedValues = useMemo(() => {
        return new Set(field.annotationFormatListOptions ?? []);
    }, [field]);

    const proposedValueAsArray = useMemo(() => {
        const proposedValues = ([] as string[])
            .concat(proposedValue)
            .map((value) => ({
                value,
                isAdminProvidedValue:
                    !fieldSuggestedValues.size ||
                    fieldSuggestedValues.has(value),
            }))
            .toSorted((a, b) => {
                if (a.isAdminProvidedValue === b.isAdminProvidedValue) {
                    return a.value.localeCompare(b.value);
                }

                if (a.isAdminProvidedValue) {
                    return -1;
                }

                return 1;
            });

        if (!hasMultipleValues) {
            return proposedValues.slice(0, 1);
        }

        return proposedValues;
    }, [fieldSuggestedValues, proposedValue, hasMultipleValues]);

    return (
        <List dense>
            {proposedValueAsArray.map(({ value, isAdminProvidedValue }, i) => {
                const fieldDescriptionId = isAdminProvidedValue
                    ? undefined
                    : `field-suggested-value-${i}`;

                const userProvidedValueDescription = translate(
                    'annotation_user_provided_value',
                    { value },
                );

                return (
                    <ListItem sx={{ padding: 0 }} key={value}>
                        <ListItemText
                            sx={{ margin: 0, marginRight: 1, flexGrow: 0 }}
                            primary={value}
                            aria-describedby={fieldDescriptionId}
                        />
                        {!isAdminProvidedValue && (
                            <Tooltip
                                title={userProvidedValueDescription}
                                placement="right"
                                arrow
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 'auto',
                                    }}
                                    id={fieldDescriptionId}
                                    aria-label={userProvidedValueDescription}
                                >
                                    <UserProvidedValueIcon />
                                </ListItemIcon>
                            </Tooltip>
                        )}
                    </ListItem>
                );
            })}
        </List>
    );
}
