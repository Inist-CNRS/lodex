import Component from './BubbleView';
import AdminComponent, { defaultArgs } from './BubbleAdmin';
import DefaultFormat from '../DefaultFormat';
import Icon from './BubbleChartIcon';

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
