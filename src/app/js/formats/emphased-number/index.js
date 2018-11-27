import Component from './EmphasedNumberView';
import AdminComponent, { defaultArgs } from './EmphasedNumberAdmin';
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

        return !!formatData;
    },
};
