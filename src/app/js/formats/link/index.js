import Component from './Component';
import AdminComponent, { defaultArgs } from '../DefaultAdminComponentWithLabel';
import DefaultFormat from '../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    ListComponent: Component,
    defaultArgs,
};
