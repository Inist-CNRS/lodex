import injectData from '../injectData';
import Component from './CartographyView';
import AdminComponent from '../DefaultAdminComponentWithLabel';
import DefaultFormat from '../DefaultFormat';

export default {
    Component: injectData(Component),
    AdminComponent,
    EditionComponent: DefaultFormat.EditionComponent,
};
