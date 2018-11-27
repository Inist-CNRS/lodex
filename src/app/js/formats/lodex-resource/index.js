import Component from './LodexResourceView';

import DefaultFormat from '../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    predicate: (value, formatData) => {
        if (!DefaultFormat.predicate(value)) {
            return false;
        }

        if (formatData === 'loading' || typeof formatData === 'undefined') {
            return true;
        }

        return !!formatData;
    },
};
