import Component from './SparqlView';
import AdminComponent, { defaultArgs } from './SparqlAdmin';
import DefaultFormat from '../../../utils/components/DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    ListComponent: Component,
    defaultArgs,
};
