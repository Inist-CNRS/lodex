import DefaultFormat from '../DefaultFormat';
import Component from './NetworkView';
import AdminComponent, { defaultArgs } from './NetworkAdmin';

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
};
