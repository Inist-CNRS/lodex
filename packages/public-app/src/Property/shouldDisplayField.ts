import get from 'lodash/get';

import { isEmpty, PropositionStatus } from '@lodex/common';

export const shouldDisplayField = (
    resource: Record<string, unknown>,
    field: {
        name: string;
        format: {
            name: string;
            args: {
                value: string;
            };
        };
        composedOf?: {
            fields: string[];
        };
    },
    fieldStatus: string,
    predicate: (value: unknown) => boolean = () => true,
    isAdmin = false,
    canAnnotate = false,
) => {
    if (isAdmin || canAnnotate) {
        return true;
    }

    if (fieldStatus === PropositionStatus.REJECTED) {
        return false;
    }

    if (field.format?.name === 'fieldClone') {
        return !isEmpty(resource[field.format.args.value]);
    }

    const value = resource[field.name];
    const isFieldEmpty = isEmpty(value);

    const isComposedField = Boolean(field.composedOf);

    if (!isComposedField) {
        return !isFieldEmpty && predicate(value);
    }

    const composedFieldNames = get(field, 'composedOf.fields', []);
    const areChildFieldsEmpty = isEmpty(composedFieldNames);
    return !isFieldEmpty || !areChildFieldsEmpty;
};
