import Component from './SparqlView';
import AdminComponent, { defaultArgs } from './SparqlAdmin';
import DefaultFormat from '../../DefaultFormat';
import { isLink } from '../../../../../common/uris';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    ListComponent: Component,
    defaultArgs,
    predicate: isLink,
};
