import Component from './EmailView';
import AdminComponent, { defaultArgs } from '../DefaultUrlAdmin';
import DefaultFormat from '../../utils/components/default-format';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
