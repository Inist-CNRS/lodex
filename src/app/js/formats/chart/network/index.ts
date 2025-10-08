import DefaultFormat from '../../utils/components/default-format';
import Component from './NetworkView';
import AdminComponent, { defaultArgs } from './NetworkAdmin';
import Icon from './NetworkIcon';

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
    Icon,
};
