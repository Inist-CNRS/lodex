import { translate } from '../../../i18n/I18NContext';

import Component from './IstexSummaryView';
import ListComponent from './IstexSummaryList';
import AdminComponent, { defaultArgs } from './IstexSummaryAdmin';
import DefaultFormat from '../../utils/components/default-format';

export default {
    ...DefaultFormat,
    Component: translate(Component),
    ListComponent,
    AdminComponent,
    defaultArgs,
};
