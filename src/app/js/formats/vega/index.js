import DefaultFormat from '../DefaultFormat';
import Component from './VegaView';
import AdminComponent, { defaultArgs } from './VegaAdmin';
import Icon from './VegaIcon';

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
    Icon,
};
