import DefaultFormat from '../../utils/components/default-format';
import Component from './Network3DView';
import AdminComponent, { defaultArgs } from './Network3DAdmin';
import Icon from './NetworkIcon';

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
    Icon,
};
