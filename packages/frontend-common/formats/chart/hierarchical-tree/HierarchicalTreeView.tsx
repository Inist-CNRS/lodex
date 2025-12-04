import { Box } from '@mui/material';
import {
    lazy,
    Suspense,
    useCallback,
    useMemo,
    type ComponentClass,
} from 'react';
import type { TreeProps } from 'react-d3-tree';
import { compose } from 'recompose';
import injectData from '../../injectData';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import MouseIcon from '../../utils/components/MouseIcon';
import {
    DEFAULT_DEPTH,
    DEFAULT_MAXIMUM_SCALE_VALUE,
    DEFAULT_MINIMUM_SCALE_VALUE,
    DEFAULT_NODE_HEIGHT,
    DEFAULT_NODE_WIDTH,
    DEFAULT_ORIENTATION,
    DEFAULT_SPACE_BETWEEN_NODES,
    DEFAULT_ZOOM,
} from './const';
import {
    BUTTON_SIZE,
    BUTTON_SPACING,
    HierarchicalTreeNode,
} from './HierarchicalTreeNode';
import type { Datum } from './type';
import { useFormatTreeData } from './useFormatTreeData';
import { useHierarchicalTreeController } from './useHierarchicalTreeController';

const TreeView = lazy(async () => {
    const { Tree } = await import('react-d3-tree');
    return { default: Tree as ComponentClass<TreeProps> };
});

export function HierarchicalTreeView({
    formatData,
    nodeWidth,
    nodeHeight,
    orientation = DEFAULT_ORIENTATION,
    spaceBetweenNodes,
    initialZoom,
    initialDepth,
    minimumScaleValue,
    maximumScaleValue,
    colors,
}: HierarchicalTreeViewProps) {
    const zoom = initialZoom ?? DEFAULT_ZOOM;
    const depth = initialDepth ?? DEFAULT_DEPTH;
    const spacing = spaceBetweenNodes ?? DEFAULT_SPACE_BETWEEN_NODES;

    const nodeSize = useMemo(
        () => ({
            x: (nodeWidth ?? DEFAULT_NODE_WIDTH) + spacing,
            y: (nodeHeight ?? DEFAULT_NODE_HEIGHT) + spacing,
        }),
        [nodeWidth, nodeHeight, spacing],
    );

    const { parentRef, treeRef, dimensions, treeTranslate, centerOnNode } =
        useHierarchicalTreeController({
            orientation,
            nodeSize,
            spaceBetweenNodes: spacing,
            initialZoom: zoom,
            initialDepth: depth,
        });

    const tree = useFormatTreeData({
        data: formatData,
    });

    const getNodeColor = useCallback(() => {
        return colors || '#000000';
    }, [colors]);

    return (
        <Box sx={{ height: `500px` }} role="tree">
            <FormatFullScreenMode>
                <Box ref={parentRef} sx={{ width: '100%', height: '100%' }}>
                    <Suspense>
                        <TreeView
                            ref={treeRef}
                            data={tree}
                            orientation={orientation}
                            translate={treeTranslate}
                            renderCustomNodeElement={(props) => (
                                <HierarchicalTreeNode
                                    {...props}
                                    orientation={orientation}
                                    width={nodeWidth ?? DEFAULT_NODE_WIDTH}
                                    height={nodeHeight ?? DEFAULT_NODE_HEIGHT}
                                    getNodeColor={getNodeColor}
                                />
                            )}
                            nodeSize={{
                                x:
                                    (nodeWidth ?? DEFAULT_NODE_WIDTH) +
                                    (orientation === 'horizontal'
                                        ? BUTTON_SIZE + BUTTON_SPACING
                                        : 0) +
                                    spacing,
                                y:
                                    (nodeHeight ?? DEFAULT_NODE_HEIGHT) +
                                    (orientation === 'vertical'
                                        ? BUTTON_SIZE + BUTTON_SPACING
                                        : 0) +
                                    spacing,
                            }}
                            scaleExtent={{
                                min:
                                    minimumScaleValue ??
                                    DEFAULT_MINIMUM_SCALE_VALUE,
                                max:
                                    maximumScaleValue ??
                                    DEFAULT_MAXIMUM_SCALE_VALUE,
                            }}
                            zoom={zoom}
                            initialDepth={depth}
                            hasInteractiveNodes
                            onNodeClick={centerOnNode}
                            centeringTransitionDuration={150}
                            dimensions={dimensions}
                        />
                    </Suspense>
                </Box>

                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                    }}
                >
                    {<MouseIcon />}
                </div>
            </FormatFullScreenMode>
        </Box>
    );
}

type HierarchicalTreeViewProps = {
    formatData: Datum[];

    orientation?: 'horizontal' | 'vertical';
    nodeWidth?: number | null;
    nodeHeight?: number | null;
    spaceBetweenNodes?: number | null;

    initialZoom?: number | null;
    initialDepth?: number | null;

    minimumScaleValue?: number | null;
    maximumScaleValue?: number | null;
    colors?: string;
};

export default compose<
    HierarchicalTreeViewProps,
    Omit<HierarchicalTreeViewProps, 'formatData'>
>(injectData())(HierarchicalTreeView);
