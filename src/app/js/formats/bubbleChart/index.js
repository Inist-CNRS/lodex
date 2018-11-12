import Component from './BubbleView';
import AdminComponent, { defaultArgs } from './BubbleAdmin';
import DefaultFormat from '../DefaultFormat';
import Icon from './BubbleChartIcon';

export default {
    Component,
    AdminComponent,
    EditionComponent: DefaultFormat.EditionComponent,
    defaultArgs,
    Icon,
};
