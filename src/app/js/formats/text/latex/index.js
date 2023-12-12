import Component from './LatexView';
import DefaultFormat from '../../DefaultFormat';
import AdminComponent, { defaultArgs } from './LatexAdmin';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
