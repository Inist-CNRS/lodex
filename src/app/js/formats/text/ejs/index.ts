import DefaultFormat from '../../utils/components/default-format';
import Component from './EJSView';
import AdminComponent, { defaultArgs } from './EJSAdmin';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
