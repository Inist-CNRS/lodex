import Component from './MarkdownModalView';
import EditionComponent from '../EditionComponent';
import AdminComponent from './MarkdownModalAdmin';
import DefaultFormat from '../../../utils/components/default-format';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    ListComponent: Component,
    EditionComponent,
    predicate: (value) =>
        value == null || value === '' || typeof value === 'string',
};
