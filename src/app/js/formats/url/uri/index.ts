import Component, { getReadableValue } from './UriView';
import AdminComponent, { defaultArgs } from '../DefaultUrlAdmin';
import DefaultFormat from '../../utils/components/default-format';
// @ts-expect-error TS7016
import { isLink } from '../../../../../common/uris';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    getReadableValue,
    AdminComponent,
    defaultArgs,
    // @ts-expect-error TS7006
    predicate: (value) =>
        value == null ||
        value === '' ||
        isLink(value) ||
        (Array.isArray(value) && value.every(isLink)),
};
