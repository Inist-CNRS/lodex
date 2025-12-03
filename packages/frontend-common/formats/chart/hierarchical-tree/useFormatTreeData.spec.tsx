import { renderHook } from '@testing-library/react';
import type { Datum } from './type';
import { bindAttributes, useFormatTreeData } from './useFormatTreeData';

describe('bindAttributes', () => {
    describe('source attributes', () => {
        it('should return empty object when no attributes exist and no datum fields', () => {
            const datum: Datum = { source: 'A', target: 'B' };
            const result = bindAttributes(datum, undefined, 'source');
            expect(result).toStrictEqual({});
        });

        it('should preserve existing attributes when no datum fields', () => {
            const datum: Datum = { source: 'A', target: 'B' };
            const existing = { hasParent: false, custom: 'value' };
            const result = bindAttributes(datum, existing, 'source');
            expect(result).toStrictEqual({ hasParent: false, custom: 'value' });
        });

        it('should add string attribute from datum', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                source_title: 'Title',
            };
            const result = bindAttributes(datum, undefined, 'source');
            expect(result).toStrictEqual({ title: 'Title' });
        });

        it('should add numeric attribute from datum', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                source_title: 42,
            } as unknown as Datum;
            const result = bindAttributes(datum, undefined, 'source');
            expect(result).toStrictEqual({ title: 42 });
        });

        it('should merge new attributes with existing ones', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                source_title: 'Title',
            };
            const existing = { hasParent: false };
            const result = bindAttributes(datum, existing, 'source');
            expect(result).toStrictEqual({ hasParent: false, title: 'Title' });
        });

        it('should override existing attribute with same key', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                source_title: 'New Title',
            };
            const existing = { title: 'Old Title' };
            const result = bindAttributes(datum, existing, 'source');
            expect(result).toStrictEqual({ title: 'New Title' });
        });

        it('should bind all allowed attribute keys', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                source_title: 'Title',
                source_description: 'Desc',
                source_detail1: 'D1',
                source_detail2: 'D2',
                source_detail3: 'D3',
            };
            const result = bindAttributes(datum, undefined, 'source');
            expect(result).toStrictEqual({
                title: 'Title',
                description: 'Desc',
                detail1: 'D1',
                detail2: 'D2',
                detail3: 'D3',
            });
        });

        it('should not bind attributes with invalid types', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                source_title: null,
                source_description: undefined,
                source_detail1: true,
                source_detail2: [],
                source_detail3: {},
            } as unknown as Datum;
            const result = bindAttributes(datum, undefined, 'source');
            expect(result).toStrictEqual({});
        });

        it('should not mutate the input attributes object', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                source_title: 'Title',
            };
            const existing = { hasParent: false };
            const result = bindAttributes(datum, existing, 'source');
            expect(existing).toStrictEqual({ hasParent: false });
            expect(result).not.toBe(existing);
        });
    });

    describe('target attributes', () => {
        it('should bind target attributes when kind is target', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                target_title: 'Target Title',
            };
            const result = bindAttributes(datum, undefined, 'target');
            expect(result).toStrictEqual({ title: 'Target Title' });
        });

        it('should not bind source attributes when kind is target', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                source_title: 'Source Title',
                target_description: 'Target Desc',
            };
            const result = bindAttributes(datum, undefined, 'target');
            expect(result).toStrictEqual({ description: 'Target Desc' });
        });

        it('should bind all allowed target attribute keys', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                target_title: 'Title',
                target_description: 'Desc',
                target_detail1: 'D1',
                target_detail2: 'D2',
                target_detail3: 'D3',
            };
            const result = bindAttributes(datum, undefined, 'target');
            expect(result).toStrictEqual({
                title: 'Title',
                description: 'Desc',
                detail1: 'D1',
                detail2: 'D2',
                detail3: 'D3',
            });
        });

        it('should merge target attributes with existing ones', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                target_title: 'Title',
            };
            const existing = { hasParent: true };
            const result = bindAttributes(datum, existing, 'target');
            expect(result).toStrictEqual({ hasParent: true, title: 'Title' });
        });
    });

    describe('edge cases', () => {
        it('should handle empty datum object', () => {
            const datum: Datum = { source: 'A', target: 'B' };
            const result = bindAttributes(datum, { hasParent: true }, 'source');
            expect(result).toStrictEqual({ hasParent: true });
        });

        it('should handle datum with only non-allowed fields', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                weight: 100,
            };
            const result = bindAttributes(datum, undefined, 'source');
            expect(result).toStrictEqual({});
        });

        it('should handle mixed valid and invalid attribute types', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                source_title: 'Valid',
                source_description: null,
                source_detail1: 42,
                source_detail2: undefined,
                source_detail3: 'Also Valid',
            } as unknown as Datum;
            const result = bindAttributes(datum, undefined, 'source');
            expect(result).toStrictEqual({
                title: 'Valid',
                detail1: 42,
                detail3: 'Also Valid',
            });
        });

        it('should handle numeric zero as valid value', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                source_title: 0,
            } as unknown as Datum;
            const result = bindAttributes(datum, undefined, 'source');
            expect(result).toStrictEqual({ title: 0 });
        });

        it('should handle empty string as valid value', () => {
            const datum: Datum = {
                source: 'A',
                target: 'B',
                source_title: '',
            };
            const result = bindAttributes(datum, undefined, 'source');
            expect(result).toStrictEqual({ title: '' });
        });
    });
});

describe('useFormatTreeData', () => {
    it('should return empty array for empty data', () => {
        const { result } = renderHook(() => useFormatTreeData({ data: [] }));

        expect(result.current).toEqual([]);
    });

    it('should create a simple parent-child relationship', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current).toStrictEqual([
            {
                name: 'Parent',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'Child',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                ],
            },
        ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Parent',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'Child1',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                    {
                        name: 'Child2',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                    {
                        name: 'Child3',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                ],
            },
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

        expect(result.current).toStrictEqual([
            {
                name: 'Root1',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'Child1',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                ],
            },
            {
                name: 'Root2',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'Child2',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                ],
            },
        ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Root',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'Level1',
                        attributes: {
                            hasParent: true,
                        },
                        children: [
                            {
                                name: 'Level2',
                                attributes: {
                                    hasParent: true,
                                },
                                children: [
                                    {
                                        name: 'Level3',
                                        attributes: {
                                            hasParent: true,
                                        },
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Parent',
                attributes: {
                    hasParent: false,
                    [field]: value,
                },
                children: [
                    {
                        name: 'Child',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                ],
            },
        ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Parent',
                attributes: {
                    hasParent: false,
                    title: 'Parent Title',
                    description: 'Parent Description',
                    detail1: 'Detail 1',
                    detail2: 'Detail 2',
                    detail3: 'Detail 3',
                },
                children: [
                    {
                        name: 'Child',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                ],
            },
        ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Parent',
                attributes: {
                    hasParent: false,
                    title: 42,
                    detail1: 100,
                },
                children: [
                    {
                        name: 'Child',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                ],
            },
        ]);
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

            expect(result.current).toStrictEqual([
                {
                    name: 'Parent',
                    attributes: {
                        hasParent: false,
                    },
                    children: [
                        {
                            name: 'Child',
                            attributes: {
                                hasParent: true,
                            },
                            children: [],
                        },
                    ],
                },
            ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Parent',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'Child',
                        attributes: {
                            hasParent: true,
                            [field]: value,
                        },
                        children: [],
                    },
                ],
            },
        ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Parent',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'Child',
                        attributes: {
                            hasParent: true,
                            title: 'Child Title',
                            description: 'Child Description',
                            detail1: 'Detail 1',
                            detail2: 'Detail 2',
                            detail3: 'Detail 3',
                        },
                        children: [],
                    },
                ],
            },
        ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Parent',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'Child',
                        attributes: {
                            hasParent: true,
                            title: 99,
                            description: 200,
                        },
                        children: [],
                    },
                ],
            },
        ]);
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

            expect(result.current).toStrictEqual([
                {
                    name: 'Parent',
                    attributes: {
                        hasParent: false,
                    },
                    children: [
                        {
                            name: 'Child',
                            attributes: {
                                hasParent: true,
                            },
                            children: [],
                        },
                    ],
                },
            ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Parent',
                attributes: {
                    hasParent: false,
                    title: 'Parent Title',
                    description: 'Parent Description',
                },
                children: [
                    {
                        name: 'Child',
                        attributes: {
                            hasParent: true,
                            title: 'Child Title',
                            description: 'Child Description',
                        },
                        children: [],
                    },
                ],
            },
        ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Parent',
                attributes: {
                    hasParent: false,
                    title: 'Parent Title',
                },
                children: [
                    {
                        name: 'Child',
                        attributes: {
                            hasParent: true,
                            detail1: 'Child Detail',
                        },
                        children: [],
                    },
                ],
            },
        ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Root',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'Middle',
                        attributes: {
                            hasParent: true,
                            title: 'Middle as Source',
                        },
                        children: [
                            {
                                name: 'Child',
                                attributes: {
                                    hasParent: true,
                                },
                                children: [],
                            },
                        ],
                    },
                ],
            },
        ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Parent',
                attributes: {
                    hasParent: false,
                    title: 'Second Occurrence',
                },
                children: [
                    {
                        name: 'Child1',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                    {
                        name: 'Child2',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                ],
            },
        ]);
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

        const firstTree = result.current;
        rerender();
        const secondTree = result.current;

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

        const firstTree = result.current;

        const newData: Datum[] = [
            {
                source: 'Parent2',
                target: 'Child2',
            },
        ];

        rerender({ data: newData });
        const secondTree = result.current;

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

        expect(result.current).toStrictEqual([
            {
                name: 'Company',
                attributes: {
                    hasParent: false,
                    title: 'Tech Corp',
                    description: 'A technology company',
                },
                children: [
                    {
                        name: 'Department A',
                        attributes: {
                            hasParent: true,
                            title: 'Engineering',
                            detail1: 'R&D',
                        },
                        children: [
                            {
                                name: 'Team 1',
                                attributes: {
                                    hasParent: true,
                                    title: 'Backend Team',
                                },
                                children: [],
                            },
                            {
                                name: 'Team 2',
                                attributes: {
                                    hasParent: true,
                                    title: 'Frontend Team',
                                },
                                children: [],
                            },
                        ],
                    },
                    {
                        name: 'Department B',
                        attributes: {
                            hasParent: true,
                            title: 'Sales',
                        },
                        children: [],
                    },
                ],
            },
        ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Parent',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'Child',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                ],
            },
        ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Root1',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'Middle',
                        attributes: {
                            hasParent: true,
                        },
                        children: [
                            {
                                name: 'Leaf',
                                attributes: {
                                    hasParent: true,
                                },
                                children: [],
                            },
                        ],
                    },
                ],
            },
            {
                name: 'Root2',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'Middle',
                        attributes: {
                            hasParent: true,
                        },
                        children: [
                            {
                                name: 'Leaf',
                                attributes: {
                                    hasParent: true,
                                },
                                children: [],
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    it('should handle nodes with the same source and target', () => {
        const data: Datum[] = [
            {
                source: 'Node',
                target: 'Node',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current).toHaveLength(0);
    });

    it('should handle empty string as source or target', () => {
        const data: Datum[] = [
            {
                source: '',
                target: 'Child',
            },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current).toStrictEqual([
            {
                name: '',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'Child',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                ],
            },
        ]);
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

        expect(result.current).toStrictEqual([
            {
                name: 'Parent (Main)',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'Child #1',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                    {
                        name: 'Child @2',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                ],
            },
        ]);
    });

    it('should preserve node order based on data order', () => {
        const data: Datum[] = [
            { source: 'P', target: 'C3' },
            { source: 'P', target: 'C1' },
            { source: 'P', target: 'C2' },
        ];

        const { result } = renderHook(() => useFormatTreeData({ data }));

        expect(result.current).toStrictEqual([
            {
                name: 'P',
                attributes: {
                    hasParent: false,
                },
                children: [
                    {
                        name: 'C3',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                    {
                        name: 'C1',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                    {
                        name: 'C2',
                        attributes: {
                            hasParent: true,
                        },
                        children: [],
                    },
                ],
            },
        ]);
    });
});
