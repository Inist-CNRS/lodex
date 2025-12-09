import type { TreeNodeDatum } from 'react-d3-tree';
import {
    walkNodes,
    getNodeAncestorById,
    openPath,
    getNodeOptions,
} from './useHierarchicalTreeController';

describe('useHierarchicalTreeController', () => {
    describe('walkNodes', () => {
        it.each([
            {
                description: 'single root node',
                tree: [
                    {
                        name: '__root__',
                        children: [
                            {
                                name: 'Root',
                                attributes: { hasParent: false },
                            },
                        ],
                    },
                ],
                expectedCount: 1,
                expectedNames: ['Root'],
            },
            {
                description: 'multiple root nodes',
                tree: [
                    {
                        name: '__root__',
                        children: [
                            {
                                name: 'Root1',
                                attributes: { hasParent: false },
                            },
                            {
                                name: 'Root2',
                                attributes: { hasParent: false },
                            },
                        ],
                    },
                ],
                expectedCount: 2,
                expectedNames: ['Root1', 'Root2'],
            },
            {
                description: 'parent and children nodes',
                tree: [
                    {
                        name: '__root__',
                        children: [
                            {
                                name: 'Parent',
                                attributes: { hasParent: false },
                                children: [
                                    {
                                        name: 'Child1',
                                        attributes: { hasParent: true },
                                    },
                                    {
                                        name: 'Child2',
                                        attributes: { hasParent: true },
                                    },
                                ],
                            },
                        ],
                    },
                ],
                expectedCount: 3,
                expectedNames: ['Parent', 'Child1', 'Child2'],
            },
            {
                description: 'deeply nested nodes',
                tree: [
                    {
                        name: '__root__',
                        children: [
                            {
                                name: 'Root',
                                attributes: { hasParent: false },
                                children: [
                                    {
                                        name: 'Level1',
                                        attributes: { hasParent: true },
                                        children: [
                                            {
                                                name: 'Level2',
                                                attributes: { hasParent: true },
                                                children: [
                                                    {
                                                        name: 'Level3',
                                                        attributes: {
                                                            hasParent: true,
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                expectedCount: 4,
                expectedNames: ['Root', 'Level1', 'Level2', 'Level3'],
            },
            {
                description: 'complex tree with multiple branches',
                tree: [
                    {
                        name: '__root__',
                        children: [
                            {
                                name: 'Root1',
                                attributes: { hasParent: false },
                                children: [
                                    {
                                        name: 'Root1-Child1',
                                        attributes: { hasParent: true },
                                    },
                                    {
                                        name: 'Root1-Child2',
                                        attributes: { hasParent: true },
                                    },
                                ],
                            },
                            {
                                name: 'Root2',
                                attributes: { hasParent: false },
                                children: [
                                    {
                                        name: 'Root2-Child1',
                                        attributes: { hasParent: true },
                                    },
                                ],
                            },
                        ],
                    },
                ],
                expectedCount: 5,
                expectedNames: [
                    'Root1',
                    'Root2',
                    'Root1-Child1',
                    'Root1-Child2',
                    'Root2-Child1',
                ],
            },
        ])(
            'should call action for $description',
            async ({ tree, expectedCount, expectedNames }) => {
                const action = jest.fn();

                await walkNodes(tree as unknown as TreeNodeDatum[], action);

                expect(action).toHaveBeenCalledTimes(expectedCount);
                expect(action.mock.calls.map((call) => call[0].name)).toEqual(
                    expectedNames,
                );
            },
        );

        it('should walk nodes in breadth-first order', async () => {
            const action = jest.fn();
            const tree = [
                {
                    name: '__root__',
                    children: [
                        {
                            name: 'Root',
                            attributes: { hasParent: false },
                            children: [
                                {
                                    name: 'Child1',
                                    attributes: { hasParent: true },
                                    children: [
                                        {
                                            name: 'Grandchild1',
                                            attributes: { hasParent: true },
                                        },
                                    ],
                                },
                                {
                                    name: 'Child2',
                                    attributes: { hasParent: true },
                                    children: [
                                        {
                                            name: 'Grandchild2',
                                            attributes: { hasParent: true },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ] as unknown as TreeNodeDatum[];

            await walkNodes(tree, action);

            expect(action).toHaveBeenCalledTimes(5);
            expect(action.mock.calls.map((call) => call[0].name)).toEqual([
                'Root',
                'Child1',
                'Child2',
                'Grandchild1',
                'Grandchild2',
            ]);
        });

        it.each([
            {
                description: 'empty tree array',
                tree: [
                    {
                        name: '__root__',
                        children: [],
                    },
                ],
                expectedCount: 0,
            },
            {
                description: 'node without children property',
                tree: [
                    {
                        name: '__root__',
                        children: [
                            {
                                name: 'Root',
                                attributes: { hasParent: false },
                            },
                        ],
                    },
                ],
                expectedCount: 1,
            },
            {
                description: 'node with empty children array',
                tree: [
                    {
                        name: '__root__',
                        children: [
                            {
                                name: 'Root',
                                attributes: { hasParent: false },
                                children: [],
                            },
                        ],
                    },
                ],
                expectedCount: 1,
            },
            {
                description: 'promise resolution after all nodes processed',
                tree: [
                    {
                        name: '__root__',
                        children: [
                            {
                                name: 'Root',
                                attributes: { hasParent: false },
                                children: [
                                    {
                                        name: 'Child',
                                        attributes: { hasParent: true },
                                    },
                                ],
                            },
                        ],
                    },
                ],
                expectedCount: 2,
            },
        ])('should handle $description', async ({ tree, expectedCount }) => {
            const action = jest.fn();

            await walkNodes(tree as unknown as TreeNodeDatum[], action);

            expect(action).toHaveBeenCalledTimes(expectedCount);
        });
    });

    describe('getNodeAncestorById', () => {
        const tree: TreeNodeDatum[] = [
            {
                name: 'Root',
                __rd3t: { id: '0' },
                children: [
                    {
                        name: 'GrandParent',
                        attributes: { hasParent: false },
                        __rd3t: { id: '1' },
                        children: [
                            {
                                name: 'Parent',
                                attributes: { hasParent: true },
                                __rd3t: { id: '2' },
                                children: [
                                    {
                                        name: 'Child',
                                        attributes: { hasParent: true },
                                        __rd3t: { id: '3' },
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        name: 'Another GrandParent',
                        attributes: { hasParent: false },
                        __rd3t: { id: '4' },
                        children: [
                            {
                                name: 'Another Parent',
                                attributes: { hasParent: true },
                                __rd3t: { id: '5' },
                            },
                        ],
                    },
                ],
            },
        ] as unknown as TreeNodeDatum[];
        it.each([
            ['0', []],
            ['1', [tree[0]]],
            ['2', [tree[0], tree[0].children![0]]],
            [
                '3',
                [
                    tree[0],
                    tree[0].children![0],
                    tree[0].children![0].children![0],
                ],
            ],
            ['4', [tree[0]]],
            ['5', [tree[0], tree[0].children![1]]],
            ['inexisting-id', []],
        ])(
            'should return the ancestor path for a given node ID',
            (id: string, expectedPath: TreeNodeDatum[]) => {
                expect(getNodeAncestorById(tree, id)).toStrictEqual(
                    expectedPath,
                );
            },
        );
    });

    describe('getNodeOptions', () => {
        const tree: TreeNodeDatum[] = [
            {
                name: 'Root',
                __rd3t: { id: '0' },
                children: [
                    {
                        name: 'Child1',
                        attributes: { hasParent: false },
                        __rd3t: { id: '1' },
                    },
                    {
                        name: 'Child2',
                        attributes: { hasParent: true },
                        __rd3t: { id: '2' },
                        children: [
                            {
                                name: 'GrandChild1',
                                attributes: { hasParent: true },
                                __rd3t: { id: '3' },
                            },
                        ],
                    },
                ],
            },
        ] as unknown as TreeNodeDatum[];
        it('should return all tree nodes as select options ordered by label', () => {
            const options = getNodeOptions(tree);
            expect(options).toEqual([
                { value: '1', label: 'Child1' },
                { value: '2', label: 'Child2' },
                { value: '3', label: 'GrandChild1' },
                { value: '0', label: 'Root' },
            ]);
        });

        it('should return an empty array for an empty tree', () => {
            const options = getNodeOptions([]);
            expect(options).toEqual([]);
        });
    });

    describe('openPath', () => {
        it('should call handleToggle with collapsed(true) id in order', async () => {
            const handleNodeToggle = jest.fn();
            const path: TreeNodeDatum[] = [
                {
                    name: 'Root',
                    __rd3t: { id: '0', collapsed: true },
                },
                {
                    name: 'Child',
                    __rd3t: { id: '1', collapsed: false },
                },
                {
                    name: 'GrandChild',
                    __rd3t: { id: '2', collapsed: true },
                },
            ] as unknown as TreeNodeDatum[];

            await openPath(path, handleNodeToggle);

            expect(handleNodeToggle).toHaveBeenNthCalledWith(1, '0');
            expect(handleNodeToggle).toHaveBeenNthCalledWith(2, '2');
        });

        it('should not call handleToggle if all nodes are already open', async () => {
            const handleNodeToggle = jest.fn();
            const path: TreeNodeDatum[] = [
                {
                    name: 'Root',
                    __rd3t: { id: '0', collapsed: false },
                },
                {
                    name: 'Child',
                    __rd3t: { id: '1', collapsed: false },
                },
            ] as unknown as TreeNodeDatum[];

            await openPath(path, handleNodeToggle);

            expect(handleNodeToggle).not.toHaveBeenCalled();
        });

        it('should not call handleToggle if path is empty', async () => {
            const handleNodeToggle = jest.fn();
            const path: TreeNodeDatum[] = [];

            await openPath(path, handleNodeToggle);

            expect(handleNodeToggle).not.toHaveBeenCalled();
        });
    });
});
