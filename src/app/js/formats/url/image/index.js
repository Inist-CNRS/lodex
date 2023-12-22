import Component from './ImageView';
import DefaultFormat from '../../utils/components/default-format';
import AdminComponent, { defaultArgs } from './ImageAdmin';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
