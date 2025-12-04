import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { ForceGraphMethods, NodeObject } from 'react-force-graph-2d';
import { GraphAction } from '../../../../public-app/src/graph/GraphAction';
import Loading from '../../../components/Loading';
import { AutoComplete } from '../../../form-fields/AutoCompleteField';
import { useTranslate } from '../../../i18n/I18NContext';
import { useSearchPaneContextOrDefault } from '../../../search/useSearchPaneContext';
import { addTransparency } from '../../utils/colorHelpers';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import MouseIcon from '../../utils/components/MouseIcon';
import { NetworkCaption } from './NetworkCaption';
import { type Link, type Node } from './useFormatNetworkData';
import { useLinkColor } from './useLinkColor';

const ForceGraph2D = lazy(() => import('react-force-graph-2d'));

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
        width: '100%',
        height: '100%',
        maxHeight: typeof window !== 'undefined' ? window.innerHeight - 96 : 0,
    },
};

export const compareNodes = ({
    a,
    b,
    selectedNode,
    hoveredNode,
    highlightedNodeIds,
}: {
    a: Node;
    b: Node;
    selectedNode: NodeObject | null;
    hoveredNode: NodeObject | null;
    highlightedNodeIds: string[];
}) => {
    if (!selectedNode && !hoveredNode) {
        return a.radius - b.radius;
    }
    if (a.id === hoveredNode?.id) {
        return 1;
    }
    if (b.id === hoveredNode?.id) {
        return -1;
    }
    if (a.id === selectedNode?.id) {
        return 1;
    }
    if (b.id === selectedNode?.id) {
        return -1;
    }
    const isAHighlighted = highlightedNodeIds.some(
        (highlightNodeId) => highlightNodeId === a.id,
    );
    const isBHighlighted = highlightedNodeIds.some(
        (highlightNodeId) => highlightNodeId === b.id,
    );
    if (isAHighlighted && !isBHighlighted) {
        return 1;
    }
    if (!isAHighlighted && isBHighlighted) {
        return -1;
    }
    return a.radius - b.radius;
};

export const isLinkVisible = ({
    link,
    highlightMode,
    selectedNode,
    hoveredNode,
}: {
    link: {
        source: {
            id: string;
        };
        target: {
            id: string;
        };
    };
    highlightMode?: 'ingoing' | 'outgoing' | 'all';
    selectedNode: { id: string } | null;
    hoveredNode: { id: string } | null;
}) => {
    if (!selectedNode && !hoveredNode) {
        return true;
    }

    if (highlightMode === 'all') {
        return (
            selectedNode?.id === (link.source! as NodeObject).id ||
            selectedNode?.id === (link.target! as NodeObject).id ||
            hoveredNode?.id === (link.target! as NodeObject).id ||
            hoveredNode?.id === (link.source! as NodeObject).id
        );
    }
    if (highlightMode === 'ingoing') {
        return (
            selectedNode?.id === (link.target! as NodeObject).id ||
            hoveredNode?.id === (link.target! as NodeObject).id
        );
    }

    return (
        selectedNode?.id === (link.source! as NodeObject).id ||
        hoveredNode?.id === (link.source! as NodeObject).id
    );
};

type NetworkBaseProps = {
    colorSet?: string[];
    nodes: Node[];
    links: Link[];
    forcePosition?: boolean;
    linkCurvature?: number;
    highlightMode?: 'ingoing' | 'outgoing' | 'all';
    showArrows?: boolean;
    fieldToFilter?: string | null;
    zoomAdjustNodeSize?: boolean;
    captionTitle?: string;
    captions?: Record<string, string>;
};

export const NetworkBase = ({
    colorSet,
    nodes,
    links,
    forcePosition,
    linkCurvature,
    highlightMode = 'all',
    showArrows = false,
    fieldToFilter,
    zoomAdjustNodeSize = false,
    captions,
    captionTitle,
}: NetworkBaseProps) => {
    const { translate } = useTranslate();
    const { selectOne, clearFilters } = useSearchPaneContextOrDefault();
    const [mode, setMode] = useState<'arrow' | 'animated'>('animated');
    const fgRef = useRef<ForceGraphMethods>();
    const [{ width, height }, setDimensions] = useState({
        width: 0,
        height: 0,
    });
    const [cooldownTime, setCooldownTime] = useState(10000);
    const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null);
    const [hoveredNode, setHoveredNode] = useState<NodeObject | null>(null);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [k, setK] = useState(1);

    const linksBySourceId = useMemo(() => {
        return links.reduce<Record<string, Link[]>>(
            (acc, link) => ({
                ...acc,
                [link.source as string]: [
                    ...(acc[link.source as string] || []),
                    link,
                ],
            }),
            {},
        );
    }, [links]);

    const linksByTargetId = useMemo(() => {
        return links.reduce<Record<string, Link[]>>(
            (acc, link) => ({
                ...acc,
                [link.target as string]: [
                    ...(acc[link.target as string] || []),
                    link,
                ],
            }),
            {},
        );
    }, [links]);

    const highlightedNodeIds = useMemo(() => {
        return [
            selectedNode?.id,
            hoveredNode?.id,
            ...(['all', 'outgoing'].includes(highlightMode)
                ? linksBySourceId[selectedNode?.id as string]?.map(
                      (l) => (l.target! as NodeObject).id,
                  ) || []
                : []),

            ...(['all', 'ingoing'].includes(highlightMode)
                ? linksByTargetId[selectedNode?.id as string]?.map(
                      (l) => (l.source! as NodeObject).id,
                  ) || []
                : []),

            ...(['all', 'outgoing'].includes(highlightMode)
                ? linksBySourceId[hoveredNode?.id as string]?.map(
                      (l) => (l.target! as NodeObject).id,
                  ) || []
                : []),

            ...(['all', 'ingoing'].includes(highlightMode)
                ? linksByTargetId[hoveredNode?.id as string]?.map(
                      (l) => (l.source! as NodeObject).id,
                  ) || []
                : []),
        ].filter((id): id is string => !!id);
    }, [
        hoveredNode?.id,
        linksBySourceId,
        selectedNode?.id,
        linksByTargetId,
        highlightMode,
    ]);

    // @ts-expect-error TS7006
    const containerRef = useCallback((node) => {
        if (!node) return;
        const resizeObserver = new ResizeObserver(() => {
            if (node)
                setDimensions({
                    width: node.clientWidth,
                    height: node.clientHeight - 51, // 51 is the height of the mouseIcon
                });
        });
        resizeObserver.observe(node);
    }, []);

    useEffect(() => {
        setCooldownTime(10000);
        setSelectedNode(null);
        setHoveredNode(null);
    }, [nodes, links]);

    // @ts-expect-error TS7006
    const handleNodeHover = (node) => {
        // freeze the chart so that it does not rearrange itself every time we interact with it
        setCooldownTime(0);
        setHoveredNode(node);
    };

    useEffect(() => {
        if (!fgRef.current) return;
        fgRef.current.zoom(k, 0);
        fgRef.current.centerAt(x, y, 0);
    }, [width, height, x, k, y]);

    const handleNodeClick = (node: NodeObject | null) => {
        // freeze the chart so that it does not rearrange itself every time we interact with it
        setCooldownTime(0);

        if (!node || selectedNode?.id === node?.id) {
            setSelectedNode(null);
            clearFilters();
            return;
        }
        setSelectedNode(node);

        const nodeId = node.id?.toString();
        const label =
            node.label !== nodeId ? `${node.label} (${nodeId})` : nodeId;
        if (fieldToFilter && nodeId) {
            selectOne({
                fieldName: fieldToFilter,
                value: nodeId,
                label,
            });
        }

        if (!fgRef.current) return;
        fgRef.current.zoomToFit(500, 100, (n) => n.id === node.id);
    };

    const sortedNodes = useMemo(() => {
        return nodes.sort((a, b) =>
            compareNodes({
                a,
                b,
                selectedNode,
                hoveredNode,
                highlightedNodeIds,
            }),
        );
    }, [nodes, highlightedNodeIds, selectedNode, hoveredNode]);

    const [minLinkSize, maxLinkSize] = useMemo(() => {
        const sizes = links
            .map((l) => l.value)
            .filter((v): v is number => typeof v === 'number');
        return [Math.min(...sizes), Math.max(...sizes)];
    }, [links]);

    const linkColor = useLinkColor({
        mode,
        minLinkSize,
        maxLinkSize,
    });

    return (
        <div style={{ height: `500px`, position: 'relative' }}>
            <FormatFullScreenMode>
                {/*
                 // @ts-expect-error TS2322 */}
                <div style={styles.container} ref={containerRef}>
                    <GraphAction>
                        {showArrows && (
                            <ToggleButtonGroup
                                value={mode}
                                exclusive
                                onChange={(_, value) =>
                                    setMode(value as 'arrow' | 'animated')
                                }
                                aria-label={translate('network_mode')}
                                sx={{
                                    height: '56px',
                                }}
                            >
                                <ToggleButton value="arrow">
                                    {translate('network_mode_arrow')}
                                </ToggleButton>
                                <ToggleButton value="animated">
                                    {translate('network_mode_animated')}
                                </ToggleButton>
                            </ToggleButtonGroup>
                        )}
                        <AutoComplete
                            label={translate('select_node')}
                            value={selectedNode?.label || null}
                            onChange={(_event, value) =>
                                handleNodeClick(
                                    nodes.find((node) => node.id === value) ||
                                        null,
                                )
                            }
                            getOptionLabel={(option: string) => option}
                            options={nodes
                                .map((node) => node.label as string)
                                .sort((a, b) => a.localeCompare(b))}
                            name="search"
                            sx={{
                                maxWidth: '256px',
                            }}
                        />
                    </GraphAction>
                    <Suspense
                        fallback={<Loading>{translate('loading')}</Loading>}
                    >
                        <ForceGraph2D
                            onZoomEnd={({ k, x, y }) => {
                                // We want to preserve the zoom level and position when switching from and to fullscreen
                                // so we skip the default value (k=1, x=0, y=0) that correspond to a reset zoom
                                if (x === 0 && y === 0 && k === 1) return;
                                setK(k);
                                setX(x);
                                setY(y);
                            }}
                            ref={fgRef}
                            width={width}
                            height={height}
                            graphData={{
                                nodes: sortedNodes,
                                links,
                            }}
                            nodeLabel={(node) => {
                                return node.label;
                            }}
                            nodeVal={(node) => node.radius}
                            nodeCanvasObject={(node, ctx, globalScale) => {
                                const isSelected = node.id === selectedNode?.id;

                                if (
                                    highlightedNodeIds.length === 0 ||
                                    highlightedNodeIds.some(
                                        (highlightNodeId) =>
                                            highlightNodeId === node.id,
                                    )
                                ) {
                                    ctx.globalAlpha = 1;
                                } else {
                                    ctx.globalAlpha = 0.1;
                                }
                                const circleRadius = zoomAdjustNodeSize
                                    ? Math.max(node.radius, 1.5) / globalScale
                                    : Math.max(node.radius, 1.5);

                                if (isSelected) {
                                    ctx.fillStyle = '#880000';
                                    ctx.beginPath();
                                    ctx.arc(
                                        node.x!,
                                        node.y!,
                                        circleRadius +
                                            (zoomAdjustNodeSize
                                                ? 1 / globalScale
                                                : 1),
                                        0,
                                        2 * Math.PI,
                                        false,
                                    );
                                    ctx.fill();
                                }

                                ctx.fillStyle = node.color
                                    ? addTransparency(
                                          node.color,
                                          isSelected ? 1 : 0.75,
                                      )
                                    : colorSet
                                      ? addTransparency(
                                            colorSet[0],
                                            isSelected ? 1 : 0.75,
                                        )
                                      : '#000000e6';
                                ctx.beginPath();
                                ctx.arc(
                                    node.x!,
                                    node.y!,
                                    circleRadius,
                                    0,
                                    2 * Math.PI,
                                    false,
                                );
                                ctx.fill();

                                const fontSize = Math.max(circleRadius / 2, 3);
                                ctx.font = `${isSelected ? 'bold ' : ''}${fontSize}px Sans-Serif`;

                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = 'black';
                                ctx.fillText(node.label, node.x!, node.y!);

                                ctx.globalAlpha = 1;
                            }}
                            linkColor={(link) => linkColor(link as Link)}
                            linkVisibility={(link) =>
                                isLinkVisible({
                                    link: link as {
                                        source: { id: string };
                                        target: { id: string };
                                    },
                                    highlightMode,
                                    selectedNode: selectedNode as {
                                        id: string;
                                    } | null,
                                    hoveredNode: hoveredNode as {
                                        id: string;
                                    } | null,
                                })
                            }
                            onNodeClick={handleNodeClick}
                            onNodeHover={handleNodeHover}
                            enableNodeDrag={false}
                            linkWidth={(l) =>
                                showArrows && mode === 'arrow'
                                    ? 1
                                    : l.value ?? 1
                            }
                            linkLabel={(l) => l.label ?? ''}
                            cooldownTime={forcePosition ? 0 : cooldownTime}
                            cooldownTicks={forcePosition ? 0 : undefined}
                            linkCurvature={linkCurvature}
                            nodePointerAreaPaint={(
                                node,
                                color,
                                ctx,
                                globalScale,
                            ) => {
                                const circleRadius = zoomAdjustNodeSize
                                    ? Math.max(node.radius, 1.5) / globalScale
                                    : Math.max(node.radius, 1.5);

                                ctx.strokeStyle = color;
                                ctx.fillStyle = color;
                                ctx.beginPath();
                                ctx.arc(
                                    node.x!,
                                    node.y!,
                                    circleRadius,
                                    0,
                                    2 * Math.PI,
                                    false,
                                );
                                ctx.fill();

                                const fontSize = Math.max(circleRadius / 2, 3);
                                ctx.font = `${fontSize}px Sans-Serif`;

                                const textWidth = ctx.measureText(
                                    node.label,
                                ).width;
                                const bckgDimensions: [number, number] = [
                                    textWidth,
                                    fontSize,
                                ].map((n) => n + fontSize * 0.2) as [
                                    number,
                                    number,
                                ]; // some padding

                                ctx.fillRect(
                                    node.x! - bckgDimensions[0] / 2,
                                    node.y! - bckgDimensions[1] / 2,
                                    ...bckgDimensions,
                                );
                            }}
                            linkDirectionalParticleWidth={
                                showArrows && mode === 'animated' ? 4 : 0
                            }
                            linkDirectionalParticles={
                                showArrows && mode === 'animated' ? 2 : 0
                            }
                            linkDirectionalParticleSpeed={
                                showArrows && mode === 'animated' ? 0.005 : 0
                            }
                            linkDirectionalArrowLength={
                                showArrows && mode === 'arrow' ? 3 : 0
                            }
                            linkDirectionalArrowRelPos={
                                showArrows && mode === 'arrow' ? 1 : 0
                            }
                        />
                    </Suspense>

                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                        }}
                    >
                        {<MouseIcon />}
                    </div>

                    <NetworkCaption
                        captions={captions}
                        captionTitle={captionTitle}
                    />
                </div>
            </FormatFullScreenMode>
        </div>
    );
};
