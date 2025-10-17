import DefaultFormat from '../../utils/components/default-format';
import Component from './LeafletView';
import AdminComponent, { defaultArgs } from './LeafletAdmin';
import Icon from './LeafletIcon';

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
    Icon,
};
