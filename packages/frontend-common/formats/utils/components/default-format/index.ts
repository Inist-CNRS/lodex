import DefaultView, { getReadableValue } from './DefaultView';
import DefaultAdmin from './DefaultAdmin';

export default {
    Component: DefaultView,
    getReadableValue,
    ListComponent: DefaultView,
    AdminComponent: DefaultAdmin,
    // @ts-expect-error TS7006
    predicate: (value) =>
        value == null ||
        value === '' ||
        (!Array.isArray(value) && typeof value !== 'object'),
    defaultArgs: {},
};
