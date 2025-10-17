import Component from './ListView';
import AdminComponent, { defaultArgs } from './ListAdmin';
import defaultFormat from '../../utils/components/default-format';

export default {
    ...defaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
    // @ts-expect-error TS7006
    predicate: (value) => value == null || value === '' || Array.isArray(value),
};
