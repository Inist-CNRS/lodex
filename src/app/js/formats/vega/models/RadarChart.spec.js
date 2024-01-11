import RadarChart from './RadarChart';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';

describe('RadarChart', () => {
    it('Test Color', function() {
        const radarChart = new RadarChart();
        expect(radarChart.colors).toStrictEqual(
            MONOCHROMATIC_DEFAULT_COLORSET.split(' '),
        );
    });

    it('Test Tooltip', function() {
        const radarChart = new RadarChart();
        expect(radarChart.tooltip).toStrictEqual({
            toggle: false,
            category: {
                title: 'Category',
            },
            value: {
                title: 'Value',
            },
        });

        radarChart.setTooltip(true);
        radarChart.setTooltipCategory('TestCategory');
        radarChart.setTooltipValue('TestValue');

        expect(radarChart.tooltip).toStrictEqual({
            toggle: true,
            category: {
                title: 'TestCategory',
            },
            value: {
                title: 'TestValue',
            },
        });
    });

    it('build', function() {
        const radarChart = new RadarChart();
        expect(radarChart.buildSpec(400)).toStrictEqual({
            $schema: 'https://vega.github.io/schema/vega/v5.json',
            autosize: {
                contains: 'padding',
                type: 'none',
            },
            background: 'white',
            data: [
                {
                    name: 'table',
                    values: [],
                },
                {
                    name: '_ids',
                    source: 'table',
                    transform: [
                        {
                            groupby: ['_id'],
                            type: 'aggregate',
                        },
                    ],
                },
            ],
            encode: {
                enter: {
                    x: {
                        signal: 'radius',
                    },
                    y: {
                        signal: 'radius',
                    },
                },
            },
            height: 304,
            marks: [
                {
                    from: {
                        facet: {
                            data: 'table',
                            groupby: ['category'],
                            name: 'facet',
                        },
                    },
                    marks: [
                        {
                            encode: {
                                enter: {
                                    fill: {
                                        field: 'category',
                                        scale: 'color',
                                    },
                                    fillOpacity: {
                                        value: 0.1,
                                    },
                                    interpolate: {
                                        value: 'linear-closed',
                                    },
                                    stroke: {
                                        field: 'category',
                                        scale: 'color',
                                    },
                                    strokeWidth: {
                                        value: 1,
                                    },
                                    x: {
                                        signal:
                                            "scale('radial', datum.value) * cos(scale('angular', datum._id))",
                                    },
                                    y: {
                                        signal:
                                            "scale('radial', datum.value) * sin(scale('angular', datum._id))",
                                    },
                                },
                            },
                            from: {
                                data: 'facet',
                            },
                            name: 'category-line',
                            type: 'line',
                        },
                        {
                            encode: {
                                enter: {
                                    align: {
                                        value: 'center',
                                    },
                                    baseline: {
                                        value: 'middle',
                                    },
                                    fill: {
                                        value: 'black',
                                    },
                                    text: {
                                        signal: 'datum.datum.value',
                                    },
                                    x: {
                                        signal: 'datum.x',
                                    },
                                    y: {
                                        signal: 'datum.y',
                                    },
                                },
                            },
                            from: {
                                data: 'category-line',
                            },
                            name: 'value-text',
                            type: 'text',
                        },
                    ],
                    name: 'categories',
                    type: 'group',
                    zindex: 1,
                },
                {
                    encode: {
                        enter: {
                            stroke: {
                                value: 'lightgray',
                            },
                            strokeWidth: {
                                value: 1,
                            },
                            x: {
                                value: 0,
                            },
                            x2: {
                                signal:
                                    "radius * cos(scale('angular', datum._id))",
                            },
                            y: {
                                value: 0,
                            },
                            y2: {
                                signal:
                                    "radius * sin(scale('angular', datum._id))",
                            },
                        },
                    },
                    from: {
                        data: '_ids',
                    },
                    name: 'radial-grid',
                    type: 'rule',
                    zindex: 0,
                },
                {
                    encode: {
                        enter: {
                            align: [
                                {
                                    test:
                                        "abs(scale('angular', datum._id)) > PI / 2",
                                    value: 'right',
                                },
                                {
                                    value: 'left',
                                },
                            ],
                            baseline: [
                                {
                                    test: "scale('angular', datum._id) > 0",
                                    value: 'top',
                                },
                                {
                                    test: "scale('angular', datum._id) == 0",
                                    value: 'middle',
                                },
                                {
                                    value: 'bottom',
                                },
                            ],
                            fill: {
                                value: 'black',
                            },
                            fontWeight: {
                                value: 'bold',
                            },
                            text: {
                                field: '_id',
                            },
                            x: {
                                signal:
                                    "(radius + 5) * cos(scale('angular', datum._id))",
                            },
                            y: {
                                signal:
                                    "(radius + 5) * sin(scale('angular', datum._id))",
                            },
                        },
                    },
                    from: {
                        data: '_ids',
                    },
                    name: '_id-label',
                    type: 'text',
                    zindex: 1,
                },
                {
                    encode: {
                        enter: {
                            interpolate: {
                                value: 'linear-closed',
                            },
                            stroke: {
                                value: 'lightgray',
                            },
                            strokeWidth: {
                                value: 1,
                            },
                            x: {
                                field: 'x2',
                            },
                            y: {
                                field: 'y2',
                            },
                        },
                    },
                    from: {
                        data: 'radial-grid',
                    },
                    name: 'outer-line',
                    type: 'line',
                },
            ],
            padding: {
                bottom: 0,
                left: 120,
                right: 120,
                top: 20,
            },
            scales: [
                {
                    domain: {
                        data: 'table',
                        field: '_id',
                    },
                    name: 'angular',
                    padding: 0.5,
                    range: {
                        signal: '[-PI, PI]',
                    },
                    type: 'point',
                },
                {
                    domain: {
                        data: 'table',
                        field: 'value',
                    },
                    domainMin: 0,
                    name: 'radial',
                    nice: false,
                    range: {
                        signal: '[0, radius]',
                    },
                    type: 'linear',
                    zero: true,
                },
                {
                    domain: {
                        data: 'table',
                        field: 'category',
                    },
                    name: 'color',
                    range: ['#2b83ba'],
                    type: 'ordinal',
                },
            ],
            signals: [
                {
                    name: 'radius',
                    update: 'width / 2',
                },
            ],
            width: 376,
        });
    });
});
