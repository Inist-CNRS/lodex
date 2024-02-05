import PieChart from './PieChart';

describe('PieChart', () => {
    it('build', function() {
        let pieChart = new PieChart();
        expect(pieChart.buildSpec()).toStrictEqual({
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
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
            autosize: {
                contains: 'padding',
                type: 'fit',
            },
        });
    });
});
