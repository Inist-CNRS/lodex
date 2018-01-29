import Component from './BubbleView';
import AdminComponent, { defaultArgs } from './BubbleAdmin';
import DefaultFormat from '../DefaultFormat';

export default {
    Component,
    AdminComponent,
    EditionComponent: DefaultFormat.EditionComponent,
    defaultArgs,
};
