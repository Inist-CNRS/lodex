import Component from './PDFView';
import DefaultFormat from '../../utils/components/default-format';
import AdminComponent, { defaultArgs } from './PDFAdmin';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
