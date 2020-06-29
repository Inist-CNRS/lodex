import BasicBarChart from './BasicBarChart';
import {
    AXIS_GEOJSON,
    AXIS_HORIZONTAL,
    AXIS_NOMINAL, AXIS_ORDINAL,
    AXIS_QUANTITATIVE, AXIS_TEMPORAL,
    AXIS_VERTICAL, AXIS_X, AXIS_Y,
    LABEL_ASC,
    LABEL_DESC,
    VALUES_ASC,
    VALUES_DESC,
} from '../chartsUtils';

describe('BasicChart', () => {


    it('Default values should filled with all default values', function () {
        let basicBarChart = new BasicBarChart();
        expect(basicBarChart.mark).toBe('bar');
        expect(basicBarChart.direction).toBe(AXIS_VERTICAL);
        expect(basicBarChart.short).toBe(VALUES_ASC);
        expect(basicBarChart.encoding.x).toStrictEqual({
            field: '_id',
            type: AXIS_NOMINAL,
            axis: {
                labelAngle: 0
            },
            title: ''
        });
        expect(basicBarChart.encoding.y).toStrictEqual({
            field: 'value',
            type: AXIS_QUANTITATIVE,
            axis: {
                labelAngle: 0
            },
            scale: {
                type: 'linear'
            },
            title: ''
        });
    });

    it('Default build need to return the vega lite spec with all default values', function() {
        let basicBarChart = new BasicBarChart();
        let defaultBuild = {
            mark: 'bar',
            encoding: {
                x: {
                    field: '_id',
                    type: AXIS_NOMINAL,
                    axis: {
                        labelAngle: 0
                    },
                    title: '',
                    sort: 'y'
                },
                y: {
                    field: 'value',
                    type: AXIS_QUANTITATIVE,
                    axis: {
                        labelAngle: 0
                    },
                    scale: {
                        type: 'linear'
                    },
                    title: ''
                },
                color: {
                    field: '_id',
                    scale: {
                        range: [
                            '#d7191c',
                            '#fdae61',
                            '#ffffbf',
                            '#abdda4',
                            '#2b83ba'
                        ]
                    },
                    type: AXIS_NOMINAL,
                    legend: null
                }
            },
            data: {
                name: 'values'
            },
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        };
        expect(basicBarChart.buildSpec()).toStrictEqual(defaultBuild);
    });

    it('Testing default and updated order', function() {
        let basicBarChart = new BasicBarChart();
        expect(basicBarChart.short).toBe(VALUES_ASC);

        basicBarChart.setOrderBy(VALUES_DESC);
        expect(basicBarChart.short).toBe(VALUES_DESC);

        basicBarChart.setOrderBy(LABEL_ASC);
        expect(basicBarChart.short).toBe(LABEL_ASC);

        basicBarChart.setOrderBy(LABEL_DESC);
        expect(basicBarChart.short).toBe(LABEL_DESC);

        basicBarChart.setOrderBy(VALUES_ASC);
        expect(basicBarChart.short).toBe(VALUES_ASC);
    });

    it('Testing default and updated axis direction', function() {
        let basicBarChart = new BasicBarChart();
        expect(basicBarChart.direction).toBe(AXIS_VERTICAL);

        basicBarChart.setAxisDirection(AXIS_HORIZONTAL);
        expect(basicBarChart.direction).toBe(AXIS_HORIZONTAL);

        basicBarChart.setAxisDirection(AXIS_VERTICAL);
        expect(basicBarChart.direction).toBe(AXIS_VERTICAL);
    });


    it('Testing default and updated axis type on x', function() {
        let basicBarChart = new BasicBarChart();
        expect(basicBarChart.encoding.x.type).toBe(AXIS_NOMINAL);

        basicBarChart.setType(AXIS_X, AXIS_GEOJSON);
        expect(basicBarChart.encoding.x.type).toBe(AXIS_GEOJSON);

        basicBarChart.setType(AXIS_X, AXIS_ORDINAL);
        expect(basicBarChart.encoding.x.type).toBe(AXIS_ORDINAL);

        basicBarChart.setType(AXIS_X, AXIS_QUANTITATIVE);
        expect(basicBarChart.encoding.x.type).toBe(AXIS_QUANTITATIVE);

        basicBarChart.setType(AXIS_X, AXIS_TEMPORAL);
        expect(basicBarChart.encoding.x.type).toBe(AXIS_TEMPORAL);

        basicBarChart.setType(AXIS_X, AXIS_NOMINAL);
        expect(basicBarChart.encoding.x.type).toBe(AXIS_NOMINAL);
    });

    it('Testing default and updated axis type on y', function() {
        let basicBarChart = new BasicBarChart();
        expect(basicBarChart.encoding.y.type).toBe(AXIS_QUANTITATIVE);

        basicBarChart.setType(AXIS_Y, AXIS_GEOJSON);
        expect(basicBarChart.encoding.y.type).toBe(AXIS_GEOJSON);

        basicBarChart.setType(AXIS_Y, AXIS_ORDINAL);
        expect(basicBarChart.encoding.y.type).toBe(AXIS_ORDINAL);


        basicBarChart.setType(AXIS_Y, AXIS_TEMPORAL);
        expect(basicBarChart.encoding.y.type).toBe(AXIS_TEMPORAL);

        basicBarChart.setType(AXIS_Y, AXIS_NOMINAL);
        expect(basicBarChart.encoding.y.type).toBe(AXIS_NOMINAL);

        basicBarChart.setType(AXIS_Y, AXIS_QUANTITATIVE);
        expect(basicBarChart.encoding.y.type).toBe(AXIS_QUANTITATIVE);
    });

    it('Testing default and updated axis title', function() {
        let basicBarChart = new BasicBarChart();
        expect(basicBarChart.encoding.x.title).toBe('');
        expect(basicBarChart.encoding.y.title).toBe('');

        basicBarChart.setTitle(AXIS_X, '1234');
        basicBarChart.setTitle(AXIS_Y, '1234');

        expect(basicBarChart.encoding.x.title).toBe('1234');
        expect(basicBarChart.encoding.y.title).toBe('1234');
    });
})