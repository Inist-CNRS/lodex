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

        const linkAB = graph.links.find(
            (l) => String(l.source) === 'A' && String(l.target) === 'B',
        );
        const linkAC = graph.links.find(
            (l) => String(l.source) === 'A' && String(l.target) === 'C',
        );

        expect(linkAB?.value).toBe(1);
        expect(linkAC?.value).toBe(20);

        // @ts-expect-error: value is number
        expect(linkAC?.value > linkAB?.value).toBe(true);

        expect(A?.radius).toBe(10);
        expect(B?.radius).toBe(1);
        expect(C?.radius).toBe(1);

        // @ts-expect-error: radius is number
        expect(A?.radius > B?.radius).toBe(true);
        // @ts-expect-error: radius is number
        expect(A?.radius > C?.radius).toBe(true);
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
        expect(nodeA?.radius).toBe(10);
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
});
