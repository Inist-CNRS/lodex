import Component from './MarkdownView';
import EditionComponent from './EditionComponent';
import DefaultFormat from '../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    EditionComponent,
    predicate: value => !!value && typeof value === 'string',
};
