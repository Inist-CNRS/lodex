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
} from '../../chartsUtils';

describe('BasicChart', () => {
    it('Default values should filled with all default values', function() {
        let barChart = new BarChart();
        expect(barChart.direction).toBe(AXIS_HORIZONTAL);
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
        let defaultBuild = {
            encoding: {
                color: {
                    field: '_id',
                    legend: null,
                    scale: {
                        range: [
                            '#d7191c',
                            '#fdae61',
                            '#ffffbf',
                            '#abdda4',
                            '#2b83ba',
                        ],
                    },
                    type: 'nominal',
                },
                x: {
                    axis: {
                        labelAngle: 0,
                    },
                    field: 'value',
                    scale: {
                        type: 'linear',
                    },
                    title: '',
                    type: 'quantitative',
                },
                y: {
                    axis: {
                        labelAngle: 0,
                        labelLimit: 120,
                    },
                    field: '_id',
                    sort: 'x',
                    title: '',
                    type: 'nominal',
                },
            },
            height: {
                step: 20,
            },
            mark: {
                type: 'bar',
            },
            padding: {
                bottom: 0,
                left: 10,
                right: 0,
                top: 10,
            },
            width: 60,
        };
        expect(barChart.buildSpec(200)).toStrictEqual(defaultBuild);
    });

    it('Testing default and updated order', function() {
        let barChart = new BarChart();
        expect(barChart.orderBy).toBe(VALUES_ASC);

        barChart.setOrderBy(VALUES_DESC);
        expect(barChart.orderBy).toBe(VALUES_DESC);

        barChart.setOrderBy(LABEL_ASC);
        expect(barChart.orderBy).toBe(LABEL_ASC);

        barChart.setOrderBy(LABEL_DESC);
        expect(barChart.orderBy).toBe(LABEL_DESC);

        barChart.setOrderBy(VALUES_ASC);
        expect(barChart.orderBy).toBe(VALUES_ASC);
    });

    it('Testing default and updated axis direction', function() {
        let barChart = new BarChart();
        expect(barChart.direction).toBe(AXIS_HORIZONTAL);

        barChart.setAxisDirection(AXIS_VERTICAL);
        expect(barChart.direction).toBe(AXIS_VERTICAL);

        barChart.setAxisDirection(AXIS_HORIZONTAL);
        expect(barChart.direction).toBe(AXIS_HORIZONTAL);
    });

    it('Testing default and updated axis type on x', function() {
        let barChart = new BarChart();
        expect(barChart.type.x).toBe(AXIS_NOMINAL);

        barChart.setType(AXIS_X, AXIS_GEOJSON);
        expect(barChart.type.x).toBe(AXIS_GEOJSON);

        barChart.setType(AXIS_X, AXIS_ORDINAL);
        expect(barChart.type.x).toBe(AXIS_ORDINAL);

        barChart.setType(AXIS_X, AXIS_QUANTITATIVE);
        expect(barChart.type.x).toBe(AXIS_QUANTITATIVE);

        barChart.setType(AXIS_X, AXIS_TEMPORAL);
        expect(barChart.type.x).toBe(AXIS_TEMPORAL);

        barChart.setType(AXIS_X, AXIS_NOMINAL);
        expect(barChart.type.x).toBe(AXIS_NOMINAL);
    });

    it('Testing default and updated axis type on y', function() {
        let barChart = new BarChart();
        expect(barChart.type.y).toBe(AXIS_QUANTITATIVE);

        barChart.setType(AXIS_Y, AXIS_GEOJSON);
        expect(barChart.type.y).toBe(AXIS_GEOJSON);

        barChart.setType(AXIS_Y, AXIS_ORDINAL);
        expect(barChart.type.y).toBe(AXIS_ORDINAL);

        barChart.setType(AXIS_Y, AXIS_TEMPORAL);
        expect(barChart.type.y).toBe(AXIS_TEMPORAL);

        barChart.setType(AXIS_Y, AXIS_NOMINAL);
        expect(barChart.type.y).toBe(AXIS_NOMINAL);

        barChart.setType(AXIS_Y, AXIS_QUANTITATIVE);
        expect(barChart.type.y).toBe(AXIS_QUANTITATIVE);
    });

    it('Testing default and updated axis title', function() {
        let barChart = new BarChart();
        expect(barChart.title.x).toBe('');
        expect(barChart.title.y).toBe('');

        barChart.setTitle(AXIS_X, '1234');
        barChart.setTitle(AXIS_Y, '1234');

        expect(barChart.title.x).toBe('1234');
        expect(barChart.title.y).toBe('1234');
    });
});
