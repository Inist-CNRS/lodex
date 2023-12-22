import Component from './LatexView';
import DefaultFormat from '../../utils/components/default-format';
import AdminComponent, { defaultArgs } from './LatexAdmin';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
