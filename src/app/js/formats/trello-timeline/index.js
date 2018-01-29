import Component from './TrelloTimelineView';
import AdminComponent, { defaultArgs } from './TrelloTimelineAdmin';
import DefaultFormat from '../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
