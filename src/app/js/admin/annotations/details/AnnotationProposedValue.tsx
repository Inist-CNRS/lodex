import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useTranslate } from '../../../i18n/I18NContext';
import { hasFieldMultipleValues } from '../helpers/field';
import { UserProvidedValueIcon } from './UserProvidedValueIcon';

// @ts-expect-error TS7031
export function AnnotationProposedValue({ proposedValue, field }) {
    const { translate } = useTranslate();

    const hasMultipleValues = useMemo(() => {
        return hasFieldMultipleValues(field);
    }, [field]);

    const fieldSuggestedValues = useMemo(() => {
        return new Set(field.annotationFormatListOptions ?? []);
    }, [field]);

    const proposedValueAsArray = useMemo(() => {
        const proposedValues = []
            .concat(proposedValue)
            .map((value) => ({
                value,
                isAdminProvidedValue:
                    !fieldSuggestedValues.size ||
                    fieldSuggestedValues.has(value),
            }))
            .toSorted((a, b) => {
                if (a.isAdminProvidedValue === b.isAdminProvidedValue) {
                    // @ts-expect-error TS2339
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
                    // @ts-expect-error TS2554
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

AnnotationProposedValue.propTypes = {
    field: PropTypes.shape({
        annotationFormat: PropTypes.oneOf(['text', 'list']),
        annotationFormatListKind: PropTypes.oneOf(['single', 'multiple']),
        annotationFormatListOptions: PropTypes.arrayOf(PropTypes.string),
    }),
    proposedValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
};
