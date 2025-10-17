import get from 'lodash/get';

import { isEmpty, PropositionStatus } from '@lodex/common';

export const shouldDisplayField = (
    // @ts-expect-error TS7006
    resource,
    // @ts-expect-error TS7006
    field,
    // @ts-expect-error TS7006
    fieldStatus,
    predicate = () => true,
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
        // @ts-expect-error TS2554
        return !isFieldEmpty && predicate(value);
    }

    const composedFieldNames = get(field, 'composedOf.fields', []);
    const areChildFieldsEmpty = isEmpty(composedFieldNames);
    return !isFieldEmpty || !areChildFieldsEmpty;
};
