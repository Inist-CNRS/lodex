import Component from './LatexView';
import DefaultFormat from '../../utils/components/DefaultFormat';
import AdminComponent, { defaultArgs } from './LatexAdmin';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
