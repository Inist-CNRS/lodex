import get from 'lodash.get';

import isEmpty from '../../../common/lib/isEmpty';

export default (resource, field) => {
    const isComposedField = Boolean(field.composedOf);
    if (!isComposedField) {
        return !isEmpty(resource[field.name]);
    }

    const composedFieldNames = get(field, 'composedOf.fields', []);
    return !isEmpty(composedFieldNames);
};
