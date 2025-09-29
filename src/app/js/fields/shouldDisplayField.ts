import get from 'lodash/get';

// @ts-expect-error TS7016
import isEmpty from '../../../common/lib/isEmpty';
// @ts-expect-error TS7016
import { REJECTED } from '../../../common/propositionStatus';

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

    if (fieldStatus === REJECTED) {
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
