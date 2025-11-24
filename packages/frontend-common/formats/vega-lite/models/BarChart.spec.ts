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
} from '../../utils/chartsUtils';

import barChartVlJson from './json/bar_chart.vl.json';

describe('BasicChart', () => {
    it('Default values should filled with all default values', function () {
        const barChart = new BarChart({
            enableSelection: false,
        });
        // @ts-expect-error TS2339
        expect(barChart.direction).toBe(AXIS_HORIZONTAL);
        // @ts-expect-error TS2339
        expect(barChart.model).toStrictEqual(barChartVlJson);
        // @ts-expect-error TS2339
        expect(barChart.scale).toBe('linear');
        // @ts-expect-error TS2551
        expect(barChart.labelAngle).toStrictEqual({ x: 0, y: 0 });
        // @ts-expect-error TS2339
        expect(barChart.title).toStrictEqual({ x: '', y: '' });
        // @ts-expect-error TS2339
        expect(barChart.type).toStrictEqual({
            x: AXIS_NOMINAL,
            y: AXIS_QUANTITATIVE,
        });
    });

    it('should return Default vega lite spec with all default values without label', function () {
        const barChart = new BarChart({
            enableSelection: false,
        });
        const defaultBuild = {
            background: 'transparent',
            autosize: {
                contains: 'padding',
                type: 'fit',
            },
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
                    sort: null,
                    title: '',
                    type: 'quantitative',
                },
                y: {
                    axis: {
                        labelAngle: 0,
                    },
                    field: '_id',
                    sort: null,
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
            padding: 18,
            width: 'container',
        };
        expect(barChart.buildSpec()).toStrictEqual(defaultBuild);
    });

    it('should return Default vega lite spec with all default values with label', function () {
        const barChart = new BarChart({
            enableSelection: false,
        });
        const defaultBuild = {
            autosize: {
                contains: 'padding',
                type: 'fit',
            },
            background: 'transparent',
            config: {
                view: {
                    strokeWidth: 0,
                },
            },
            height: {
                step: 20,
            },
            layer: [
                {
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
                            sort: null,
                            title: '',
                            type: 'quantitative',
                        },
                        y: {
                            axis: {
                                labelAngle: 0,
                            },
                            field: '_id',
                            sort: null,
                            title: '',
                            type: 'nominal',
                        },
                    },
                    mark: {
                        type: 'bar',
                    },
                },
                {
                    encoding: {
                        text: {
                            field: 'value',
                            type: 'quantitative',
                        },
                        x: {
                            axis: null,
                            field: 'value',
                            sort: null,
                            type: 'quantitative',
                        },
                        y: {
                            field: '_id',
                            sort: null,
                            title: '',
                            type: 'nominal',
                        },
                    },
                    mark: {
                        align: 'left',
                        baseline: 'middle',
                        color: 'black',
                        dx: 4,
                        dy: 0,
                        fontSize: 10,
                        fontWeight: 'bold',
                        type: 'text',
                    },
                },
            ],
            padding: 18,
            width: 'container',
        };
        barChart.setLabels(true);
        expect(barChart.buildSpec()).toStrictEqual(defaultBuild);
    });

    it('should return Default vega lite spec with all default values with selection logic when enableSelection is true', function () {
        const barChart = new BarChart({
            enableSelection: true,
        });
        const defaultBuild = {
            autosize: {
                contains: 'padding',
                type: 'fit',
            },
            background: 'transparent',
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
                fillOpacity: {
                    condition: [
                        {
                            param: 'select',
                            value: 1,
                        },
                        {
                            empty: false,
                            param: 'highlight',
                            value: 1,
                        },
                    ],
                    value: 0.3,
                },
                strokeWidth: {
                    condition: [
                        {
                            empty: false,
                            param: 'select',
                            value: 2,
                        },
                        {
                            empty: false,
                            param: 'highlight',
                            value: 1,
                        },
                    ],
                    value: 0,
                },
                x: {
                    axis: {
                        labelAngle: 0,
                    },
                    field: 'value',
                    scale: {
                        type: 'linear',
                    },
                    sort: null,
                    title: '',
                    type: 'quantitative',
                },
                y: {
                    axis: {
                        labelAngle: 0,
                    },
                    field: '_id',
                    sort: null,
                    title: '',
                    type: 'nominal',
                },
            },
            height: {
                step: 20,
            },
            mark: {
                cursor: 'pointer',
                stroke: 'black',
                type: 'bar',
            },
            padding: 18,
            params: [
                {
                    name: 'highlight',
                    select: {
                        on: 'pointerover',
                        type: 'point',
                    },
                },
                {
                    name: 'select',
                    select: 'point',
                },
            ],
            width: 'container',
        };
        expect(barChart.buildSpec()).toStrictEqual(defaultBuild);
    });

    it('should return Default vega lite spec with all default values with selection logic when enableSelection and labels are true', function () {
        const barChart = new BarChart({
            enableSelection: true,
        });
        const defaultBuildWithLabel = {
            autosize: {
                contains: 'padding',
                type: 'fit',
            },
            background: 'transparent',
            config: {
                view: {
                    strokeWidth: 0,
                },
            },
            height: {
                step: 20,
            },
            layer: [
                {
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
                        fillOpacity: {
                            condition: [
                                {
                                    param: 'select',
                                    value: 1,
                                },
                                {
                                    empty: false,
                                    param: 'highlight',
                                    value: 1,
                                },
                            ],
                            value: 0.3,
                        },
                        strokeWidth: {
                            condition: [
                                {
                                    empty: false,
                                    param: 'select',
                                    value: 2,
                                },
                                {
                                    empty: false,
                                    param: 'highlight',
                                    value: 1,
                                },
                            ],
                            value: 0,
                        },
                        x: {
                            axis: {
                                labelAngle: 0,
                            },
                            field: 'value',
                            scale: {
                                type: 'linear',
                            },
                            sort: null,
                            title: '',
                            type: 'quantitative',
                        },
                        y: {
                            axis: {
                                labelAngle: 0,
                            },
                            field: '_id',
                            sort: null,
                            title: '',
                            type: 'nominal',
                        },
                    },
                    mark: {
                        cursor: 'pointer',
                        stroke: 'black',
                        type: 'bar',
                    },
                },
                {
                    encoding: {
                        text: {
                            field: 'value',
                            type: 'quantitative',
                        },
                        x: {
                            axis: null,
                            field: 'value',
                            sort: null,
                            type: 'quantitative',
                        },
                        y: {
                            field: '_id',
                            sort: null,
                            title: '',
                            type: 'nominal',
                        },
                    },
                    mark: {
                        align: 'left',
                        baseline: 'middle',
                        color: 'black',
                        dx: 4,
                        dy: 0,
                        fontSize: 10,
                        fontWeight: 'bold',
                        type: 'text',
                    },
                },
            ],
            padding: 18,
            params: [
                {
                    name: 'highlight',
                    select: {
                        on: 'pointerover',
                        type: 'point',
                    },
                },
                {
                    name: 'select',
                    select: 'point',
                },
            ],
            width: 'container',
        };
        barChart.setLabels(true);
        expect(barChart.buildSpec()).toStrictEqual(defaultBuildWithLabel);
    });

    it('Testing default and updated axis direction', function () {
        const barChart = new BarChart({
            enableSelection: false,
        });
        // @ts-expect-error TS2339
        expect(barChart.direction).toBe(AXIS_HORIZONTAL);

        barChart.setAxisDirection(AXIS_VERTICAL);
        // @ts-expect-error TS2339
        expect(barChart.direction).toBe(AXIS_VERTICAL);

        barChart.setAxisDirection(AXIS_HORIZONTAL);
        // @ts-expect-error TS2339
        expect(barChart.direction).toBe(AXIS_HORIZONTAL);
    });

    it('Testing default and updated axis type on x', function () {
        const barChart = new BarChart({
            enableSelection: false,
        });
        // @ts-expect-error TS2339
        expect(barChart.type.x).toBe(AXIS_NOMINAL);

        barChart.setType(AXIS_X, AXIS_GEOJSON);
        // @ts-expect-error TS2339
        expect(barChart.type.x).toBe(AXIS_GEOJSON);

        barChart.setType(AXIS_X, AXIS_ORDINAL);
        // @ts-expect-error TS2339
        expect(barChart.type.x).toBe(AXIS_ORDINAL);

        barChart.setType(AXIS_X, AXIS_QUANTITATIVE);
        // @ts-expect-error TS2339
        expect(barChart.type.x).toBe(AXIS_QUANTITATIVE);

        barChart.setType(AXIS_X, AXIS_TEMPORAL);
        // @ts-expect-error TS2339
        expect(barChart.type.x).toBe(AXIS_TEMPORAL);

        barChart.setType(AXIS_X, AXIS_NOMINAL);
        // @ts-expect-error TS2339
        expect(barChart.type.x).toBe(AXIS_NOMINAL);
    });

    it('Testing default and updated axis type on y', function () {
        const barChart = new BarChart({
            enableSelection: false,
        });
        // @ts-expect-error TS2339
        expect(barChart.type.y).toBe(AXIS_QUANTITATIVE);

        barChart.setType(AXIS_Y, AXIS_GEOJSON);
        // @ts-expect-error TS2339
        expect(barChart.type.y).toBe(AXIS_GEOJSON);

        barChart.setType(AXIS_Y, AXIS_ORDINAL);
        // @ts-expect-error TS2339
        expect(barChart.type.y).toBe(AXIS_ORDINAL);

        barChart.setType(AXIS_Y, AXIS_TEMPORAL);
        // @ts-expect-error TS2339
        expect(barChart.type.y).toBe(AXIS_TEMPORAL);

        barChart.setType(AXIS_Y, AXIS_NOMINAL);
        // @ts-expect-error TS2339
        expect(barChart.type.y).toBe(AXIS_NOMINAL);

        barChart.setType(AXIS_Y, AXIS_QUANTITATIVE);
        // @ts-expect-error TS2339
        expect(barChart.type.y).toBe(AXIS_QUANTITATIVE);
    });

    it('Testing default and updated axis title', function () {
        const barChart = new BarChart({
            enableSelection: false,
        });
        // @ts-expect-error TS2339
        expect(barChart.title.x).toBe('');
        // @ts-expect-error TS2339
        expect(barChart.title.y).toBe('');

        barChart.setTitle(AXIS_X, '1234');
        barChart.setTitle(AXIS_Y, '1234');

        // @ts-expect-error TS2339
        expect(barChart.title.x).toBe('1234');
        // @ts-expect-error TS2339
        expect(barChart.title.y).toBe('1234');
    });
});
