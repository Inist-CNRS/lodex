import Component from './SparqlView';
import AdminComponent, { defaultArgs } from './SparqlAdmin';
import DefaultFormat from '../../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    ListComponent: Component,
    defaultArgs,
};
