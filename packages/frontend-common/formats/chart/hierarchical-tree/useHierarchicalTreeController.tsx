import type { HierarchyPointNode } from 'd3-hierarchy';
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { Tree, TreeNodeDatum, TreeProps } from 'react-d3-tree';
import { GraphContext } from '../../../../public-app/src/graph/GraphContext';

export function useHierarchicalTreeController({
    orientation,
    nodeSize,
    spaceBetweenNodes,
    initialZoom,
    initialDepth,
}: HierarchicalTreeControllerParams) {
    const graphContext = useContext(GraphContext);

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
        const animationId = requestAnimationFrame(handleResize);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, [handleResize]);

    useEffect(() => {
        // Resize when fullscreen mode is toggled
        handleResize();
    }, [graphContext?.field, handleResize]);

    const centerOnNode = useCallback(
        (node: HierarchyPointNode<TreeNodeDatum>) => {
            if (!treeRef.current) {
                return;
            }

            treeRef.current.centerNode(node);
        },
        [],
    );

    const walkNodes = useCallback((action: (node: TreeNodeDatum) => void) => {
        if (!treeRef.current) {
            return;
        }

        const nodeQueue = [...treeRef.current.state.data];

        const interval = setInterval(() => {
            const node = nodeQueue.shift();
            if (!node) {
                clearInterval(interval);
                return;
            }

            action(node);

            if (node.children?.length) {
                nodeQueue.push(...node.children);
            }
        }, 1);
    }, []);

    const openAll = useCallback(() => {
        // We need to walk the nodes in order to open them one by one
        // This requires async execution otherwise this won't work properly
        walkNodes((node) => {
            if (!node.__rd3t.collapsed) {
                return;
            }

            treeRef.current!.handleNodeToggle(node.__rd3t.id);
        });
    }, [walkNodes]);

    const closeAll = useCallback(() => {
        // We need to walk the nodes in order to close them
        // This requires async execution otherwise this won't work properly
        walkNodes((node) => {
            if (node.__rd3t.collapsed || node.attributes?.hasParent === true) {
                return;
            }

            treeRef.current!.handleNodeToggle(node.__rd3t.id);
        });
    }, [walkNodes]);

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
