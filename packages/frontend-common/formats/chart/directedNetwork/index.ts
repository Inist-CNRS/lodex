import DefaultFormat from '../../utils/components/default-format';
import Component from './DirectedNetworkView';
import AdminComponent, { defaultArgs } from '../network/NetworkAdmin';
import Icon from '../network/NetworkIcon';

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
    Icon,
};
