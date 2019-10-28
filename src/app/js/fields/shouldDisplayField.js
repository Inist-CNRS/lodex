import get from 'lodash.get';

import isEmpty from '../../../common/lib/isEmpty';

export default (resource, field, isAdmin = false) => {
    if (isAdmin) {
        return true;
    }

    const isFieldEmpty = isEmpty(resource[field.name]);

    const isComposedField = Boolean(field.composedOf);
    if (!isComposedField) {
        return !isFieldEmpty;
    }

    const composedFieldNames = get(field, 'composedOf.fields', []);
    const areChildFieldsEmpty = isEmpty(composedFieldNames);
    return !isFieldEmpty || !areChildFieldsEmpty;
};
