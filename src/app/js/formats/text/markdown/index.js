import Component from './MarkdownView';
import EditionComponent from './EditionComponent';
import DefaultFormat from '../../utils/components/default-format';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    EditionComponent,
    predicate: value =>
        value == null || value === '' || typeof value === 'string',
};
