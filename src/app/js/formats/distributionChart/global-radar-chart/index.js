import Component from './RadarChartView';
import AdminComponent, { defaultArgs } from './RadarChartAdmin';
import DefaultFormat from '../../DefaultFormat';
import Icon from './RadarChartIcon';

export default {
    ...DefaultFormat,
    Component,
    AdminComponent,
    defaultArgs,
    Icon,
    predicate: (value, formatData) => {
        if (!DefaultFormat.predicate(value)) {
            return false;
        }

        if (formatData === 'loading' || typeof formatData === 'undefined') {
            return true;
        }

        return Array.isArray(formatData) && formatData.length;
    },
};
