import { renderHook } from '@testing-library/react';
import type { Datum } from './type';
import { useFormatTreeData } from './useFormatTreeData';

describe('useFormatTreeData', () => {
    it('should return empty array for empty data', () => {
        const { result } = renderHook(() => useFormatTreeData({ data: [] }));

        expect(result.current.tree).toEqual([]);
    });

    it('should create a simple parent-child relationship', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree).toHaveLength(1);
        expect(result.current.tree[0]).toMatchObject({
            name: 'Parent',
            attributes: {
                hasParent: false,
            },
        });
        expect(result.current.tree[0].children).toHaveLength(1);
        expect(result.current.tree[0].children![0]).toMatchObject({
            name: 'Child',
            attributes: {
                hasParent: true,
            },
        });
    });

    it('should handle multiple children for the same parent', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child1',
            },
            {
                source: 'Parent',
                target: 'Child2',
            },
            {
                source: 'Parent',
                target: 'Child3',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree).toHaveLength(1);
        expect(result.current.tree[0].name).toBe('Parent');
        expect(result.current.tree[0].children).toHaveLength(3);
        expect(result.current.tree[0].children!.map((c) => c.name)).toEqual([
            'Child1',
            'Child2',
            'Child3',
        ]);
    });

    it('should handle multiple root nodes', () => {
        const data: Datum[] = [
            {
                source: 'Root1',
                target: 'Child1',
            },
            {
                source: 'Root2',
                target: 'Child2',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree).toHaveLength(2);
        expect(result.current.tree.map((node) => node.name)).toEqual([
            'Root1',
            'Root2',
        ]);
        expect(
            result.current.tree.every(
                (node) => node.attributes!.hasParent === false,
            ),
        ).toBe(true);
    });

    it('should handle multi-level hierarchies', () => {
        const data: Datum[] = [
            {
                source: 'Root',
                target: 'Level1',
            },
            {
                source: 'Level1',
                target: 'Level2',
            },
            {
                source: 'Level2',
                target: 'Level3',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree).toHaveLength(1);
        expect(result.current.tree[0].name).toBe('Root');
        expect(result.current.tree[0].children![0].name).toBe('Level1');
        expect(result.current.tree[0].children![0].children![0].name).toBe(
            'Level2',
        );
        expect(
            result.current.tree[0].children![0].children![0].children![0].name,
        ).toBe('Level3');
    });

    it.each([
        {
            field: 'title' as const,
            value: 'Test Title',
        },
        {
            field: 'description' as const,
            value: 'Test Description',
        },
        {
            field: 'detail1' as const,
            value: 'Detail 1',
        },
        {
            field: 'detail2' as const,
            value: 'Detail 2',
        },
        {
            field: 'detail3' as const,
            value: 'Detail 3',
        },
    ])('should bind source_$field attribute', ({ field, value }) => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
                [`source_${field}`]: value,
            } as Datum,
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree[0].attributes![field]).toBe(value);
    });

    it('should bind multiple source attributes simultaneously', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
                source_title: 'Parent Title',
                source_description: 'Parent Description',
                source_detail1: 'Detail 1',
                source_detail2: 'Detail 2',
                source_detail3: 'Detail 3',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree[0].attributes).toEqual({
            hasParent: false,
            title: 'Parent Title',
            description: 'Parent Description',
            detail1: 'Detail 1',
            detail2: 'Detail 2',
            detail3: 'Detail 3',
        });
    });

    it('should handle numeric source attribute values', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
                source_title: 42,
                source_detail1: 100,
            } as unknown as Datum,
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree[0].attributes!.title).toBe(42);
        expect(result.current.tree[0].attributes!.detail1).toBe(100);
    });

    it.each([
        { value: null },
        { value: undefined },
        { value: [] },
        { value: {} },
        { value: true },
    ])(
        'should not bind source attributes with invalid type: $value',
        ({ value }) => {
            const data: Datum[] = [
                {
                    source: 'Parent',
                    target: 'Child',
                    source_title: value,
                } as unknown as Datum,
            ];

            const { result } = renderHook(() => useFormatTreeData({ data }));

            expect(result.current.tree[0].attributes).toEqual({
                hasParent: false,
            });
        },
    );

    it.each([
        {
            field: 'title' as const,
            value: 'Child Title',
        },
        {
            field: 'description' as const,
            value: 'Child Description',
        },
        {
            field: 'detail1' as const,
            value: 'Child Detail 1',
        },
        {
            field: 'detail2' as const,
            value: 'Child Detail 2',
        },
        {
            field: 'detail3' as const,
            value: 'Child Detail 3',
        },
    ])('should bind target_$field attribute', ({ field, value }) => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
                [`target_${field}`]: value,
            } as Datum,
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree[0].children![0].attributes![field]).toBe(
            value,
        );
    });

    it('should bind multiple target attributes simultaneously', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
                target_title: 'Child Title',
                target_description: 'Child Description',
                target_detail1: 'Detail 1',
                target_detail2: 'Detail 2',
                target_detail3: 'Detail 3',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree[0].children![0].attributes).toEqual({
            hasParent: true,
            title: 'Child Title',
            description: 'Child Description',
            detail1: 'Detail 1',
            detail2: 'Detail 2',
            detail3: 'Detail 3',
        });
    });

    it('should handle numeric target attribute values', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
                target_title: 99,
                target_description: 200,
            } as unknown as Datum,
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree[0].children![0].attributes!.title).toBe(99);
        expect(
            result.current.tree[0].children![0].attributes!.description,
        ).toBe(200);
    });

    it.each([
        { value: null },
        { value: undefined },
        { value: [] },
        { value: {} },
        { value: false },
    ])(
        'should not bind target attributes with invalid type: $value',
        ({ value }) => {
            const data: Datum[] = [
                {
                    source: 'Parent',
                    target: 'Child',
                    target_description: value,
                } as unknown as Datum,
            ];

            const { result } = renderHook(() => useFormatTreeData({ data }));

            expect(result.current.tree[0].children![0].attributes).toEqual({
                hasParent: true,
            });
        },
    );

    it('should bind both source and target attributes', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
                source_title: 'Parent Title',
                source_description: 'Parent Description',
                target_title: 'Child Title',
                target_description: 'Child Description',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree[0].attributes).toMatchObject({
            title: 'Parent Title',
            description: 'Parent Description',
        });

        expect(result.current.tree[0].children![0].attributes).toMatchObject({
            title: 'Child Title',
            description: 'Child Description',
        });
    });

    it('should handle partial attributes for both source and target', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
                source_title: 'Parent Title',
                target_detail1: 'Child Detail',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree[0].attributes).toEqual({
            hasParent: false,
            title: 'Parent Title',
        });

        expect(result.current.tree[0].children![0].attributes).toEqual({
            hasParent: true,
            detail1: 'Child Detail',
        });
    });

    it('should merge attributes when a node appears as both source and target', () => {
        const data: Datum[] = [
            {
                source: 'Root',
                target: 'Middle',
                target_title: 'Middle as Target',
            },
            {
                source: 'Middle',
                target: 'Child',
                source_title: 'Middle as Source',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        const middleNode = result.current.tree[0].children![0];
        expect(middleNode.name).toBe('Middle');
        expect(middleNode.attributes!.title).toBe('Middle as Source');
    });

    it('should accumulate all children when same source appears multiple times', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child1',
                source_title: 'First Occurrence',
            },
            {
                source: 'Parent',
                target: 'Child2',
                source_title: 'Second Occurrence',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree[0].children).toHaveLength(2);
        expect(result.current.tree[0].attributes!.title).toBe(
            'Second Occurrence',
        );
    });

    it('should return the same tree reference when data does not change', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
            },
        ];

        const { result, rerender } = renderHook(() =>
            useFormatTreeData({ data }),
        );

        const firstTree = result.current.tree;
        rerender();
        const secondTree = result.current.tree;

        expect(firstTree).toBe(secondTree);
    });

    it('should return a new tree reference when data changes', () => {
        const initialData: Datum[] = [
            {
                source: 'Parent1',
                target: 'Child1',
            },
        ];

        const { result, rerender } = renderHook(
            ({ data }) => useFormatTreeData({ data }),
            {
                initialProps: { data: initialData },
            },
        );

        const firstTree = result.current.tree;

        const newData: Datum[] = [
            {
                source: 'Parent2',
                target: 'Child2',
            },
        ];

        rerender({ data: newData });
        const secondTree = result.current.tree;

        expect(firstTree).not.toBe(secondTree);
        expect(firstTree[0].name).toBe('Parent1');
        expect(secondTree[0].name).toBe('Parent2');
    });

    it('should handle a complex tree with multiple levels and attributes', () => {
        const data: Datum[] = [
            {
                source: 'Company',
                target: 'Department A',
                source_title: 'Tech Corp',
                source_description: 'A technology company',
                target_title: 'Engineering',
                target_detail1: 'R&D',
            },
            {
                source: 'Department A',
                target: 'Team 1',
                source_title: 'Engineering',
                target_title: 'Backend Team',
            },
            {
                source: 'Department A',
                target: 'Team 2',
                target_title: 'Frontend Team',
            },
            {
                source: 'Company',
                target: 'Department B',
                target_title: 'Sales',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree).toHaveLength(1);
        expect(result.current.tree[0].name).toBe('Company');
        expect(result.current.tree[0].attributes).toMatchObject({
            hasParent: false,
            title: 'Tech Corp',
            description: 'A technology company',
        });

        expect(result.current.tree[0].children).toHaveLength(2);

        const deptA = result.current.tree[0].children!.find(
            (c) => c.name === 'Department A',
        );
        expect(deptA).toBeDefined();
        expect(deptA!.attributes).toMatchObject({
            hasParent: true,
            title: 'Engineering',
        });
        expect(deptA!.children).toHaveLength(2);
    });

    it('should handle weight attribute without affecting tree structure', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
                weight: 100,
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree).toHaveLength(1);
        expect(result.current.tree[0].children).toHaveLength(1);
    });

    it('should maintain correct hasParent flags in complex hierarchies', () => {
        const data: Datum[] = [
            {
                source: 'Root1',
                target: 'Middle',
            },
            {
                source: 'Root2',
                target: 'Middle',
            },
            {
                source: 'Middle',
                target: 'Leaf',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        const roots = result.current.tree;
        expect(roots).toHaveLength(2);
        expect(
            roots.every((node) => node.attributes!.hasParent === false),
        ).toBe(true);

        roots.forEach((root) => {
            const middle = root.children![0];
            expect(middle.attributes!.hasParent).toBe(true);
            expect(middle.children![0].attributes!.hasParent).toBe(true);
        });
    });

    it('should handle nodes with the same source and target', () => {
        const data: Datum[] = [
            {
                source: 'Node',
                target: 'Node',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree).toHaveLength(0);
    });

    it('should handle empty string as source or target', () => {
        const data: Datum[] = [
            {
                source: '',
                target: 'Child',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree).toHaveLength(1);
        expect(result.current.tree[0].name).toBe('');
    });

    it('should handle special characters in node names', () => {
        const data: Datum[] = [
            {
                source: 'Parent (Main)',
                target: 'Child #1',
            },
            {
                source: 'Parent (Main)',
                target: 'Child @2',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree[0].name).toBe('Parent (Main)');
        expect(result.current.tree[0].children!.map((c) => c.name)).toEqual([
            'Child #1',
            'Child @2',
        ]);
    });

    it('should preserve node order based on data order', () => {
        const data: Datum[] = [
            { source: 'P', target: 'C3' },
            { source: 'P', target: 'C1' },
            { source: 'P', target: 'C2' },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current.tree[0].children!.map((c) => c.name)).toEqual([
            'C3',
            'C1',
            'C2',
        ]);
    });
});
