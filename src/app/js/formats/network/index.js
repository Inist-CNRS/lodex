import DefaultFormat from '../DefaultFormat';
import Component from './NetworkView';
import AdminComponent, { defaultArgs } from './NetworkAdmin';
import Icon from './NetworkIcon';

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
    Icon,
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
