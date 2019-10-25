import get from 'lodash.get';

import isEmpty from '../../../common/lib/isEmpty';

const shouldDisplayField = resource => field => {
    const isEmptyValue = isEmpty(resource[field.name]);
    if (!isEmptyValue) {
        return true;
    }

    const isComposedField = Boolean(field.composedOf);

    if (!isComposedField) {
        return false;
    }

    const composedFields = get(field, 'composedOf.fields', []);

    if (isEmpty(composedFields)) {
        return false;
    }

    return composedFields.some(shouldDisplayField(resource));
};

export default shouldDisplayField;
