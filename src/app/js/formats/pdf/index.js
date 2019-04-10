import Component from './PDFView';
import DefaultFormat from '../DefaultFormat';
import AdminComponent, { defaultArgs } from './PDFAdmin';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
