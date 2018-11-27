import get from 'lodash.get';
import translate from 'redux-polyglot/translate';

import Component from './IstexSummaryView';
import ListComponent from './IstexSummaryList';
import AdminComponent, { defaultArgs } from './IstexSummaryAdmin';
import DefaultFormat from '../DefaultFormat';

export default {
    ...DefaultFormat,
    Component: translate(Component),
    ListComponent,
    AdminComponent,
    defaultArgs,
    predicate: (value, formatData) => {
        if (!DefaultFormat.predicate(value)) {
            return false;
        }

        if (formatData === 'loading' || typeof formatData === 'undefined') {
            return true;
        }

        return get(
            formatData,
            'aggregations.publicationDate.buckets.length',
            false,
        );
    },
};
