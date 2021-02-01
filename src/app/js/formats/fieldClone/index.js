import Component from './FieldCloneView';
import AdminComponent, { defaultArgs } from './FieldCloneAdmin';
import DefaultFormat from '../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
    predicate: value => !!value && typeof value === 'string',
};
