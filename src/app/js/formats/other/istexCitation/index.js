import translate from 'redux-polyglot/translate';

import Component from './IstexCitationView';
import ListComponent from '../istexSummary/IstexSummaryList';
import AdminComponent, { defaultArgs } from './IstexCitationAdmin';
import DefaultFormat from '../../utils/components/default-format';

export default {
    ...DefaultFormat,
    Component: translate(Component),
    ListComponent,
    AdminComponent,
    defaultArgs,
};
