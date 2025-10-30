import Component from './IstexCitationView';
import ListComponent from '../istexSummary/IstexSummaryList';
import AdminComponent, { defaultArgs } from './IstexCitationAdmin';
import DefaultFormat from '../../utils/components/default-format';
import { translate } from '@lodex/frontend-common/i18n/I18NContext';

export default {
    ...DefaultFormat,
    Component: translate(Component),
    ListComponent,
    AdminComponent,
    defaultArgs,
};
