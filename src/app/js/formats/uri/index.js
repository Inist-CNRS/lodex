import Component from './UriView';
import AdminComponent, { defaultArgs } from './UriAdmin';
import DefaultFormat from '../DefaultFormat';
import { isLink } from '../../../../common/uris';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
    predicate: isLink,
};
