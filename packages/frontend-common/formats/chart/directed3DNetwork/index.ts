import DefaultFormat from '../../utils/components/default-format';
import Component from './Directed3DNetworkView';
import AdminComponent, { defaultArgs } from '../network3D/Network3DAdmin';
import Icon from '../network/NetworkIcon';

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
    Icon,
};
