import type { TreeNodeDatum } from 'react-d3-tree';
import { walkNodes } from './useHierarchicalTreeController';

describe('walkNodes', () => {
    it.each([
        {
            description: 'single root node',
            tree: [
                {
                    name: 'Root',
                    attributes: { hasParent: false },
                },
            ],
            expectedCount: 1,
            expectedNames: ['Root'],
        },
        {
            description: 'multiple root nodes',
            tree: [
                {
                    name: 'Root1',
                    attributes: { hasParent: false },
                },
                {
                    name: 'Root2',
                    attributes: { hasParent: false },
                },
            ],
            expectedCount: 2,
            expectedNames: ['Root1', 'Root2'],
        },
        {
            description: 'parent and children nodes',
            tree: [
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
            expectedCount: 3,
            expectedNames: ['Parent', 'Child1', 'Child2'],
        },
        {
            description: 'deeply nested nodes',
            tree: [
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
                                            attributes: { hasParent: true },
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
            tree: [],
            expectedCount: 0,
        },
        {
            description: 'node without children property',
            tree: [
                {
                    name: 'Root',
                    attributes: { hasParent: false },
                },
            ],
            expectedCount: 1,
        },
        {
            description: 'node with empty children array',
            tree: [
                {
                    name: 'Root',
                    attributes: { hasParent: false },
                    children: [],
                },
            ],
            expectedCount: 1,
        },
        {
            description: 'promise resolution after all nodes processed',
            tree: [
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
            expectedCount: 2,
        },
    ])('should handle $description', async ({ tree, expectedCount }) => {
        const action = jest.fn();

        await walkNodes(tree as unknown as TreeNodeDatum[], action);

        expect(action).toHaveBeenCalledTimes(expectedCount);
    });
});
