import DefaultFormat from '../../utils/components/default-format';
import Component from './VennView';
import AdminComponent, { defaultArgs } from './VennAdmin';
import Icon from './VennIcon';

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
    Icon,
};
