import { compareNodes, isLinkVisible } from './NetworkBase';

describe('NetworkView', () => {
    describe('compareNodes', () => {
        it('should subtract a.radius from b.radius when no selectedNode nor hoveredNode', () => {
            const nodeA = { id: '1', radius: 10 };
            const nodeB = { id: '2', radius: 20 };
            expect(
                compareNodes({
                    a: nodeA,
                    b: nodeB,
                    selectedNode: null,
                    hoveredNode: null,
                    highlightedNodeIds: [],
                }),
            ).toBe(-10);
        });

        it('should subtract b.radius from a.radius when a and b are neither selected, highlighted nor hovered', () => {
            const nodeA = { id: '1', radius: 10 };
            const nodeB = { id: '2', radius: 20 };
            const selectedNode = { id: '3', radius: 15 };
            const hoveredNode = { id: '4', radius: 25 };
            const highlightedNodeIds: string[] = ['5', '6', '7', '8'];
            expect(
                compareNodes({
                    a: nodeA,
                    b: nodeB,
                    selectedNode,
                    hoveredNode,
                    highlightedNodeIds,
                }),
            ).toBe(-10);
        });

        it('should return 1 when a is highlighted and b is not', () => {
            const nodeA = { id: '1', radius: 10 };
            const nodeB = { id: '2', radius: 20 };
            const highlightedNodeIds: string[] = ['1'];
            expect(
                compareNodes({
                    a: nodeA,
                    b: nodeB,
                    selectedNode: {
                        id: '3',
                        radius: 15,
                    },
                    hoveredNode: {
                        id: '4',
                        radius: 25,
                    },
                    highlightedNodeIds,
                }),
            ).toBe(1);
        });
        it('should return -1 when b is highlighted and a is not', () => {
            const nodeA = { id: '1', radius: 10 };
            const nodeB = { id: '2', radius: 20 };
            const highlightedNodeIds: string[] = ['2'];
            expect(
                compareNodes({
                    a: nodeA,
                    b: nodeB,
                    selectedNode: {
                        id: '3',
                        radius: 15,
                    },
                    hoveredNode: {
                        id: '4',
                        radius: 25,
                    },
                    highlightedNodeIds,
                }),
            ).toBe(-1);
        });

        it('should return a - b radius when both are highlighted', () => {
            const nodeA = { id: '1', radius: 10 };
            const nodeB = { id: '2', radius: 20 };
            const highlightedNodeIds: string[] = ['1', '2'];
            expect(
                compareNodes({
                    a: nodeA,
                    b: nodeB,
                    selectedNode: {
                        id: '3',
                        radius: 15,
                    },
                    hoveredNode: {
                        id: '4',
                        radius: 25,
                    },
                    highlightedNodeIds,
                }),
            ).toBe(-10);
        });

        it('should -1 when a is selected and b is hovered', () => {
            const nodeA = { id: '1', radius: 10 };
            const nodeB = { id: '2', radius: 20 };
            expect(
                compareNodes({
                    a: nodeA,
                    b: nodeB,
                    selectedNode: nodeA,
                    hoveredNode: nodeB,
                    highlightedNodeIds: [],
                }),
            ).toBe(-1);
        });

        it('should 1 when a is selected and b is not hovered', () => {
            const nodeA = { id: '1', radius: 10 };
            const nodeB = { id: '2', radius: 20 };
            expect(
                compareNodes({
                    a: nodeA,
                    b: nodeB,
                    selectedNode: nodeA,
                    hoveredNode: null,
                    highlightedNodeIds: [],
                }),
            ).toBe(1);
        });

        it('should return 1 when a is selected even if b is highlighted', () => {
            const nodeA = { id: '1', radius: 10 };
            const nodeB = { id: '2', radius: 20 };
            expect(
                compareNodes({
                    a: nodeA,
                    b: nodeB,
                    selectedNode: nodeA,
                    hoveredNode: null,
                    highlightedNodeIds: ['2'],
                }),
            ).toBe(1);
        });

        it('should 1 when b is selected and a is hovered', () => {
            const nodeA = { id: '1', radius: 10 };
            const nodeB = { id: '2', radius: 20 };
            expect(
                compareNodes({
                    a: nodeA,
                    b: nodeB,
                    selectedNode: nodeB,
                    hoveredNode: nodeA,
                    highlightedNodeIds: [],
                }),
            ).toBe(1);
        });

        it('should -1 when b is selected and a is not hovered', () => {
            const nodeA = { id: '2', radius: 20 };
            const nodeB = { id: '1', radius: 10 };
            expect(
                compareNodes({
                    a: nodeA,
                    b: nodeB,
                    selectedNode: nodeA,
                    hoveredNode: null,
                    highlightedNodeIds: [],
                }),
            ).toBe(1);
        });

        it('should return -1 when a is selected even if b is highlighted', () => {
            const nodeA = { id: '2', radius: 20 };
            const nodeB = { id: '1', radius: 10 };
            expect(
                compareNodes({
                    a: nodeA,
                    b: nodeB,
                    selectedNode: nodeA,
                    hoveredNode: null,
                    highlightedNodeIds: ['2'],
                }),
            ).toBe(1);
        });

        // the last one is printed last and so will be rendered on top
        it('should allow to sort an array of nodes (the rest > highlighted > selected > hovered)', () => {
            const nodes = [
                { id: '1', radius: 10 },
                { id: '2', radius: 20 },
                { id: '3', radius: 15 },
                { id: '4', radius: 25 },
                { id: '5', radius: 5 },
                { id: '6', radius: 30 },
            ];
            const selectedNode = nodes[2]; // id 3
            const hoveredNode = nodes[3]; // id 4
            const highlightedNodeIds = ['1', '3', '4', '5']; // ids 1 and 5

            const sortedNodes = nodes.sort((a, b) =>
                compareNodes({
                    a,
                    b,
                    selectedNode,
                    hoveredNode,
                    highlightedNodeIds,
                }),
            );

            const sortedNodeIds = sortedNodes.map((node) => node.id);

            expect(sortedNodeIds).toStrictEqual(['2', '6', '5', '1', '3', '4']);
        });
    });

    describe('isLinkVisible', () => {
        describe('highlightMode = outgoing', () => {
            it('should return true when no selectedNode nor hoveredNode', () => {
                const link = { source: { id: '1' }, target: { id: '2' } };
                expect(
                    isLinkVisible({
                        link,
                        highlightMode: 'outgoing',
                        selectedNode: null,
                        hoveredNode: null,
                    }),
                ).toBe(true);
            });
            it('should return true when link source is selectedNode', () => {
                const link = { source: { id: '1' }, target: { id: '2' } };
                const selectedNode = { id: '1' };
                const hoveredNode = { id: '3' };
                expect(
                    isLinkVisible({
                        link,
                        highlightMode: 'outgoing',
                        selectedNode,
                        hoveredNode,
                    }),
                ).toBe(true);
            });

            it('should return false when link target is selectedNode', () => {
                const link = { source: { id: '1' }, target: { id: '2' } };
                const selectedNode = { id: '2' };
                const hoveredNode = { id: '3' };
                expect(
                    isLinkVisible({
                        link,
                        highlightMode: 'outgoing',
                        selectedNode,
                        hoveredNode,
                    }),
                ).toBe(false);
            });

            it('should return false when neither source nor target are selectedNode', () => {
                const link = { source: { id: '1' }, target: { id: '2' } };
                const selectedNode = { id: '3' };
                const hoveredNode = { id: '4' };
                expect(
                    isLinkVisible({
                        link,
                        highlightMode: 'outgoing',
                        selectedNode,
                        hoveredNode,
                    }),
                ).toBe(false);
            });
        });

        describe('highlightMode = all', () => {
            it('should return true when no selectedNode nor hoveredNode', () => {
                const link = { source: { id: '1' }, target: { id: '2' } };
                expect(
                    isLinkVisible({
                        link,
                        highlightMode: 'all',
                        selectedNode: null,
                        hoveredNode: null,
                    }),
                ).toBe(true);
            });
            it('should return true when link source is selectedNode', () => {
                const link = { source: { id: '1' }, target: { id: '2' } };
                const selectedNode = { id: '1' };
                const hoveredNode = { id: '3' };
                expect(
                    isLinkVisible({
                        link,
                        highlightMode: 'all',
                        selectedNode,
                        hoveredNode,
                    }),
                ).toBe(true);
            });

            it('should return true when link target is selectedNode', () => {
                const link = { source: { id: '1' }, target: { id: '2' } };
                const selectedNode = { id: '2' };
                const hoveredNode = { id: '3' };
                expect(
                    isLinkVisible({
                        link,
                        highlightMode: 'all',
                        selectedNode,
                        hoveredNode,
                    }),
                ).toBe(true);
            });

            it('should return false when neither source nor target are selectedNode', () => {
                const link = { source: { id: '1' }, target: { id: '2' } };
                const selectedNode = { id: '3' };
                const hoveredNode = { id: '4' };
                expect(
                    isLinkVisible({
                        link,
                        highlightMode: 'all',
                        selectedNode,
                        hoveredNode,
                    }),
                ).toBe(false);
            });
        });
    });
});
