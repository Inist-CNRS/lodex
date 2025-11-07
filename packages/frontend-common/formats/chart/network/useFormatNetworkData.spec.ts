import { renderHook } from '@testing-library/react-hooks';
import {
    useFormatNetworkData,
    type NetworkData,
    type Node,
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

    it('builds nodes with neighbors and links, and scales values monotonically', () => {
        const data: NetworkData[] = [
            { source: 'A', target: 'B', weight: 1 },
            { source: 'A', target: 'C', weight: 3 },
            // should be ignored
            { source: '', target: 'X', weight: 2 } as unknown as NetworkData,
        ];

        const { result } = renderHook(() =>
            useFormatNetworkData({ formatData: data, displayWeighted: true }),
        );

        const graph = result.current as NonNullable<UseFormatNetworkDataReturn>;

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

        // neighbors and links wiring
        const neighborsA = (A?.neighbors ?? [])
            .map((n: Node) => String(n.id))
            .sort();
        expect(neighborsA).toEqual(['B', 'C']);

        const neighborsB = (B?.neighbors ?? []).map((n: Node) => String(n.id));
        expect(neighborsB).toEqual(['A']);

        const neighborsC = (C?.neighbors ?? []).map((n: Node) => String(n.id));
        expect(neighborsC).toEqual(['A']);

        expect(A?.links).toHaveLength(2);
        expect(B?.links).toHaveLength(1);
        expect(C?.links).toHaveLength(1);

        // link weights are scaled monotonically
        const linkAB = graph.links.find(
            (l: { source?: unknown; target?: unknown; value?: number }) =>
                String(l.source) === 'A' && String(l.target) === 'B',
        );
        const linkAC = graph.links.find(
            (l: { source?: unknown; target?: unknown; value?: number }) =>
                String(l.source) === 'A' && String(l.target) === 'C',
        );
        expect(typeof linkAB?.value).toBe('number');
        expect(typeof linkAC?.value).toBe('number');
        expect((linkAC?.value as number) > (linkAB?.value as number)).toBe(
            true,
        );

        // node radius is scaled so that higher degree has larger radius
        expect(typeof A?.radius).toBe('number');
        expect(typeof B?.radius).toBe('number');
        expect(typeof C?.radius).toBe('number');
        expect((A?.radius as number) > (B?.radius as number)).toBe(true);
        expect((A?.radius as number) > (C?.radius as number)).toBe(true);
    });

    it('handles single-link (degenerate domain) case without NaN values', () => {
        const data: NetworkData[] = [{ source: 'A', target: 'B', weight: 5 }];

        const { result } = renderHook(() =>
            useFormatNetworkData({ formatData: data, displayWeighted: true }),
        );

        const graph = result.current as NonNullable<UseFormatNetworkDataReturn>;
        expect(graph.nodes).toHaveLength(2);
        expect(graph.links).toHaveLength(1);

        // In degenerate case (single link), both nodes have degree 1
        // scaleLinear().domain([1, 1]).range([1, 10]) returns middle value: 5.5
        for (const n of graph.nodes) {
            expect(n.radius).toBe(5.5);
        }
        // scaleLinear().domain([5, 5]).range([1, 20]) returns middle value: 10.5
        expect(graph.links[0].value).toBe(10.5);
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

        rerender({ d: data2 });

        expect(result.current.nodes).toHaveLength(3);
        expect(result.current.links).toHaveLength(2);
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

        // All nodes should have radius exactly 1
        for (const n of graph.nodes) {
            expect(n.radius).toBe(1);
        }

        // All links should have value exactly 1
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

        // Non weighted: all ones
        expect(result.current.nodes.every((n) => n.radius === 1)).toBe(true);
        expect(result.current.links.every((l) => l.value === 1)).toBe(true);

        // Toggle to weighted
        rerender({ weighted: true });

        // Weighted: check actual scaled values
        // Node A has degree 2 → radius 10 (max of scale [1, 10])
        // Nodes B and C have degree 1 → radius 1 (min of scale [1, 10])
        const nodeA = result.current.nodes.find((n) => n.id === 'A');
        const nodeB = result.current.nodes.find((n) => n.id === 'B');
        const nodeC = result.current.nodes.find((n) => n.id === 'C');
        expect(nodeA?.radius).toBe(10);
        expect(nodeB?.radius).toBe(1);
        expect(nodeC?.radius).toBe(1);

        // Link with weight 1 → value 1 (min of scale [1, 20])
        // Link with weight 3 → value 20 (max of scale [1, 20])
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
