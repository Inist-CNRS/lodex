import Component from './Component';
import AdminComponent, { defaultArgs } from './TrelloTimelineAdmin';
import DefaultFormat from '../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
