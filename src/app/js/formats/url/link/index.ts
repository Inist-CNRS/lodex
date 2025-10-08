import Component from './LinkView';
import AdminComponent, { defaultArgs } from '../DefaultUrlAdmin';
import DefaultFormat from '../../utils/components/default-format';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    ListComponent: Component,
    defaultArgs,
};
