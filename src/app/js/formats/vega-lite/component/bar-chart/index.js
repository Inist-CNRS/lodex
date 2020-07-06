import DefaultFormat from '../../../DefaultFormat';
import Component from './BarChartView';
import AdminComponent, { defaultArgs } from './BarChartAdmin';
import Icon from '../../VegaLiteIcon';

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
    Icon,
};
