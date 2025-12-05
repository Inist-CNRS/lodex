import { buildPieChartSpec } from './PieChart';

describe('PieChart', () => {
    it('should build default spec', function () {
        expect(buildPieChartSpec({})).toStrictEqual({
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            background: 'transparent',
            encoding: {
                color: {
                    field: '_id',
                    legend: {
                        columns: 1,
                        orient: 'right',
                        title: null,
                    },
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
                opacity: {
                    condition: {
                        selection: {
                            or: ['hover1', 'click'],
                        },
                        value: 1,
                    },
                    value: 0.2,
                },
                order: {
                    field: 'order',
                    type: 'quantitative',
                },
                theta: {
                    field: 'value',
                    stack: true,
                    type: 'quantitative',
                },
            },
            layer: [
                {
                    mark: {
                        type: 'arc',
                    },
                    selection: {
                        click: {
                            bind: 'legend',
                            on: 'mouseover',
                            empty: 'all',
                            fields: ['_id'],
                            type: 'single',
                        },
                        hover1: {
                            empty: 'all',
                            fields: ['_id'],
                            on: 'mouseover',
                            type: 'single',
                        },
                    },
                },
            ],
            view: {
                stroke: null,
            },
            width: 'container',
            height: 'container',
            padding: 18,
            autosize: {
                contains: 'padding',
                type: 'fit',
            },
        });
    });

    it('should build spec with tooltip and labels', function () {
        expect(
            buildPieChartSpec({
                hasTooltip: true,
                tooltipCategory: 'My Category',
                tooltipValue: 'My Value',
                labels: true,
            }),
        ).toStrictEqual({
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            autosize: {
                contains: 'padding',
                type: 'fit',
            },
            background: 'transparent',
            encoding: {
                color: {
                    field: '_id',
                    legend: {
                        columns: 1,
                        orient: 'right',
                        title: null,
                    },
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
                opacity: {
                    condition: {
                        selection: {
                            or: ['hover1', 'click', 'hover2'],
                        },
                        value: 1,
                    },
                    value: 0.2,
                },
                order: {
                    field: 'order',
                    type: 'quantitative',
                },
                theta: {
                    field: 'value',
                    stack: true,
                    type: 'quantitative',
                },
                tooltip: [
                    {
                        field: '_id',
                        title: 'My Category',
                        type: 'nominal',
                    },
                    {
                        field: 'value',
                        title: 'My Value',
                        type: 'quantitative',
                    },
                ],
            },
            height: 'container',
            layer: [
                {
                    mark: {
                        type: 'arc',
                    },
                    selection: {
                        click: {
                            bind: 'legend',
                            empty: 'all',
                            fields: ['_id'],
                            on: 'mouseover',
                            type: 'single',
                        },
                        hover1: {
                            empty: 'all',
                            fields: ['_id'],
                            on: 'mouseover',
                            type: 'single',
                        },
                    },
                },
                {
                    encoding: {
                        text: {
                            field: 'value',
                            type: 'nominal',
                        },
                    },
                    mark: {
                        fill: 'black',
                        radius: 100,
                        type: 'text',
                    },
                    selection: {
                        hover2: {
                            empty: 'all',
                            fields: ['_id'],
                            on: 'mouseover',
                            type: 'single',
                        },
                    },
                },
            ],
            padding: 18,
            view: {
                stroke: null,
            },
            width: 'container',
        });
    });
});
