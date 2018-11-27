import Component from './ResourcesGridView';
import AdminComponent, { defaultArgs } from './ResourcesGridAdmin';
import DefaultFormat from '../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    defaultArgs,
    predicate: (value, formatData) => {
        if (!DefaultFormat.predicate(value)) {
            return false;
        }

        if (formatData === 'loading' || typeof formatData === 'undefined') {
            return true;
        }

        return (
            formatData &&
            Array.isArray(formatData.items) &&
            formatData.items.length
        );
    },
};
