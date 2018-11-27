import Component from './LodexFieldView';
import AdminComponent, { defaultArgs } from './LodexFieldAdmin';

import DefaultFormat from '../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    ListComponent: Component,
    defaultArgs,
    predicate: (value, formatData) => {
        if (!DefaultFormat.predicate(value)) {
            return false;
        }

        if (formatData === 'loading' || typeof formatData === 'undefined') {
            return true;
        }

        return Array.isArray(formatData) && formatData.length;
    },
};
