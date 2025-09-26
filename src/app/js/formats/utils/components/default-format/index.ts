import DefaultView, { getReadableValue } from './DefaultView';
import DefaultEdition from './DefaultEdition';
import DefaultAdmin from './DefaultAdmin';

export default {
    Component: DefaultView,
    getReadableValue,
    ListComponent: DefaultView,
    AdminComponent: DefaultAdmin,
    EditionComponent: DefaultEdition,
    // @ts-expect-error TS7006
    predicate: (value) =>
        value == null ||
        value === '' ||
        (!Array.isArray(value) && typeof value !== 'object'),
    defaultArgs: {},
};
