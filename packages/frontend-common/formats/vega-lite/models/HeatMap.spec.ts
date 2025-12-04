import { LABEL_ASC, LABEL_DESC } from '../../utils/chartsUtils';
import { buildHeatMapSpec } from './HeatMap';
import heatmapVL from './json/heatmap.vl.json';

describe('HeatMap', () => {
    it('should return default heatMap spec', function () {
        expect(
            buildHeatMapSpec({
                flip: false,
                tooltip: {
                    toggle: false,
                },
            }),
        ).toStrictEqual({ ...heatmapVL, background: 'transparent' });
    });

    it('should flip axis when flip is true', function () {
        const spec = buildHeatMapSpec({
            flip: true,
            tooltip: {
                toggle: false,
            },
        });

        expect(spec).toStrictEqual({
            ...heatmapVL,
            background: 'transparent',
            encoding: {
                ...heatmapVL.encoding,
                x: {
                    ...heatmapVL.encoding.x,
                    field: heatmapVL.encoding.y.field,
                },
                y: {
                    ...heatmapVL.encoding.y,
                    field: heatmapVL.encoding.x.field,
                },
            },
        });
    });

    it('should set orderBy correctly', function () {
        const specAsc = buildHeatMapSpec({
            flip: false,
            orderBy: LABEL_ASC,
            tooltip: {
                toggle: false,
            },
        });

        expect(specAsc).toStrictEqual({
            ...heatmapVL,
            background: 'transparent',
            encoding: {
                ...heatmapVL.encoding,
                x: {
                    ...heatmapVL.encoding.x,
                    sort: 'x',
                },
                y: {
                    ...heatmapVL.encoding.y,
                    sort: 'y',
                },
            },
        });

        const specDesc = buildHeatMapSpec({
            flip: false,
            orderBy: LABEL_DESC,
            tooltip: {
                toggle: false,
            },
        });

        expect(specDesc).toStrictEqual({
            ...heatmapVL,
            background: 'transparent',
            encoding: {
                ...heatmapVL.encoding,
                x: {
                    ...heatmapVL.encoding.x,
                    sort: '-x',
                },
                y: {
                    ...heatmapVL.encoding.y,
                    sort: '-y',
                },
            },
        });
    });

    it('should set colors correctly', function () {
        const colors = ['#ff0000', '#00ff00', '#0000ff'];
        const spec = buildHeatMapSpec({
            colors,
            flip: false,
            tooltip: {
                toggle: false,
            },
        });

        expect(spec).toStrictEqual({
            ...heatmapVL,
            background: 'transparent',
            layer: [
                {
                    ...heatmapVL.layer[0],
                    encoding: {
                        ...heatmapVL.layer[0].encoding,
                        color: {
                            ...heatmapVL.layer[0].encoding.color,
                            scale: {
                                ...heatmapVL.layer[0].encoding.color.scale,
                                range: colors,
                            },
                            condition: {
                                ...heatmapVL.layer[0].encoding.color.condition,
                                value: '#0000ff',
                            },
                        },
                    },
                },
                heatmapVL.layer[1],
            ],
        });
    });

    it('should set tooltip titles correctly', function () {
        const spec = buildHeatMapSpec({
            flip: false,
            tooltip: {
                toggle: true,
                sourceTitle: 'Custom Source',
                targetTitle: 'Custom Target',
                weightTitle: 'Custom Weight',
            },
        });

        expect(spec).toStrictEqual({
            ...heatmapVL,
            background: 'transparent',
            encoding: {
                ...heatmapVL.encoding,
                tooltip: [
                    {
                        field: 'source',
                        title: 'Custom Source',
                        type: 'nominal',
                    },
                    {
                        field: 'target',
                        title: 'Custom Target',
                        type: 'nominal',
                    },
                    {
                        field: 'weight',
                        title: 'Custom Weight',
                        type: 'quantitative',
                    },
                ],
            },
        });
    });
});
