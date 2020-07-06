import BarChart from './BarChart';
import {
    AXIS_GEOJSON,
    AXIS_HORIZONTAL,
    AXIS_NOMINAL,
    AXIS_ORDINAL,
    AXIS_QUANTITATIVE,
    AXIS_TEMPORAL,
    AXIS_VERTICAL,
    AXIS_X,
    AXIS_Y,
    LABEL_ASC,
    LABEL_DESC,
    VALUES_ASC,
    VALUES_DESC,
} from '../chartsUtils';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../colorUtils';

describe('BasicChart', () => {
    it('Default values should filled with all default values', function() {
        let barChart = new BarChart();
        expect(barChart.direction).toBe(AXIS_VERTICAL);
        expect(barChart.orderBy).toBe(VALUES_ASC);
        expect(barChart.model).toStrictEqual(
            require('./json/bar_chart.vl.json'),
        );
        expect(barChart.scale).toBe('linear');
        expect(barChart.labelAngle).toStrictEqual({ x: 0, y: 0 });
        expect(barChart.title).toStrictEqual({ x: '', y: '' });
        expect(barChart.type).toStrictEqual({
            x: AXIS_NOMINAL,
            y: AXIS_QUANTITATIVE,
        });
    });

    it('Default build need to return the vega lite spec with all default values', function() {
        let barChart = new BarChart();
        let defaultBuild = require('./json/bar_chart.vl.json');
        defaultBuild.encoding.color.scale.range = MULTICHROMATIC_DEFAULT_COLORSET.split(
            ' ',
        );
        defaultBuild.encoding.x.sort = 'y';

        expect(barChart.buildSpec()).toStrictEqual(defaultBuild);
    });

    it('Testing default and updated order', function() {
        let barChart = new BarChart();
        expect(barChart.short).toBe(VALUES_ASC);

        barChart.setOrderBy(VALUES_DESC);
        expect(barChart.short).toBe(VALUES_DESC);

        barChart.setOrderBy(LABEL_ASC);
        expect(barChart.short).toBe(LABEL_ASC);

        barChart.setOrderBy(LABEL_DESC);
        expect(barChart.short).toBe(LABEL_DESC);

        barChart.setOrderBy(VALUES_ASC);
        expect(barChart.short).toBe(VALUES_ASC);
    });

    it('Testing default and updated axis direction', function() {
        let barChart = new BarChart();
        expect(barChart.direction).toBe(AXIS_VERTICAL);

        barChart.setAxisDirection(AXIS_HORIZONTAL);
        expect(barChart.direction).toBe(AXIS_HORIZONTAL);

        barChart.setAxisDirection(AXIS_VERTICAL);
        expect(barChart.direction).toBe(AXIS_VERTICAL);
    });

    it('Testing default and updated axis type on x', function() {
        let barChart = new BarChart();
        expect(barChart.encoding.x.type).toBe(AXIS_NOMINAL);

        barChart.setType(AXIS_X, AXIS_GEOJSON);
        expect(barChart.encoding.x.type).toBe(AXIS_GEOJSON);

        barChart.setType(AXIS_X, AXIS_ORDINAL);
        expect(barChart.encoding.x.type).toBe(AXIS_ORDINAL);

        barChart.setType(AXIS_X, AXIS_QUANTITATIVE);
        expect(barChart.encoding.x.type).toBe(AXIS_QUANTITATIVE);

        barChart.setType(AXIS_X, AXIS_TEMPORAL);
        expect(barChart.encoding.x.type).toBe(AXIS_TEMPORAL);

        barChart.setType(AXIS_X, AXIS_NOMINAL);
        expect(barChart.encoding.x.type).toBe(AXIS_NOMINAL);
    });

    it('Testing default and updated axis type on y', function() {
        let barChart = new BarChart();
        expect(barChart.encoding.y.type).toBe(AXIS_QUANTITATIVE);

        barChart.setType(AXIS_Y, AXIS_GEOJSON);
        expect(barChart.encoding.y.type).toBe(AXIS_GEOJSON);

        barChart.setType(AXIS_Y, AXIS_ORDINAL);
        expect(barChart.encoding.y.type).toBe(AXIS_ORDINAL);

        barChart.setType(AXIS_Y, AXIS_TEMPORAL);
        expect(barChart.encoding.y.type).toBe(AXIS_TEMPORAL);

        barChart.setType(AXIS_Y, AXIS_NOMINAL);
        expect(barChart.encoding.y.type).toBe(AXIS_NOMINAL);

        barChart.setType(AXIS_Y, AXIS_QUANTITATIVE);
        expect(barChart.encoding.y.type).toBe(AXIS_QUANTITATIVE);
    });

    it('Testing default and updated axis title', function() {
        let barChart = new BarChart();
        expect(barChart.encoding.x.title).toBe('');
        expect(barChart.encoding.y.title).toBe('');

        barChart.setTitle(AXIS_X, '1234');
        barChart.setTitle(AXIS_Y, '1234');

        expect(barChart.encoding.x.title).toBe('1234');
        expect(barChart.encoding.y.title).toBe('1234');
    });
});
