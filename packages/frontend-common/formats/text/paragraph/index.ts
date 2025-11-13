import Component from './ParagraphView';
import AdminComponent, { defaultArgs } from './ParagraphAdmin';
import DefaultFormat from '../../utils/components/default-format';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
