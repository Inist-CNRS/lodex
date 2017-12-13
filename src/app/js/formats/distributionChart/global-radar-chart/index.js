import Component from './RadarChartView';
import AdminComponent from '../AdminComponent';
import DefaultFormat from '../../DefaultFormat';
import injectData from '../../injectData';

export default {
    Component: injectData(Component),
    ListComponent: DefaultFormat.ListComponent,
    AdminComponent,
    EditionComponent: DefaultFormat.EditionComponent,
};
