import Component from './MarkdownModalView';
import AdminComponent from './MarkdownModalAdmin';
import DefaultFormat from '../../../utils/components/default-format';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    ListComponent: Component,
    // @ts-expect-error TS7006
    predicate: (value) =>
        value == null || value === '' || typeof value === 'string',
};
