import Component, { getReadableValue } from './UriView';
import AdminComponent, { defaultArgs } from '../DefaultUrlAdmin';
import DefaultFormat from '../../utils/components/default-format';
import { isLink } from '../../../../../common/uris';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    getReadableValue,
    AdminComponent,
    defaultArgs,
    predicate: (value) =>
        value == null ||
        value === '' ||
        isLink(value) ||
        (Array.isArray(value) && value.every(isLink)),
};
