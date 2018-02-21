import Component from './IdentifierBadgeView';
import AdminComponent, { defaultArgs } from './IdentifierBadgeAdmin';
import DefaultFormat from '../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
