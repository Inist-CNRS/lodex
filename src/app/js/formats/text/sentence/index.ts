import Component from './SentenceView';
import AdminComponent, { defaultArgs } from './SentenceAdmin';
import DefaultFormat from '../../utils/components/default-format';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
