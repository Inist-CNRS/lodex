import DefaultFormat from '../../../DefaultFormat';
import Component from './HeatMapView';
import AdminComponent, { defaultArgs } from './HeatMapAdmin';
import Icon from '../../VegaLiteIcon';

export default {
    ...DefaultFormat,
    Component: Component,
    AdminComponent,
    defaultArgs,
    Icon,
};
