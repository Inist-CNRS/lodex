import Component from './IFrameView';
import DefaultFormat from '../../utils/components/default-format';
import AdminComponent, { defaultArgs } from './IFrameAdmin';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
