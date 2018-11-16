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
};
