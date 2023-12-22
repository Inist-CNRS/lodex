import Component from './RedirectView';
import DefaultFormat from '../../utils/components/default-format';
import { isURL } from '../../../../../common/uris.js';

export default {
    ...DefaultFormat,
    Component,
    predicate: value => value == null || value === '' || isURL,
};
