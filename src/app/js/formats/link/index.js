import Component from './Component';
import AdminComponent, { defaultArgs } from '../DefaultAdminComponentWithLabel';
import DefaultFormat from '../DefaultFormat';

export default {
    Component,
    AdminComponent,
    EditionComponent: DefaultFormat.EditionComponent,
    defaultArgs,
};
