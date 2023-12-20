import Component from './ParagraphView';
import AdminComponent, { defaultArgs } from './ParagraphAdmin';
import EditionComponent from './EditionComponent';
import DefaultFormat from '../../utils/components/DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    EditionComponent,
    defaultArgs,
};
