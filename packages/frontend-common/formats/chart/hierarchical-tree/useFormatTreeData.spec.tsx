import { renderHook } from '@testing-library/react';
import type { Datum } from './type';
import {
    bindAttributes,
    useFormatTreeData,
    type SortBy,
} from './useFormatTreeData';

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
    it('should return root with no children for empty data', () => {
        const { result } = renderHook(() =>
            useFormatTreeData({ data: [], rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [],
        });
    });

    it('should create a simple parent-child relationship', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
            },
        ];

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'Child',
                            children: [],
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                        },
                    ],
                },
            ],
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'Child1',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                        {
                            name: 'Child2',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                        {
                            name: 'Child3',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                    ],
                },
            ],
        });
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Root1',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'Child1',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                    ],
                },
                {
                    name: 'Root2',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'Child2',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                    ],
                },
            ],
        });
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Root',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'Level1',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [
                                {
                                    name: 'Level2',
                                    attributes: {
                                        hasParent: true,
                                        weight: 1,
                                        weightPercent: 100,
                                    },
                                    children: [
                                        {
                                            name: 'Level3',
                                            attributes: {
                                                hasParent: true,
                                                weight: 1,
                                                weightPercent: 100,
                                            },
                                            children: [],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,

                        [field]: value,
                    },
                    children: [
                        {
                            name: 'Child',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                    ],
                },
            ],
        });
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,

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
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                    ],
                },
            ],
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,

                        title: 42,
                        detail1: 100,
                    },
                    children: [
                        {
                            name: 'Child',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                    ],
                },
            ],
        });
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

            const { result } = renderHook(() =>
                useFormatTreeData({ data, rootName: 'root' }),
            );

            expect(result.current).toStrictEqual({
                name: 'root',
                children: [
                    {
                        name: 'Parent',
                        attributes: {
                            hasParent: false,
                            weight: 1,
                            weightPercent: 100,
                        },
                        children: [
                            {
                                name: 'Child',
                                attributes: {
                                    hasParent: true,
                                    weight: 1,
                                    weightPercent: 100,
                                },
                                children: [],
                            },
                        ],
                    },
                ],
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'Child',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,

                                [field]: value,
                            },
                            children: [],
                        },
                    ],
                },
            ],
        });
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'Child',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,

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
            ],
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'Child',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,

                                title: 99,
                                description: 200,
                            },
                            children: [],
                        },
                    ],
                },
            ],
        });
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

            const { result } = renderHook(() =>
                useFormatTreeData({ data, rootName: 'root' }),
            );

            expect(result.current).toStrictEqual({
                name: 'root',
                children: [
                    {
                        name: 'Parent',
                        attributes: {
                            hasParent: false,
                            weight: 1,
                            weightPercent: 100,
                        },
                        children: [
                            {
                                name: 'Child',
                                attributes: {
                                    hasParent: true,
                                    weight: 1,
                                    weightPercent: 100,
                                },
                                children: [],
                            },
                        ],
                    },
                ],
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,

                        title: 'Parent Title',
                        description: 'Parent Description',
                    },
                    children: [
                        {
                            name: 'Child',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,

                                title: 'Child Title',
                                description: 'Child Description',
                            },
                            children: [],
                        },
                    ],
                },
            ],
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,

                        title: 'Parent Title',
                    },
                    children: [
                        {
                            name: 'Child',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,

                                detail1: 'Child Detail',
                            },
                            children: [],
                        },
                    ],
                },
            ],
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Root',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'Middle',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,

                                title: 'Middle as Source',
                            },
                            children: [
                                {
                                    name: 'Child',
                                    attributes: {
                                        hasParent: true,
                                        weight: 1,
                                        weightPercent: 100,
                                    },
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,

                        title: 'Second Occurrence',
                    },
                    children: [
                        {
                            name: 'Child1',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                        {
                            name: 'Child2',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                    ],
                },
            ],
        });
    });

    it('should return the same tree reference when data does not change', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
            },
        ];

        const { result, rerender } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
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
            ({ data }) => useFormatTreeData({ data, rootName: 'root' }),
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
        expect(firstTree).toStrictEqual({
            name: 'root',
            children: [expect.objectContaining({ name: 'Parent1' })],
        });
        expect(secondTree).toStrictEqual({
            name: 'root',
            children: [expect.objectContaining({ name: 'Parent2' })],
        });
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Company',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,

                        title: 'Tech Corp',
                        description: 'A technology company',
                    },
                    children: [
                        {
                            name: 'Department A',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,

                                title: 'Engineering',
                                detail1: 'R&D',
                            },
                            children: [
                                {
                                    name: 'Team 1',
                                    attributes: {
                                        hasParent: true,
                                        weight: 1,
                                        weightPercent: 100,

                                        title: 'Backend Team',
                                    },
                                    children: [],
                                },
                                {
                                    name: 'Team 2',
                                    attributes: {
                                        hasParent: true,
                                        weight: 1,
                                        weightPercent: 100,

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
                                weight: 1,
                                weightPercent: 100,

                                title: 'Sales',
                            },
                            children: [],
                        },
                    ],
                },
            ],
        });
    });

    it('should handle weight attribute without affecting tree structure', () => {
        const data: Datum[] = [
            {
                source: 'Parent',
                target: 'Child',
                weight: 100,
            },
        ];

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: {
                        hasParent: false,
                        weight: 100,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'Child',
                            attributes: {
                                hasParent: true,
                                weight: 100,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                    ],
                },
            ],
        });
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Root1',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'Middle',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [
                                {
                                    name: 'Leaf',
                                    attributes: {
                                        hasParent: true,
                                        weight: 1,
                                        weightPercent: 100,
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
                        weight: 1,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'Middle',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [
                                {
                                    name: 'Leaf',
                                    attributes: {
                                        hasParent: true,
                                        weight: 1,
                                        weightPercent: 100,
                                    },
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });

    it('should handle nodes with the same source and target', () => {
        const data: Datum[] = [
            {
                source: 'Node',
                target: 'Node',
            },
        ];

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [],
        });
    });

    it('should handle empty string as source or target', () => {
        const data: Datum[] = [
            {
                source: '',
                target: 'Child',
            },
        ];

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: '',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'Child',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                    ],
                },
            ],
        });
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

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent (Main)',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'Child @2',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                        {
                            name: 'Child #1',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                    ],
                },
            ],
        });
    });

    it('should sort children alphabetically by default', () => {
        const data: Datum[] = [
            { source: 'P', target: 'C3' },
            { source: 'P', target: 'C1' },
            { source: 'P', target: 'C2' },
        ];

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'P',
                    attributes: {
                        hasParent: false,
                        weight: 1,
                        weightPercent: 100,
                    },
                    children: [
                        {
                            name: 'C1',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                        {
                            name: 'C2',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                        {
                            name: 'C3',
                            attributes: {
                                hasParent: true,
                                weight: 1,
                                weightPercent: 100,
                            },
                            children: [],
                        },
                    ],
                },
            ],
        });
    });

    it.each([
        {
            description: 'when all nodes have the same weight',
            data: [
                { source: 'Parent', target: 'Child1', weight: 5 },
                { source: 'Parent', target: 'Child2', weight: 5 },
                { source: 'Parent', target: 'Child3', weight: 5 },
            ] as Datum[],
            expected: {
                name: 'root',
                children: [
                    {
                        name: 'Parent',
                        attributes: {
                            hasParent: false,
                            weight: 5,
                            weightPercent: 100,
                        },
                        children: [
                            {
                                name: 'Child1',
                                attributes: {
                                    hasParent: true,
                                    weight: 5,
                                    weightPercent: 100,
                                },
                                children: [],
                            },
                            {
                                name: 'Child2',
                                attributes: {
                                    hasParent: true,
                                    weight: 5,
                                    weightPercent: 100,
                                },
                                children: [],
                            },
                            {
                                name: 'Child3',
                                attributes: {
                                    hasParent: true,
                                    weight: 5,
                                    weightPercent: 100,
                                },
                                children: [],
                            },
                        ],
                    },
                ],
            },
        },
        {
            description:
                'based on min/max when children have different weights',
            data: [
                { source: 'Parent', target: 'Child1', weight: 10 },
                { source: 'Parent', target: 'Child2', weight: 50 },
                { source: 'Parent', target: 'Child3', weight: 100 },
            ] as Datum[],
            expected: {
                name: 'root',
                children: [
                    {
                        name: 'Parent',
                        attributes: {
                            hasParent: false,
                            weight: 10,
                            weightPercent: 0,
                        },
                        children: [
                            {
                                name: 'Child1',
                                attributes: {
                                    hasParent: true,
                                    weight: 10,
                                    weightPercent: 0,
                                },
                                children: [],
                            },
                            {
                                name: 'Child2',
                                attributes: {
                                    hasParent: true,
                                    weight: 50,
                                    weightPercent: 40 / 90,
                                },
                                children: [],
                            },
                            {
                                name: 'Child3',
                                attributes: {
                                    hasParent: true,
                                    weight: 100,
                                    weightPercent: 1,
                                },
                                children: [],
                            },
                        ],
                    },
                ],
            },
        },
        {
            description: 'with weight range from 1 to 10',
            data: [
                { source: 'Root', target: 'A', weight: 1 },
                { source: 'Root', target: 'B', weight: 5 },
                { source: 'Root', target: 'C', weight: 10 },
            ] as Datum[],
            expected: {
                name: 'root',
                children: [
                    {
                        name: 'Root',
                        attributes: {
                            hasParent: false,
                            weight: 1,
                            weightPercent: 0,
                        },
                        children: [
                            {
                                name: 'A',
                                attributes: {
                                    hasParent: true,
                                    weight: 1,
                                    weightPercent: 0,
                                },
                                children: [],
                            },
                            {
                                name: 'B',
                                attributes: {
                                    hasParent: true,
                                    weight: 5,
                                    weightPercent: 4 / 9,
                                },
                                children: [],
                            },
                            {
                                name: 'C',
                                attributes: {
                                    hasParent: true,
                                    weight: 10,
                                    weightPercent: 1,
                                },
                                children: [],
                            },
                        ],
                    },
                ],
            },
        },
    ])('should calculate weightPercent $description', ({ data, expected }) => {
        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual(expected);
    });

    it('should calculate weightPercent across multiple parent nodes', () => {
        const data: Datum[] = [
            { source: 'Parent1', target: 'Child1', weight: 20 },
            { source: 'Parent2', target: 'Child2', weight: 60 },
            { source: 'Parent3', target: 'Child3', weight: 100 },
        ];

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent1',
                    attributes: {
                        hasParent: false,
                        weight: 20,
                        weightPercent: 0,
                    },
                    children: [
                        {
                            name: 'Child1',
                            attributes: {
                                hasParent: true,
                                weight: 20,
                                weightPercent: 0,
                            },
                            children: [],
                        },
                    ],
                },
                {
                    name: 'Parent2',
                    attributes: {
                        hasParent: false,
                        weight: 60,
                        weightPercent: 0.5,
                    },
                    children: [
                        {
                            name: 'Child2',
                            attributes: {
                                hasParent: true,
                                weight: 60,
                                weightPercent: 0.5,
                            },
                            children: [],
                        },
                    ],
                },
                {
                    name: 'Parent3',
                    attributes: {
                        hasParent: false,
                        weight: 100,
                        weightPercent: 1,
                    },
                    children: [
                        {
                            name: 'Child3',
                            attributes: {
                                hasParent: true,
                                weight: 100,
                                weightPercent: 1,
                            },
                            children: [],
                        },
                    ],
                },
            ],
        });
    });

    it('should calculate weightPercent in multi-level hierarchies with different weights', () => {
        const data: Datum[] = [
            { source: 'Root', target: 'Level1A', weight: 100 },
            { source: 'Level1A', target: 'Level2A', weight: 200 },
            { source: 'Root', target: 'Level1B', weight: 300 },
        ];

        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Root',
                    attributes: {
                        hasParent: false,
                        weight: 100,
                        weightPercent: 0,
                    },
                    children: [
                        {
                            name: 'Level1A',
                            attributes: {
                                hasParent: true,
                                weight: 100,
                                weightPercent: 0,
                            },
                            children: [
                                {
                                    name: 'Level2A',
                                    attributes: {
                                        hasParent: true,
                                        weight: 200,
                                        weightPercent: 0.5,
                                    },
                                    children: [],
                                },
                            ],
                        },
                        {
                            name: 'Level1B',
                            attributes: {
                                hasParent: true,
                                weight: 300,
                                weightPercent: 1,
                            },
                            children: [],
                        },
                    ],
                },
            ],
        });
    });

    it.each([
        {
            description: 'with decimal weights',
            data: [
                { source: 'Parent', target: 'Child1', weight: 1.5 },
                { source: 'Parent', target: 'Child2', weight: 2.25 },
                { source: 'Parent', target: 'Child3', weight: 3.0 },
            ] as Datum[],
            expected: {
                name: 'root',
                children: [
                    {
                        name: 'Parent',
                        attributes: {
                            hasParent: false,
                            weight: 1.5,
                            weightPercent: 0,
                        },
                        children: [
                            {
                                name: 'Child1',
                                attributes: {
                                    hasParent: true,
                                    weight: 1.5,
                                    weightPercent: 0,
                                },
                                children: [],
                            },
                            {
                                name: 'Child2',
                                attributes: {
                                    hasParent: true,
                                    weight: 2.25,
                                    weightPercent: 0.5,
                                },
                                children: [],
                            },
                            {
                                name: 'Child3',
                                attributes: {
                                    hasParent: true,
                                    weight: 3.0,
                                    weightPercent: 1,
                                },
                                children: [],
                            },
                        ],
                    },
                ],
            },
        },
        {
            description: 'with default weight of 1 when weight is undefined',
            data: [
                { source: 'Parent', target: 'Child1' },
                { source: 'Parent', target: 'Child2', weight: 50 },
                { source: 'Parent', target: 'Child3', weight: 100 },
            ] as Datum[],
            expected: {
                name: 'root',
                children: [
                    {
                        name: 'Parent',
                        attributes: {
                            hasParent: false,
                            weight: 1,
                            weightPercent: 0,
                        },
                        children: [
                            {
                                name: 'Child1',
                                attributes: {
                                    hasParent: true,
                                    weight: 1,
                                    weightPercent: 0,
                                },
                                children: [],
                            },
                            {
                                name: 'Child2',
                                attributes: {
                                    hasParent: true,
                                    weight: 50,
                                    weightPercent: 49 / 99,
                                },
                                children: [],
                            },
                            {
                                name: 'Child3',
                                attributes: {
                                    hasParent: true,
                                    weight: 100,
                                    weightPercent: 1,
                                },
                                children: [],
                            },
                        ],
                    },
                ],
            },
        },
        {
            description: 'with negative weights',
            data: [
                { source: 'Parent', target: 'Child1', weight: -10 },
                { source: 'Parent', target: 'Child2', weight: 0 },
                { source: 'Parent', target: 'Child3', weight: 10 },
            ] as Datum[],
            expected: {
                name: 'root',
                children: [
                    {
                        name: 'Parent',
                        attributes: {
                            hasParent: false,
                            weight: -10,
                            weightPercent: 0,
                        },
                        children: [
                            {
                                name: 'Child1',
                                attributes: {
                                    hasParent: true,
                                    weight: -10,
                                    weightPercent: 0,
                                },
                                children: [],
                            },
                            {
                                name: 'Child2',
                                attributes: {
                                    hasParent: true,
                                    weight: 0,
                                    weightPercent: 0.5,
                                },
                                children: [],
                            },
                            {
                                name: 'Child3',
                                attributes: {
                                    hasParent: true,
                                    weight: 10,
                                    weightPercent: 1,
                                },
                                children: [],
                            },
                        ],
                    },
                ],
            },
        },
    ])('should handle weightPercent $description', ({ data, expected }) => {
        const { result } = renderHook(() =>
            useFormatTreeData({ data, rootName: 'root' }),
        );

        expect(result.current).toStrictEqual(expected);
    });

    it.each([
        {
            description: 'by label in ascending order by default',
            data: [
                { source: 'Parent', target: 'Zebra' },
                { source: 'Parent', target: 'Apple' },
                { source: 'Parent', target: 'Mango' },
            ] as Datum[],
            sortBy: undefined,
            expected: ['Apple', 'Mango', 'Zebra'],
        },
        {
            description: 'by label in ascending order when sortBy is label/asc',
            data: [
                { source: 'Parent', target: 'Charlie' },
                { source: 'Parent', target: 'Alpha' },
                { source: 'Parent', target: 'Bravo' },
            ] as Datum[],
            sortBy: { kind: 'label' as const, direction: 'asc' as const },
            expected: ['Alpha', 'Bravo', 'Charlie'],
        },
        {
            description:
                'by label in descending order when sortBy is label/desc',
            data: [
                { source: 'Parent', target: 'Charlie' },
                { source: 'Parent', target: 'Alpha' },
                { source: 'Parent', target: 'Bravo' },
            ] as Datum[],
            sortBy: { kind: 'label' as const, direction: 'desc' as const },
            expected: ['Charlie', 'Bravo', 'Alpha'],
        },
        {
            description: 'by value in ascending order when sortBy is value/asc',
            data: [
                { source: 'Parent', target: 'Heavy', weight: 100 },
                { source: 'Parent', target: 'Light', weight: 10 },
                { source: 'Parent', target: 'Medium', weight: 50 },
            ] as Datum[],
            sortBy: { kind: 'value' as const, direction: 'asc' as const },
            expected: ['Light', 'Medium', 'Heavy'],
        },
        {
            description:
                'by value in descending order when sortBy is value/desc',
            data: [
                { source: 'Parent', target: 'Heavy', weight: 100 },
                { source: 'Parent', target: 'Light', weight: 10 },
                { source: 'Parent', target: 'Medium', weight: 50 },
            ] as Datum[],
            sortBy: { kind: 'value' as const, direction: 'desc' as const },
            expected: ['Heavy', 'Medium', 'Light'],
        },
        {
            description: 'with undefined weights using default value of 1',
            data: [
                { source: 'Parent', target: 'WithWeight', weight: 50 },
                { source: 'Parent', target: 'NoWeight' },
                { source: 'Parent', target: 'AnotherWeight', weight: 10 },
            ] as Datum[],
            sortBy: { kind: 'value' as const, direction: 'asc' as const },
            expected: ['NoWeight', 'AnotherWeight', 'WithWeight'],
        },
        {
            description: 'with negative weights correctly',
            data: [
                { source: 'Parent', target: 'Positive', weight: 10 },
                { source: 'Parent', target: 'Negative', weight: -10 },
                { source: 'Parent', target: 'Zero', weight: 0 },
            ] as Datum[],
            sortBy: { kind: 'value' as const, direction: 'asc' as const },
            expected: ['Negative', 'Zero', 'Positive'],
        },
    ])('should sort children $description', ({ data, sortBy, expected }) => {
        const { result } = renderHook(() =>
            useFormatTreeData({
                data,
                rootName: 'root',
                sortBy,
            }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: expect.objectContaining({
                        hasParent: false,
                    }),
                    children: expected.map((name) => ({
                        name,
                        attributes: expect.objectContaining({
                            hasParent: true,
                        }),
                        children: [],
                    })),
                },
            ],
        });
    });

    it('should sort at multiple levels of hierarchy', () => {
        const data: Datum[] = [
            { source: 'Root', target: 'B', weight: 2 },
            { source: 'Root', target: 'A', weight: 1 },
            { source: 'A', target: 'A2', weight: 20 },
            { source: 'A', target: 'A1', weight: 10 },
            { source: 'B', target: 'B2', weight: 200 },
            { source: 'B', target: 'B1', weight: 100 },
        ];

        const { result } = renderHook(() =>
            useFormatTreeData({
                data,
                rootName: 'root',
                sortBy: { kind: 'value', direction: 'asc' },
            }),
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Root',
                    attributes: expect.objectContaining({
                        hasParent: false,
                        weight: 2,
                    }),
                    children: [
                        {
                            name: 'A',
                            attributes: expect.objectContaining({
                                hasParent: true,
                                weight: 1,
                            }),
                            children: [
                                {
                                    name: 'A1',
                                    attributes: expect.objectContaining({
                                        hasParent: true,
                                        weight: 10,
                                    }),
                                    children: [],
                                },
                                {
                                    name: 'A2',
                                    attributes: expect.objectContaining({
                                        hasParent: true,
                                        weight: 20,
                                    }),
                                    children: [],
                                },
                            ],
                        },
                        {
                            name: 'B',
                            attributes: expect.objectContaining({
                                hasParent: true,
                                weight: 2,
                            }),
                            children: [
                                {
                                    name: 'B1',
                                    attributes: expect.objectContaining({
                                        hasParent: true,
                                        weight: 100,
                                    }),
                                    children: [],
                                },
                                {
                                    name: 'B2',
                                    attributes: expect.objectContaining({
                                        hasParent: true,
                                        weight: 200,
                                    }),
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });

    it('should handle special characters in labels when sorting', () => {
        const data: Datum[] = [
            { source: 'Parent', target: 'Item #3' },
            { source: 'Parent', target: 'Item @1' },
            { source: 'Parent', target: 'Item (2)' },
        ];

        const { result } = renderHook(() =>
            useFormatTreeData({
                data,
                rootName: 'root',
                sortBy: { kind: 'label', direction: 'asc' },
            }),
        );

        const childNames = result.current.children[0].children?.map(
            (c) => c.name,
        );
        expect(childNames?.length).toBe(3);
        expect(childNames).toContain('Item #3');
        expect(childNames).toContain('Item @1');
        expect(childNames).toContain('Item (2)');
    });

    it('should maintain sort order across re-renders with same data', () => {
        const data: Datum[] = [
            { source: 'Parent', target: 'C', weight: 3 },
            { source: 'Parent', target: 'A', weight: 1 },
            { source: 'Parent', target: 'B', weight: 2 },
        ];

        const { result, rerender } = renderHook(() =>
            useFormatTreeData({
                data,
                rootName: 'root',
                sortBy: { kind: 'value', direction: 'asc' },
            }),
        );

        const expectedTree = {
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: expect.objectContaining({ hasParent: false }),
                    children: [
                        {
                            name: 'A',
                            attributes: expect.objectContaining({
                                hasParent: true,
                                weight: 1,
                            }),
                            children: [],
                        },
                        {
                            name: 'B',
                            attributes: expect.objectContaining({
                                hasParent: true,
                                weight: 2,
                            }),
                            children: [],
                        },
                        {
                            name: 'C',
                            attributes: expect.objectContaining({
                                hasParent: true,
                                weight: 3,
                            }),
                            children: [],
                        },
                    ],
                },
            ],
        };

        expect(result.current).toStrictEqual(expectedTree);
        rerender();
        expect(result.current).toStrictEqual(expectedTree);
    });

    it('should update sort when sortBy changes', () => {
        const data: Datum[] = [
            { source: 'Parent', target: 'Zebra', weight: 1 },
            { source: 'Parent', target: 'Apple', weight: 3 },
            { source: 'Parent', target: 'Mango', weight: 2 },
        ];

        const { result, rerender } = renderHook(
            ({
                sortBy,
            }: {
                sortBy?: { kind: 'label' | 'value'; direction: 'asc' | 'desc' };
            }) =>
                useFormatTreeData({
                    data,
                    rootName: 'root',
                    sortBy,
                }),
            {
                initialProps: {
                    sortBy: {
                        kind: 'label',
                        direction: 'asc',
                    } as SortBy,
                },
            },
        );

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: expect.objectContaining({ hasParent: false }),
                    children: [
                        {
                            name: 'Apple',
                            attributes: expect.objectContaining({
                                hasParent: true,
                                weight: 3,
                            }),
                            children: [],
                        },
                        {
                            name: 'Mango',
                            attributes: expect.objectContaining({
                                hasParent: true,
                                weight: 2,
                            }),
                            children: [],
                        },
                        {
                            name: 'Zebra',
                            attributes: expect.objectContaining({
                                hasParent: true,
                                weight: 1,
                            }),
                            children: [],
                        },
                    ],
                },
            ],
        });

        rerender({ sortBy: { kind: 'value', direction: 'asc' } });

        expect(result.current).toStrictEqual({
            name: 'root',
            children: [
                {
                    name: 'Parent',
                    attributes: expect.objectContaining({ hasParent: false }),
                    children: [
                        {
                            name: 'Zebra',
                            attributes: expect.objectContaining({
                                hasParent: true,
                                weight: 1,
                            }),
                            children: [],
                        },
                        {
                            name: 'Mango',
                            attributes: expect.objectContaining({
                                hasParent: true,
                                weight: 2,
                            }),
                            children: [],
                        },
                        {
                            name: 'Apple',
                            attributes: expect.objectContaining({
                                hasParent: true,
                                weight: 3,
                            }),
                            children: [],
                        },
                    ],
                },
            ],
        });
    });
});
