import Component from './SparqlText';
import AdminComponent, { defaultArgs } from './SparqlAdmin';
import DefaultFormat from '../../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    ListComponent: Component,
    defaultArgs,
};
