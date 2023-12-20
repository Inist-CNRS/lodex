import Component from './EmailView';
import AdminComponent, {
    defaultArgs,
} from '../../DefaultAdminComponentWithLabel';
import DefaultFormat from '../../utils/components/DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
