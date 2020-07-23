import PieChart from './PieChart';

describe('PieChart', () => {
    it('build', function() {
        let pieChart = new PieChart();
        expect(pieChart.buildSpec(400)).toStrictEqual({
            encoding: {
                color: {
                    field: '_id',
                    legend: {
                        columns: 1,
                        legendX: 200,
                        legendY: 80,
                        orient: 'none',
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
            height: 300,
            layer: [
                {
                    mark: {
                        outerRadius: 80,
                        type: 'arc',
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
                        radius: 90,
                        type: 'text',
                    },
                },
            ],
            view: {
                stroke: null,
            },
            width: 200,
        });
    });
});
