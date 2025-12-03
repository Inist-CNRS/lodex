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

    return useMemo(
        () => ({
            parentRef,
            treeRef,
            dimensions,
            treeTranslate,
            centerOnNode,
        }),
        [dimensions, treeTranslate, centerOnNode],
    );
}

export type HierarchicalTreeControllerParams = {
    orientation: 'vertical' | 'horizontal';
    nodeSize: { x: number; y: number };
    spaceBetweenNodes: number;
    initialZoom: number;
    initialDepth: number;
};
