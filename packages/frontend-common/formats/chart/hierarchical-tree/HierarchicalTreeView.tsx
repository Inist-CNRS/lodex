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
import { HierarchicalTreeNode } from './HierarchicalTreeNode';
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
    spaceBetweenNodes = DEFAULT_SPACE_BETWEEN_NODES,
    initialZoom = DEFAULT_ZOOM,
    initialDepth = DEFAULT_DEPTH,
    minimumScaleValue,
    maximumScaleValue,
    colors,
}: HierarchicalTreeViewProps) {
    const nodeSize = useMemo(
        () => ({
            x: (nodeWidth ?? DEFAULT_NODE_WIDTH) + 32,
            y: (nodeHeight ?? DEFAULT_NODE_HEIGHT) + 32,
        }),
        [nodeWidth, nodeHeight],
    );

    const { parentRef, treeRef, dimensions, treeTranslate, centerOnNode } =
        useHierarchicalTreeController({
            orientation,
            nodeSize,
            spaceBetweenNodes,
            initialZoom,
            initialDepth,
        });

    const { tree } = useFormatTreeData({
        data: formatData,
    });

    const getNodeColor = useCallback(() => {
        return colors || '#000000';
    }, [colors]);

    return (
        <Box sx={{ height: `500px`, position: 'relative' }} role="tree">
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
                                x: (nodeWidth ?? DEFAULT_NODE_WIDTH) + 32,
                                y: (nodeHeight ?? DEFAULT_NODE_HEIGHT) + 32,
                            }}
                            scaleExtent={{
                                min:
                                    minimumScaleValue ??
                                    DEFAULT_MINIMUM_SCALE_VALUE,
                                max:
                                    maximumScaleValue ??
                                    DEFAULT_MAXIMUM_SCALE_VALUE,
                            }}
                            zoom={initialZoom}
                            initialDepth={initialDepth}
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
    spaceBetweenNodes?: number;

    initialZoom?: number;
    initialDepth?: number;

    minimumScaleValue?: number | null;
    maximumScaleValue?: number | null;
    colors?: string;
};

// @ts-expect-error TS2345
export default compose(injectData())(HierarchicalTreeView);
