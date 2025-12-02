import { renderHook } from '@testing-library/react';
import {
    useFormatNetworkData,
    type NetworkData,
    type UseFormatNetworkDataReturn,
} from './useFormatNetworkData';

describe('useFormatNetworkData', () => {
    it.each<[{ label: string; d: NetworkData[] | undefined }]>([
        [{ label: 'undefined', d: undefined }],
        [{ label: 'an empty array', d: [] as NetworkData[] }],
    ])('returns empty nodes and links when formatData is $label', ({ d }) => {
        const { result } = renderHook(() =>
            useFormatNetworkData({ formatData: d, displayWeighted: true }),
        );

        expect(result.current).toEqual({ nodes: [], links: [] });
    });

    it.each([
        {
            label: 'missing source',
            invalid: {
                source: '',
                target: 'C',
                weight: 2,
            } as unknown as NetworkData,
        },
        {
            label: 'missing target',
            invalid: {
                source: 'D',
                target: '',
                weight: 3,
            } as unknown as NetworkData,
        },
    ])(
        'filters out entries without source or target ($label)',
        ({ invalid }) => {
            const data: NetworkData[] = [
                { source: 'A', target: 'B', weight: 1 },
                invalid,
            ];

            const { result } = renderHook(() =>
                useFormatNetworkData({
                    formatData: data,
                    displayWeighted: true,
                }),
            );

            expect(result.current.nodes.length).toBe(2);
            expect(result.current.links.length).toBe(1);

            const nodeIds = new Set(
                result.current.nodes.map((n) => String(n.id)),
            );
            expect(nodeIds).toEqual(new Set(['A', 'B']));
        },
    );

    it('builds nodes and scales values monotonically', () => {
        const data: NetworkData[] = [
            { source: 'A', target: 'B', weight: 1 },
            { source: 'A', target: 'C', weight: 3 },
            // should be ignored
            { source: '', target: 'X', weight: 2 } as unknown as NetworkData,
        ];

        const { result } = renderHook(() =>
            useFormatNetworkData({ formatData: data, displayWeighted: true }),
        );

        const graph =
            result.current satisfies NonNullable<UseFormatNetworkDataReturn>;

        // structure
        expect(graph.nodes).toHaveLength(3);
        expect(graph.links).toHaveLength(2);

        const getNode = (id: string) =>
            graph.nodes.find((n) => String(n.id) === id);
        const A = getNode('A');
        const B = getNode('B');
        const C = getNode('C');

        expect(A).toBeTruthy();
        expect(B).toBeTruthy();
        expect(C).toBeTruthy();

        const linkAB = graph.links.find(
            (l) => String(l.source) === 'A' && String(l.target) === 'B',
        );
        const linkAC = graph.links.find(
            (l) => String(l.source) === 'A' && String(l.target) === 'C',
        );

        expect(linkAB?.value).toBe(1);
        expect(linkAC?.value).toBe(20);

        expect(linkAC!.value > linkAB!.value).toBe(true);

        expect(A?.radius).toBe(20);
        expect(B?.radius).toBe(1);
        expect(C?.radius).toBe(1);
        expect(A!.radius > B!.radius).toBe(true);
        expect(A!.radius > C!.radius).toBe(true);
    });

    it('updates output when formatData changes', () => {
        const data1: NetworkData[] = [{ source: 'A', target: 'B', weight: 1 }];
        const data2: NetworkData[] = [
            { source: 'A', target: 'B', weight: 1 },
            { source: 'B', target: 'C', weight: 2 },
        ];

        const { result, rerender } = renderHook(
            ({ d }) =>
                useFormatNetworkData({
                    formatData: d,
                    displayWeighted: true,
                }),
            { initialProps: { d: data1 } },
        );

        expect(result.current.nodes).toHaveLength(2);
        expect(result.current.links).toHaveLength(1);

        expect(result.current.nodes).toStrictEqual([
            {
                id: 'A',
                label: 'A',
                radius: expect.any(Number),
                color: undefined,
            },
            {
                id: 'B',
                label: 'B',
                radius: expect.any(Number),
                color: undefined,
            },
        ]);

        expect(result.current.links).toStrictEqual([
            {
                source: 'A',
                target: 'B',
                value: expect.any(Number),
                label: expect.any(Number),
            },
        ]);

        rerender({ d: data2 });

        expect(result.current.nodes).toHaveLength(3);
        expect(result.current.links).toHaveLength(2);

        expect(result.current.nodes).toStrictEqual([
            {
                id: 'A',
                label: 'A',
                radius: expect.any(Number),
                color: undefined,
            },
            {
                id: 'B',
                label: 'B',
                radius: expect.any(Number),
                color: undefined,
            },
            {
                id: 'C',
                label: 'C',
                radius: expect.any(Number),
                color: undefined,
            },
        ]);

        expect(result.current.links).toStrictEqual([
            {
                source: 'A',
                target: 'B',
                value: expect.any(Number),
                label: expect.any(Number),
            },
            {
                source: 'B',
                target: 'C',
                value: expect.any(Number),
                label: expect.any(Number),
            },
        ]);
    });

    it('uses radius=1 for nodes and value=1 for links when displayWeighted is false', () => {
        const data: NetworkData[] = [
            { source: 'A', target: 'B', weight: 1 },
            { source: 'A', target: 'C', weight: 10 },
            { source: 'B', target: 'C', weight: 5 },
        ];

        const { result } = renderHook(() =>
            useFormatNetworkData({ formatData: data, displayWeighted: false }),
        );

        const graph = result.current as NonNullable<UseFormatNetworkDataReturn>;

        for (const n of graph.nodes) {
            expect(n.radius).toBe(1);
        }

        for (const l of graph.links) {
            expect(l.value).toBe(1);
        }
    });

    it('recomputes when toggling displayWeighted', () => {
        const data: NetworkData[] = [
            { source: 'A', target: 'B', weight: 1 },
            { source: 'A', target: 'C', weight: 3 },
        ];

        const { result, rerender } = renderHook(
            ({ weighted }) =>
                useFormatNetworkData({
                    formatData: data,
                    displayWeighted: weighted,
                }),
            { initialProps: { weighted: false } },
        );

        expect(result.current.nodes.every((n) => n.radius === 1)).toBe(true);
        expect(result.current.links.every((l) => l.value === 1)).toBe(true);

        rerender({ weighted: true });

        const nodeA = result.current.nodes.find((n) => n.id === 'A');
        const nodeB = result.current.nodes.find((n) => n.id === 'B');
        const nodeC = result.current.nodes.find((n) => n.id === 'C');
        expect(nodeA?.radius).toBe(20);
        expect(nodeB?.radius).toBe(1);
        expect(nodeC?.radius).toBe(1);

        const linkAB = result.current.links.find(
            (l) => l.source === 'A' && l.target === 'B',
        );
        const linkAC = result.current.links.find(
            (l) => l.source === 'A' && l.target === 'C',
        );
        expect(linkAB?.value).toBe(1);
        expect(linkAC?.value).toBe(20);
    });

    it('assigns colors from colorOverrides to nodes', () => {
        const data: NetworkData[] = [
            { source: 'A', target: 'B', weight: 1 },
            { source: 'B', target: 'C', weight: 2 },
        ];

        const colorOverrides = {
            A: '#FF0000',
            C: '#00FF00',
        };

        const { result } = renderHook(() =>
            useFormatNetworkData({
                formatData: data,
                displayWeighted: true,
                colorOverrides,
            }),
        );

        const nodeA = result.current.nodes.find((n) => n.id === 'A');
        const nodeB = result.current.nodes.find((n) => n.id === 'B');
        const nodeC = result.current.nodes.find((n) => n.id === 'C');

        expect(nodeA?.color).toBe('#FF0000');
        expect(nodeB?.color).toBeUndefined();
        expect(nodeC?.color).toBe('#00FF00');
    });

    it('returns undefined colors when colorOverrides is empty', () => {
        const data: NetworkData[] = [{ source: 'A', target: 'B', weight: 1 }];

        const { result } = renderHook(() =>
            useFormatNetworkData({
                formatData: data,
                displayWeighted: true,
                colorOverrides: {},
            }),
        );

        for (const node of result.current.nodes) {
            expect(node.color).toBeUndefined();
        }
    });

    it('returns undefined colors when colorOverrides is not provided', () => {
        const data: NetworkData[] = [{ source: 'A', target: 'B', weight: 1 }];

        const { result } = renderHook(() =>
            useFormatNetworkData({
                formatData: data,
                displayWeighted: true,
            }),
        );

        for (const node of result.current.nodes) {
            expect(node.color).toBeUndefined();
        }
    });

    it('updates colors when colorOverrides changes', () => {
        const data: NetworkData[] = [{ source: 'A', target: 'B', weight: 1 }];

        const { result, rerender } = renderHook(
            ({ overrides }) =>
                useFormatNetworkData({
                    formatData: data,
                    displayWeighted: true,
                    colorOverrides: overrides,
                }),
            { initialProps: { overrides: {} } },
        );

        expect(
            result.current.nodes.find((n) => n.id === 'A')?.color,
        ).toBeUndefined();

        rerender({ overrides: { A: '#FF0000' } });

        expect(result.current.nodes.find((n) => n.id === 'A')?.color).toBe(
            '#FF0000',
        );

        rerender({ overrides: { A: '#0000FF' } });

        expect(result.current.nodes.find((n) => n.id === 'A')?.color).toBe(
            '#0000FF',
        );
    });

    it('should use source_title as label when provided', () => {
        const data: NetworkData[] = [
            { source: 'A', source_title: 'Alpha', target: 'B', weight: 1 },
            { source: 'B', source_title: 'Beta', target: 'C', weight: 2 },
        ];

        const { result } = renderHook(() =>
            useFormatNetworkData({
                formatData: data,
                displayWeighted: true,
            }),
        );

        const nodeA = result.current.nodes.find((n) => n.id === 'A');
        const nodeB = result.current.nodes.find((n) => n.id === 'B');
        const nodeC = result.current.nodes.find((n) => n.id === 'C');

        expect(nodeA?.label).toBe('Alpha');
        expect(nodeB?.label).toBe('Beta');
        expect(nodeC?.label).toBe('C');
    });
});
