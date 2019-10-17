import Component from './ListView';
import AdminComponent, { defaultArgs } from './ListAdmin';
import EditionComponent from './EditionComponent';
import defaultFormat from '../DefaultFormat';

export default {
    ...defaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    EditionComponent,
    defaultArgs,
    predicate: value => value == null || value === '' || Array.isArray(value),
};
