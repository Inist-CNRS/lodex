import { renderHook } from '@testing-library/react-hooks';
import {
    useFormatAdvancedNetworkData,
    type AdvancedNetworkData,
} from './useFormatAdvancedNetworkData';

describe('useFormatAdvancedNetworkData', () => {
    it.each<[{ label: string; d: AdvancedNetworkData[] | undefined }]>([
        [{ label: 'undefined', d: undefined }],
        [{ label: 'an empty array', d: [] as AdvancedNetworkData[] }],
    ])('returns empty nodes and links when formatData is $label', ({ d }) => {
        const { result } = renderHook(() =>
            useFormatAdvancedNetworkData({
                formatData: d,
                displayWeighted: true,
            }),
        );

        expect(result.current).toEqual({ nodes: [], links: [] });
    });

    it('correctly formats nodes and links with color size and positions', () => {
        const data: AdvancedNetworkData[] = [
            {
                id: 'A',
                value: {
                    label: 'Node A',
                    targets: [{ id: 'B' }, { id: 'C' }],
                    viz$position: { x: '0', y: '0', z: '0' },
                    viz$color: { r: '255', g: '0', b: '0', a: '1' },
                    viz$size: { value: '0.1' },
                },
                attributes: {
                    alpha: '0.5',
                    zorder: '1',
                },
            },
            {
                id: 'B',
                value: {
                    label: 'Node B',
                    targets: [{ id: 'A' }],
                    viz$position: { x: '1', y: '1', z: '0' },
                    viz$color: { r: '0', g: '255', b: '0', a: '0' },
                    viz$size: { value: '0.01' },
                },
                attributes: {
                    alpha: '0.5',
                    zorder: '1',
                },
            },
            {
                id: 'C',
                value: {
                    label: 'Node C',
                    targets: [{ id: 'A' }],
                    viz$position: { x: '2', y: '2', z: '0' },
                    viz$color: { r: '0', g: '0', b: '255', a: '1' },
                    viz$size: { value: '0.01' },
                },
                attributes: {
                    alpha: '0.5',
                    zorder: '1',
                },
            },
        ];

        const { result } = renderHook(() =>
            useFormatAdvancedNetworkData({
                formatData: data,
                displayWeighted: true,
            }),
        );

        expect(result.current.nodes.length).toBe(3);
        expect(result.current.links.length).toBe(4);

        expect(result.current.nodes).toStrictEqual([
            {
                id: 'A',
                label: 'Node A',
                radius: expect.any(Number),
                color: { r: 255, g: 0, b: 0 },
                links: [
                    {
                        source: 'A',
                        target: 'B',
                        value: expect.any(Number),
                        color: { r: 255, g: 0, b: 0 },
                    },
                    {
                        source: 'A',
                        target: 'C',
                        value: expect.any(Number),
                        color: { r: 255, g: 0, b: 0 },
                    },
                ],
                neighbors: ['B', 'C'],
                x: 0,
                y: 0,
                z: 0,
            },
            {
                id: 'B',
                label: 'Node B',
                radius: expect.any(Number),
                color: { r: 0, g: 255, b: 0 },
                links: [
                    {
                        source: 'B',
                        target: 'A',
                        value: expect.any(Number),
                        color: { r: 0, g: 255, b: 0 },
                    },
                ],
                neighbors: ['A'],
                x: 1000,
                y: 1000,
                z: 0,
            },
            {
                id: 'C',
                label: 'Node C',
                radius: expect.any(Number),
                color: { r: 0, g: 0, b: 255 },
                links: [
                    {
                        source: 'C',
                        target: 'A',
                        value: expect.any(Number),
                        color: { r: 0, g: 0, b: 255 },
                    },
                ],
                neighbors: ['A'],
                x: 2000,
                y: 2000,
                z: 0,
            },
        ]);

        expect(result.current.links).toStrictEqual([
            {
                source: 'A',
                target: 'B',
                value: expect.any(Number),
                color: {
                    r: 255,
                    g: 0,
                    b: 0,
                },
            },
            {
                source: 'A',
                target: 'C',
                value: expect.any(Number),
                color: {
                    r: 255,
                    g: 0,
                    b: 0,
                },
            },
            {
                source: 'B',
                target: 'A',
                value: expect.any(Number),
                color: {
                    r: 0,
                    g: 255,
                    b: 0,
                },
            },
            {
                source: 'C',
                target: 'A',
                value: expect.any(Number),
                color: {
                    r: 0,
                    g: 0,
                    b: 255,
                },
            },
        ]);
    });
});
