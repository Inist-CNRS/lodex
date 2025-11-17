import { renderHook } from '@testing-library/react-hooks';
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
            expect(result.current.links.length).toBe(2);

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
        expect(graph.links).toHaveLength(4);

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

        expect(A?.radius).toBe(100);
        expect(B?.radius).toBe(10);
        expect(C?.radius).toBe(10);
        expect(A!.radius > B!.radius).toBe(true);
        expect(A!.radius > C!.radius).toBe(true);
    });

    it('should build bidirectional links', () => {
        const data: NetworkData[] = [{ source: 'A', target: 'B', weight: 1 }];

        const { result } = renderHook(() =>
            useFormatNetworkData({ formatData: data, displayWeighted: true }),
        );

        expect(result.current.links).toHaveLength(2);

        expect(result.current.links).toStrictEqual([
            {
                source: 'A',
                target: 'B',
                value: expect.any(Number),
            },
            {
                source: 'B',
                target: 'A',
                value: expect.any(Number),
            },
        ]);
        expect(result.current.links[0]?.value).toBe(
            result.current.links[1]?.value,
        );
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
        expect(result.current.links).toHaveLength(2);

        expect(result.current.nodes).toStrictEqual([
            {
                id: 'A',
                label: 'A',
                radius: expect.any(Number),
            },
            {
                id: 'B',
                label: 'B',
                radius: expect.any(Number),
            },
        ]);

        expect(result.current.links).toStrictEqual([
            {
                source: 'A',
                target: 'B',
                value: expect.any(Number),
            },
            {
                source: 'B',
                target: 'A',
                value: expect.any(Number),
            },
        ]);

        rerender({ d: data2 });

        expect(result.current.nodes).toHaveLength(3);
        expect(result.current.links).toHaveLength(4);

        expect(result.current.nodes).toStrictEqual([
            {
                id: 'A',
                label: 'A',
                radius: expect.any(Number),
            },
            {
                id: 'B',
                label: 'B',
                radius: expect.any(Number),
            },
            {
                id: 'C',
                label: 'C',
                radius: expect.any(Number),
            },
        ]);

        expect(result.current.links).toStrictEqual([
            {
                source: 'A',
                target: 'B',
                value: expect.any(Number),
            },
            {
                source: 'B',
                target: 'C',
                value: expect.any(Number),
            },
            {
                source: 'B',
                target: 'A',
                value: expect.any(Number),
            },
            {
                source: 'C',
                target: 'B',
                value: expect.any(Number),
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
        expect(nodeA?.radius).toBe(100);
        expect(nodeB?.radius).toBe(10);
        expect(nodeC?.radius).toBe(10);

        const linkAB = result.current.links.find(
            (l) => l.source === 'A' && l.target === 'B',
        );
        const linkAC = result.current.links.find(
            (l) => l.source === 'A' && l.target === 'C',
        );
        expect(linkAB?.value).toBe(1);
        expect(linkAC?.value).toBe(20);
    });
});
