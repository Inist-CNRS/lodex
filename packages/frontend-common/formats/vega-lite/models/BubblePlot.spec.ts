import { LABEL_ASC, LABEL_DESC } from '../../utils/chartsUtils';
import { buildBubblePlotSpec } from './BubblePlot';
import defaultSpec from './json/bubble_plot.vl.json';

describe('BubblePlot', () => {
    it('should return default heatMap spec', function () {
        expect(
            buildBubblePlotSpec({
                flip: false,
                tooltip: {
                    toggle: false,
                },
            }),
        ).toStrictEqual({ ...defaultSpec, background: 'transparent' });
    });

    it('should flip axis when flip is true', function () {
        const spec = buildBubblePlotSpec({
            flip: true,
            tooltip: {
                toggle: false,
            },
        });

        expect(spec).toStrictEqual({
            ...defaultSpec,
            background: 'transparent',
            encoding: {
                ...defaultSpec.encoding,
                x: {
                    ...defaultSpec.encoding.x,
                    field: defaultSpec.encoding.y.field,
                },
                y: {
                    ...defaultSpec.encoding.y,
                    field: defaultSpec.encoding.x.field,
                },
            },
        });
    });

    it('should set orderBy correctly', function () {
        const specAsc = buildBubblePlotSpec({
            flip: false,
            orderBy: LABEL_ASC,
            tooltip: {
                toggle: false,
            },
        });

        expect(specAsc).toStrictEqual({
            ...defaultSpec,
            background: 'transparent',
            encoding: {
                ...defaultSpec.encoding,
                x: {
                    ...defaultSpec.encoding.x,
                    sort: 'x',
                },
                y: {
                    ...defaultSpec.encoding.y,
                    sort: 'y',
                },
            },
        });

        const specDesc = buildBubblePlotSpec({
            flip: false,
            orderBy: LABEL_DESC,
            tooltip: {
                toggle: false,
            },
        });

        expect(specDesc).toStrictEqual({
            ...defaultSpec,
            background: 'transparent',
            encoding: {
                ...defaultSpec.encoding,
                x: {
                    ...defaultSpec.encoding.x,
                    sort: '-x',
                },
                y: {
                    ...defaultSpec.encoding.y,
                    sort: '-y',
                },
            },
        });
    });

    it('should set colors correctly', function () {
        const colors = ['#ff0000', '#00ff00', '#0000ff'];
        const spec = buildBubblePlotSpec({
            colors,
            flip: false,
            tooltip: {
                toggle: false,
            },
        });

        expect(spec).toStrictEqual({
            ...defaultSpec,
            background: 'transparent',
            encoding: {
                ...defaultSpec.encoding,
                color: {
                    ...defaultSpec.encoding.color,
                    scale: {
                        ...defaultSpec.encoding.color.scale,
                        range: colors,
                    },
                },
            },
        });
    });

    it('should set tooltip titles correctly', function () {
        const spec = buildBubblePlotSpec({
            flip: false,
            tooltip: {
                toggle: true,
                sourceTitle: 'Custom Source',
                targetTitle: 'Custom Target',
                weightTitle: 'Custom Weight',
            },
        });

        expect(spec).toStrictEqual({
            ...defaultSpec,
            background: 'transparent',
            encoding: {
                ...defaultSpec.encoding,
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
