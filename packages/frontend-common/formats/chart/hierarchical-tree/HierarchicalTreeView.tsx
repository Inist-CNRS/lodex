import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import { Box, IconButton } from '@mui/material';
import {
    lazy,
    Suspense,
    useCallback,
    useMemo,
    type ComponentClass,
} from 'react';
import type { TreeProps } from 'react-d3-tree';
import { compose } from 'recompose';
import { CloseAllIcon } from '../../../../public-app/src/annotation/icons/CloseAllIcon';
import { OpenAllIcon } from '../../../../public-app/src/annotation/icons/OpenAllIcon';
import { GraphAction } from '../../../../public-app/src/graph/GraphAction';
import type { Field } from '../../../fields/types';
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
    HEADER_HEIGHT,
    HierarchicalTreeNode,
    LEAF_BAR_HEIGHT,
    LEAF_BAR_SPACING,
} from './HierarchicalTreeNode';
import type { Datum } from './type';
import { useFormatTreeData, type SortBy } from './useFormatTreeData';
import { useHierarchicalTreeController } from './useHierarchicalTreeController';
import { AutoComplete } from '../../../form-fields/AutoCompleteField';
import { useTranslate } from '../../../i18n/I18NContext';

const TreeView = lazy(async () => {
    const { Tree } = await import('react-d3-tree');
    return { default: Tree as ComponentClass<TreeProps> };
});

export function HierarchicalTreeView({
    field,
    formatData,
    nodeWidth,
    nodeHeight,
    orientation = DEFAULT_ORIENTATION,
    spaceBetweenNodes,
    initialZoom,
    initialDepth,
    minimumScaleValue,
    maximumScaleValue,
    fieldToFilter,
    colors,
    params,
}: HierarchicalTreeViewProps) {
    const { translate } = useTranslate();
    const zoom = initialZoom ?? DEFAULT_ZOOM;
    const depth = initialDepth ?? DEFAULT_DEPTH;
    const spacing = spaceBetweenNodes ?? DEFAULT_SPACE_BETWEEN_NODES;

    const sortBy = useMemo(() => {
        const sortByParam = params?.orderBy ?? 'label/asc';
        const [kind, direction] = sortByParam.split('/') as [
            SortBy['kind'],
            SortBy['direction'],
        ];
        return { kind, direction };
    }, [params?.orderBy]);

    const nodeSize = useMemo(
        () => ({
            x: (nodeWidth ?? DEFAULT_NODE_WIDTH) + spacing,
            y:
                Math.min(nodeHeight ?? DEFAULT_NODE_HEIGHT, HEADER_HEIGHT + 2) +
                spacing,
        }),
        [nodeWidth, nodeHeight, spacing],
    );

    const tree = useFormatTreeData({
        rootName: field?.label,
        data: formatData,
        sortBy,
    });

    const {
        parentRef,
        treeRef,
        dimensions,
        treeTranslate,
        selectNode,
        openAll,
        closeAll,
        resetZoom,
        selectedNodeOption,
        selectNodeById,
        nodeOptions,
    } = useHierarchicalTreeController({
        orientation,
        nodeSize,
        spaceBetweenNodes: spacing,
        initialZoom: zoom,
        initialDepth: depth,
        tree,
    });

    const getNodeColor = useCallback(() => {
        return colors || '#000000';
    }, [colors]);

    return (
        <Box sx={{ height: `500px` }} role="tree">
            <FormatFullScreenMode>
                <GraphAction>
                    <AutoComplete
                        label={translate('select_node')}
                        value={selectedNodeOption}
                        onChange={(_event, option) => {
                            selectNodeById(option.value);
                        }}
                        getOptionLabel={(
                            option:
                                | {
                                      value: string;
                                      label: string;
                                  }
                                | string,
                        ) =>
                            typeof option === 'string' ? option : option.label
                        }
                        isOptionEqualToValue={(option, value) =>
                            option.value === value.value
                        }
                        getOptionKey={(option) => option.value}
                        options={nodeOptions}
                        name="search"
                        sx={{
                            width: '256px',
                            maxWidth: '256px',
                        }}
                    />
                    <IconButton onClick={closeAll} size="small">
                        <CloseAllIcon />
                    </IconButton>
                    <IconButton onClick={openAll} size="small">
                        <OpenAllIcon />
                    </IconButton>
                </GraphAction>
                <Box
                    ref={parentRef}
                    sx={{
                        width: '100%',
                        height: '100%',
                    }}
                >
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
                                    width={nodeSize.x}
                                    height={nodeSize.y}
                                    fieldToFilter={fieldToFilter}
                                    getNodeColor={getNodeColor}
                                />
                            )}
                            nodeSize={{
                                x:
                                    nodeSize.x +
                                    (orientation === 'horizontal'
                                        ? BUTTON_SIZE +
                                          BUTTON_SPACING +
                                          spacing * 11
                                        : 0),
                                y:
                                    nodeSize.y +
                                    (orientation === 'vertical'
                                        ? BUTTON_SIZE +
                                          BUTTON_SPACING +
                                          spacing * 7
                                        : 0) +
                                    LEAF_BAR_HEIGHT +
                                    LEAF_BAR_SPACING,
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
                            onNodeClick={(node) => selectNode(node)}
                            centeringTransitionDuration={150}
                            dimensions={dimensions}
                        />
                    </Suspense>
                </Box>

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        '& svg': {
                            width: '32px',
                            height: '32px',
                        },
                    }}
                >
                    <MouseIcon />
                </Box>

                <IconButton
                    onClick={resetZoom}
                    sx={{
                        position: 'absolute',
                        left: '48px',
                        bottom: '8px',
                    }}
                >
                    <FilterCenterFocusIcon />
                </IconButton>
            </FormatFullScreenMode>
        </Box>
    );
}

type HierarchicalTreeViewProps = {
    field?: Field;
    formatData: Datum[];

    orientation?: 'horizontal' | 'vertical';
    nodeWidth?: number | null;
    nodeHeight?: number | null;
    spaceBetweenNodes?: number | null;

    initialZoom?: number | null;
    initialDepth?: number | null;

    minimumScaleValue?: number | null;
    maximumScaleValue?: number | null;

    fieldToFilter?: string | null;
    colors?: string;

    params?: { orderBy?: string };
};

export default compose<
    HierarchicalTreeViewProps,
    Omit<HierarchicalTreeViewProps, 'formatData'>
>(injectData(null, null, true))(HierarchicalTreeView);
