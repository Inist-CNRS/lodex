import DefaultFormat from '../../utils/components/default-format';
import Component from './CSSView';
import AdminComponent, { defaultArgs } from './CSSAdmin';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
