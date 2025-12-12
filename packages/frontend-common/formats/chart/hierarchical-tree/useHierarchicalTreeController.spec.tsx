import type { TreeNodeDatum } from 'react-d3-tree';
import {
    walkNodes,
    getNodeAncestorById,
    openPath,
    getNodeOptions,
} from './useHierarchicalTreeController';

const mockSelectOne = jest.fn();

jest.mock('../../../search/useSearchPaneContext', () => ({
    useSearchPaneContextOrDefault: jest.fn(() => ({
        filters: [],
        selectOne: mockSelectOne,
    })),
}));

describe('useHierarchicalTreeController', () => {
    describe('walkNodes', () => {
        it('should call action for each node in the tree sequentially depth by depth', async () => {
            const tree: TreeNodeDatum[] = [
                {
                    name: 'Root',
                    __rd3t: { id: '0' },
                    children: [
                        {
                            name: 'Child1',
                            __rd3t: { id: '1' },
                            children: [
                                {
                                    name: 'GrandChild1',
                                    __rd3t: { id: '2' },
                                },
                                {
                                    name: 'GrandChild2',
                                    __rd3t: { id: '3' },
                                },
                            ],
                        },
                        {
                            name: 'Child2',
                            __rd3t: { id: '4' },
                            children: [
                                {
                                    name: 'GrandChild3',
                                    __rd3t: { id: '4' },
                                },
                                {
                                    name: 'GrandChild4',
                                    __rd3t: { id: '5' },
                                },
                            ],
                        },
                    ],
                },
            ] as unknown as TreeNodeDatum[];

            const action = jest.fn();
            await walkNodes(tree, action);

            expect(action).toHaveBeenCalledTimes(7);
            expect(action).toHaveBeenNthCalledWith(1, tree[0]);
            expect(action).toHaveBeenNthCalledWith(2, tree[0].children![0]);
            expect(action).toHaveBeenNthCalledWith(3, tree[0].children![1]);
            expect(action).toHaveBeenNthCalledWith(
                4,
                tree[0].children![0].children![0],
            );
            expect(action).toHaveBeenNthCalledWith(
                5,
                tree[0].children![0].children![1],
            );
            expect(action).toHaveBeenNthCalledWith(
                6,
                tree[0].children![1].children![0],
            );
            expect(action).toHaveBeenNthCalledWith(
                7,
                tree[0].children![1].children![1],
            );
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
        it('should return all tree nodes as select options ordered by label using attributes.title when available', () => {
            const tree: TreeNodeDatum[] = [
                {
                    name: 'Root',
                    __rd3t: { id: '0' },
                    children: [
                        {
                            name: 'uid:/1234',
                            attributes: { hasParent: false, title: 'Child1' },
                            __rd3t: { id: '1' },
                        },
                        {
                            name: 'Child2',
                            attributes: { hasParent: true },
                            __rd3t: { id: '2' },
                            children: [
                                {
                                    name: 'uid:/7894',
                                    attributes: {
                                        hasParent: true,
                                        title: 'GrandChild1',
                                    },
                                    __rd3t: { id: '3' },
                                },
                            ],
                        },
                    ],
                },
            ] as unknown as TreeNodeDatum[];
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
