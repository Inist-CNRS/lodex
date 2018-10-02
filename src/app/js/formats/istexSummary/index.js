import Component from './IstexSummaryView';
import ListComponent from './IstexSummaryList';
import DefaultFormat from '../DefaultFormat';
import { getApiUrl } from '../shared/fetchIstexData';

export default {
    ...DefaultFormat,
    Component,
    ListComponent,
    defaultArgs: { prefetch: getApiUrl('__VALUE__') },
};
