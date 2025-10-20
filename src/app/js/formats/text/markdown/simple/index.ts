import Component from './MarkdownView';
import DefaultFormat from '../../../utils/components/default-format';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    // @ts-expect-error TS7006
    predicate: (value) =>
        value == null || value === '' || typeof value === 'string',
};
