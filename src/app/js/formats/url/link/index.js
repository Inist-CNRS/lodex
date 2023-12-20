import Component from './LinkView';
import AdminComponent, {
    defaultArgs,
} from '../../DefaultAdminComponentWithLabel';
import DefaultFormat from '../../utils/components/DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    ListComponent: Component,
    defaultArgs,
};
