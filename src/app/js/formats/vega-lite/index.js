import DefaultFormat from '../DefaultFormat';
import Component from './VegaLiteView';
import AdminComponent, { defaultArgs } from './VegaLiteAdmin';
import Icon from './VegaLiteIcon';

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
    Icon,
};
