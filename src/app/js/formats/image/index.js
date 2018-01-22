import Component from './Component';
import DefaultFormat from '../DefaultFormat';
import AdminComponent, { defaultArgs } from './ImageAdmin';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
