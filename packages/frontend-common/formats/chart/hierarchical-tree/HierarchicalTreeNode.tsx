import MoreIcon from '@mui/icons-material/Add';
import MinusIcon from '@mui/icons-material/Remove';
import { Box, Button, Tooltip } from '@mui/material';
import type { CustomNodeElementProps } from 'react-d3-tree';
import { useSearchPaneContextOrDefault } from '../../../search/useSearchPaneContext';

export const BUTTON_SIZE = 20;
export const BUTTON_SPACING = 8;
export const HEADER_HEIGHT = 32;

export function HierarchicalTreeNode({
    orientation,
    nodeDatum,
    width,
    height,
    fieldToFilter,
    getNodeColor,
    onNodeClick,
    onNodeMouseOut,
    onNodeMouseOver,
    toggleNode,
}: NodeProps) {
    const { filters, selectOne } = useSearchPaneContextOrDefault();

    const color = getNodeColor(nodeDatum.__rd3t.depth);
    const isOpen = nodeDatum.__rd3t?.collapsed === false;
    const hasChildren = !!nodeDatum.children?.length;

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (fieldToFilter) {
            selectOne({ fieldName: fieldToFilter, value: nodeDatum.name });
        }

        if (onNodeClick) {
            onNodeClick(event);
        }
    };
    const handleToggleNode = (event: React.MouseEvent) => {
        event.stopPropagation();
        toggleNode();
    };

    const title = nodeDatum?.attributes?.title ?? nodeDatum.name;

    const buttonPosition =
        orientation === 'horizontal'
            ? {
                  top: (HEADER_HEIGHT - BUTTON_SIZE - 2) / 2,
                  right: -1 * BUTTON_SIZE - BUTTON_SPACING,
              }
            : {
                  bottom: -1 * BUTTON_SIZE - BUTTON_SPACING,
                  left: (width - BUTTON_SIZE - 2) / 2,
              };

    const isSelected = filters.at(0)?.value === nodeDatum.name;
    const isNotSelected = filters?.length > 0 && !isSelected;

    return (
        <foreignObject
            width={
                width +
                (orientation === 'horizontal'
                    ? BUTTON_SIZE + BUTTON_SPACING
                    : 0)
            }
            height={
                height +
                (orientation === 'vertical' ? BUTTON_SIZE + BUTTON_SPACING : 0)
            }
            x={orientation === 'horizontal' ? 0 : (-1 * width) / 2}
            y={orientation === 'horizontal' ? (-1 * HEADER_HEIGHT) / 2 : 0}
        >
            <Box
                role="treeitem"
                className="hierarchical-tree-node-container"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isNotSelected ? '#fafafa' : '#ffffff',
                    borderWidth: isSelected ? '3px' : '1px',
                    borderStyle: 'solid',
                    borderRadius: '4px',
                    borderColor: isNotSelected ? `${color}ee` : color,
                    color: isNotSelected ? `${color}cc` : color,
                    position: 'relative',
                    width: `${width}px`,
                    maxHeight: `${height}px`,
                }}
                onMouseOver={onNodeMouseOver}
                onMouseOut={onNodeMouseOut}
                onClick={handleClick}
                aria-current={isSelected}
            >
                <Box
                    role="group"
                    aria-label={nodeDatum.name}
                    className="hierarchical-tree-node-group"
                    sx={{
                        padding: '4px 8px',
                        height: `${HEADER_HEIGHT - (isSelected ? 6 : 2)}px`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTopRightRadius: '4px',
                        borderTopLeftRadius: '4px',
                        minWidth: '0',
                        gap: '8px',
                        width: '100%',
                    }}
                >
                    <Tooltip title={title}>
                        <Box
                            className="hierarchical-tree-node-label"
                            sx={{
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: '1',
                            }}
                            component="span"
                        >
                            {title}
                        </Box>
                    </Tooltip>
                </Box>

                {hasChildren && (
                    <Button
                        sx={{
                            minWidth: 0,
                            width: `${BUTTON_SIZE}px`,
                            height: `${BUTTON_SIZE}px`,
                            position: 'absolute',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ffffff',
                            border: '1px #000000 solid',
                            borderRadius: '50%',
                            ...buttonPosition,
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                            },
                            '& svg': {
                                fontSize: `${BUTTON_SIZE - 4}px`,
                            },
                        }}
                        className="hierarchical-tree-node-toggle"
                        onClick={handleToggleNode}
                    >
                        {isOpen ? <MinusIcon /> : <MoreIcon />}
                    </Button>
                )}
            </Box>
        </foreignObject>
    );
}

type NodeProps = CustomNodeElementProps & {
    orientation: 'vertical' | 'horizontal';
    width: number;
    height: number;

    fieldToFilter?: string | null;

    getNodeColor(level: number): string;
};
