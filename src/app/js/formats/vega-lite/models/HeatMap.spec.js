import HeatMap from './HeatMap';
import { LABEL_ASC, LABEL_DESC } from '../../utils/chartsUtils';

describe('HeatMap', () => {
    it('Test flipAxis', function() {
        let heatMap = new HeatMap();
        expect(heatMap.flip).toBe(false);

        heatMap.flipAxis(true);
        expect(heatMap.flip).toBe(true);
    });

    it('Test OrderBy', function() {
        let heatMap = new HeatMap();
        expect(heatMap.orderBy).toBe(LABEL_ASC);

        heatMap.setOrderBy(LABEL_DESC);
        expect(heatMap.orderBy).toBe(LABEL_DESC);
    });

    it('Test Tooltip', function() {
        let heatMap = new HeatMap();
        expect(heatMap.tooltip).toStrictEqual({
            toggle: false,
            source: {
                field: 'source',
                title: 'Source',
                type: 'nominal',
            },
            target: {
                field: 'target',
                title: 'Target',
                type: 'nominal',
            },
            weight: {
                field: 'weight',
                title: 'Weight',
                type: 'quantitative',
            },
        });

        heatMap.setTooltipValue('TestWeight');
        heatMap.setTooltipTarget('TestTarget');
        heatMap.setTooltipCategory('TestSource');
        heatMap.setTooltip(true);

        expect(heatMap.tooltip).toStrictEqual({
            toggle: true,
            source: {
                field: 'source',
                title: 'TestSource',
                type: 'nominal',
            },
            target: {
                field: 'target',
                title: 'TestTarget',
                type: 'nominal',
            },
            weight: {
                field: 'weight',
                title: 'TestWeight',
                type: 'quantitative',
            },
        });
    });

    it('build', function() {
        let heatMap = new HeatMap();
        expect(heatMap.buildSpec(400)).toStrictEqual({
            config: {
                axis: {
                    grid: false,
                    gridOpacity: 0.2,
                    labelBaseline: 'middle',
                    labelFont: 'Quicksand, sans-serif',
                    labelFontSize: 12,
                    labelLimit: 200,
                    tickSize: 0,
                    titleFont: 'Quicksand, sans-serif',
                },
                scale: {
                    bandPaddingInner: 0.1,
                    bandPaddingOuter: 0.1,
                },
                text: {
                    align: 'center',
                    baseline: 'middle',
                    font: 'Quicksand, sans-serif',
                    fontSize: 9,
                },
                view: {
                    stroke: 'black',
                    strokeWidth: 1,
                },
            },
            encoding: {
                x: {
                    axis: {
                        labelAlign: 'left',
                        labelAngle: -45,
                        labelPadding: 10,
                        orient: 'top',
                        title: '',
                    },
                    field: 'source',
                    sort: 'x',
                    title: '',
                    type: 'nominal',
                },
                y: {
                    axis: {
                        labelPadding: 10,
                        title: '',
                    },
                    field: 'target',
                    sort: 'y',
                    title: '',
                    type: 'nominal',
                },
            },
            layer: [
                {
                    encoding: {
                        color: {
                            condition: {
                                test: "datum['weight'] === datum['max_weight']",
                                value: '#2b83ba',
                            },
                            field: 'weight',
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
                            title: 'Nb publis',
                            type: 'quantitative',
                        },
                    },
                    mark: {
                        type: 'rect',
                    },
                },
                {
                    encoding: {
                        color: {
                            condition: {
                                test: "datum['weight'] < datum['max_weight']",
                                value: 'black',
                            },
                            value: 'white',
                        },
                        text: {
                            field: 'weight',
                            title: 'Nb publis',
                            type: 'quantitative',
                        },
                    },
                    mark: {
                        type: 'text',
                    },
                },
            ],
            padding: {
                bottom: 10,
                left: 10,
                right: 10,
                top: 10,
            },
            transform: [
                {
                    filter: {
                        not: 'datum.source === datum.target',
                    },
                },
                {
                    frame: [null, null],
                    window: [
                        {
                            as: 'max_weight',
                            field: 'weight',
                            op: 'max',
                        },
                    ],
                },
                {
                    frame: [null, null],
                    window: [
                        {
                            as: 'mean_weight',
                            field: 'weight',
                            op: 'mean',
                        },
                    ],
                },
            ],
            width: 'container',
            height: 'container',
            autosize: {
                contains: 'padding',
                type: 'fit',
            },
        });
    });
});
