import DefaultView from './DefaultView';
import DefaultEdition from './DefaultEdition';
import DefaultAdmin from './DefaultAdmin';

export default {
    Component: DefaultView,
    ListComponent: DefaultView,
    AdminComponent: DefaultAdmin,
    EditionComponent: DefaultEdition,
    predicate: value =>
        value == null ||
        value === '' ||
        (!Array.isArray(value) && typeof value !== 'object'),
    defaultArgs: {},
};
