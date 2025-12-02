import MoreIcon from '@mui/icons-material/Add';
import MinusIcon from '@mui/icons-material/Remove';
import { Box, IconButton, Tooltip } from '@mui/material';
import classNames from 'classnames';
import type { CustomNodeElementProps } from 'react-d3-tree';
import stylesToClassName from '../../../utils/stylesToClassName';

const styles = stylesToClassName(
    {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '4px',
        },
        group: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopRightRadius: '4px',
            borderTopLeftRadius: '4px',
            minWidth: '0',
            gap: '8px',
            width: '100%',
            paddingInline: '8px',
        },
        label: {
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: '1',
        },
    },
    'hierarchical-tree-node',
);

export function HierarchicalTreeNode({
    orientation,
    nodeDatum,
    width,
    height,
    getNodeColor,
    onNodeClick,
    onNodeMouseOut,
    onNodeMouseOver,
    toggleNode,
}: NodeProps) {
    const color = getNodeColor(nodeDatum.__rd3t.depth);
    const isOpen = nodeDatum.__rd3t?.collapsed === false;
    const hasChildren = !!nodeDatum.children?.length;

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        toggleNode();
        if (onNodeClick) {
            onNodeClick(event);
        }
    };

    const title = nodeDatum?.attributes?.title ?? nodeDatum.name;

    return (
        <foreignObject
            width={width}
            height={height}
            x={orientation === 'horizontal' ? 0 : (-1 * width) / 2}
            y={orientation === 'horizontal' ? -16 : 0}
        >
            <Box
                role="treeitem"
                // @ts-expect-error TS2339
                className={classNames(styles.container)}
                sx={{
                    borderColor: color,
                    color,
                }}
                onClick={handleClick}
                onMouseOver={onNodeMouseOver}
                onMouseOut={onNodeMouseOut}
            >
                <Box
                    role="group"
                    aria-label={nodeDatum.name}
                    // @ts-expect-error TS2339
                    className={classNames(styles.group)}
                    sx={{
                        padding: '4px',
                        height: '32px',
                    }}
                >
                    <Tooltip title={title}>
                        <span
                            // @ts-expect-error TS2339
                            className={classNames(styles.label)}
                        >
                            {title}
                        </span>
                    </Tooltip>

                    {hasChildren && (
                        <IconButton
                            sx={{
                                width: '20px',
                                height: '20px',
                                '& svg': {
                                    fontSize: '16px',
                                },
                            }}
                        >
                            {isOpen ? <MinusIcon /> : <MoreIcon />}
                        </IconButton>
                    )}
                </Box>
            </Box>
        </foreignObject>
    );
}

type NodeProps = CustomNodeElementProps & {
    orientation: 'vertical' | 'horizontal';
    width: number;
    height: number;
    getNodeColor(level: number): string;
};
