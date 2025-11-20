import DefaultFormat from '../../utils/components/default-format';
import Component from './Network3DView';
import AdminComponent, { defaultArgs } from './NetworkAdmin';
import Icon from './NetworkIcon';

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
    Icon,
};
