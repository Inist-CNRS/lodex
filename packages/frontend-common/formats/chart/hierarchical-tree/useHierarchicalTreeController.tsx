import type { HierarchyPointNode } from 'd3-hierarchy';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Tree, TreeNodeDatum, TreeProps } from 'react-d3-tree';

export async function walkNodes(
    tree: TreeNodeDatum[],
    action: (node: TreeNodeDatum) => void,
) {
    return new Promise<void>((resolve) => {
        const nodeQueue = [...tree];

        const interval = setInterval(() => {
            const node = nodeQueue.shift();
            if (!node) {
                clearInterval(interval);
                resolve();
                return;
            }

            action(node);

            if (node.children?.length) {
                nodeQueue.push(...node.children);
            }
        }, 1);
    });
}

export function useHierarchicalTreeController({
    orientation,
    nodeSize,
    spaceBetweenNodes,
    initialZoom,
    initialDepth,
}: HierarchicalTreeControllerParams) {
    const parentRef = useRef<HTMLDivElement>(null);
    const treeRef = useRef<Tree>(null);

    const [treeTranslate, setTreeTranslate] = useState<TreeProps['translate']>({
        x: 0,
        y: 0,
    });

    const [dimensions, setDimensions] = useState<TreeProps['dimensions']>({
        width: 0,
        height: 0,
    });

    const handleResize = useCallback(() => {
        if (!parentRef.current) {
            return;
        }

        const dimensions = parentRef.current.getBoundingClientRect();

        setDimensions({ width: dimensions.width, height: dimensions.height });

        if (orientation === 'horizontal') {
            const estimatedTreeWidth =
                initialDepth * (nodeSize.x + spaceBetweenNodes) * initialZoom;
            const horizontalOffset = estimatedTreeWidth * 0.5;

            setTreeTranslate({
                x: dimensions.width / 2 - horizontalOffset,
                y: dimensions.height / 2,
            });
        } else {
            setTreeTranslate({
                x: dimensions.width / 2,
                y: dimensions.height / 2,
            });
        }
    }, [orientation, nodeSize.x, spaceBetweenNodes, initialZoom, initialDepth]);

    useEffect(() => {
        let current: HTMLDivElement | null = null;
        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });

        const timer = setTimeout(() => {
            if (!parentRef.current) {
                return;
            }
            handleResize();
            current = parentRef.current;
            resizeObserver.observe(current);
        }, 100);

        window.addEventListener('resize', handleResize);
        return () => {
            if (current) {
                resizeObserver.unobserve(current);
            }

            clearTimeout(timer);
        };
    }, [handleResize]);

    const centerOnNode = useCallback(
        (node: HierarchyPointNode<TreeNodeDatum>) => {
            if (!treeRef.current) {
                return;
            }

            treeRef.current.centerNode(node);
        },
        [],
    );

    const openAll = useCallback(() => {
        // We need to walk the nodes in order to open them one by one
        // This requires async execution otherwise this won't work properly
        walkNodes(treeRef.current?.state.data ?? [], (node) => {
            if (!node.__rd3t.collapsed) {
                return;
            }

            treeRef.current!.handleNodeToggle(node.__rd3t.id);
        });
    }, []);

    const closeAll = useCallback(() => {
        // We need to walk the nodes in order to close them
        // This requires async execution otherwise this won't work properly
        walkNodes(treeRef.current?.state.data ?? [], (node) => {
            if (node.__rd3t.collapsed || node.attributes?.hasParent === true) {
                return;
            }

            treeRef.current!.handleNodeToggle(node.__rd3t.id);
        });
    }, []);

    return useMemo(
        () => ({
            parentRef,
            treeRef,
            dimensions,
            treeTranslate,
            centerOnNode,
            openAll,
            closeAll,
        }),
        [dimensions, treeTranslate, centerOnNode, openAll, closeAll],
    );
}

export type HierarchicalTreeControllerParams = {
    orientation: 'vertical' | 'horizontal';
    nodeSize: { x: number; y: number };
    spaceBetweenNodes: number;
    initialZoom: number;
    initialDepth: number;
};
