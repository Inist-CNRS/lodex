import get from 'lodash.get';

import { REJECTED } from '../../../common/propositionStatus';
import isEmpty from '../../../common/lib/isEmpty';

export default (
    resource,
    field,
    fieldStatus,
    predicate = () => true,
    isAdmin = false,
) => {
    if (isAdmin) {
        return true;
    }

    if (fieldStatus === REJECTED) {
        return false;
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
