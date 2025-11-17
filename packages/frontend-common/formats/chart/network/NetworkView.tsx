import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import Loading from '../../../components/Loading';
import type { Field } from '../../../fields/types';
import { useTranslate } from '../../../i18n/I18NContext';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import MouseIcon from '../../utils/components/MouseIcon';
import {
    useFormatNetworkData,
    type Link,
    type NetworkData,
    type Node,
} from './useFormatNetworkData';
import { AutoComplete } from '../../../form-fields/AutoCompleteField';
import type { ForceGraphMethods, NodeObject } from 'react-force-graph-2d';
import { compose } from 'recompose';
import injectData from '../../injectData';

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

type NetworkBaseProps = {
    colorSet?: string[];
    nodes: Node[];
    links: Link[];
    forcePosition?: boolean;
    linkCurvature?: number;
};

export const NetworkBase = ({
    colorSet,
    nodes,
    links,
    forcePosition,
    linkCurvature,
}: NetworkBaseProps) => {
    const { translate } = useTranslate();
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

    const highlightedNodeIds = useMemo(() => {
        return [
            selectedNode?.id,
            hoveredNode?.id,
            ...(linksBySourceId[selectedNode?.id as string]?.map(
                (l) => (l.target! as NodeObject).id,
            ) || []),
            ...(linksBySourceId[hoveredNode?.id as string]?.map(
                (l) => (l.target! as NodeObject).id,
            ) || []),
        ].filter((id): id is string => !!id);
    }, [hoveredNode?.id, linksBySourceId, selectedNode?.id]);

    // @ts-expect-error TS7006
    const containerRef = useCallback((node) => {
        if (!node) return;
        const resizeObserver = new ResizeObserver(() => {
            if (node)
                setDimensions({
                    width: node.clientWidth,
                    height: node.clientHeight - 91, // 91 is the height of the autocomplete + margins
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
            return;
        }
        setSelectedNode(node);

        if (!fgRef.current) return;
        fgRef.current.zoomToFit(500, 200, (n) => n.id === node.id);
    };

    const sortedNodes = useMemo(() => {
        return nodes.sort((a, b) => {
            if (!selectedNode) {
                return a.radius - b.radius;
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
            if (!isAHighlighted || isBHighlighted) {
                return -1;
            }
            return a.radius - b.radius;
        });
    }, [nodes, highlightedNodeIds, selectedNode]);

    return (
        <div style={{ height: `500px`, position: 'relative' }}>
            <FormatFullScreenMode>
                {/*
                 // @ts-expect-error TS2322 */}
                <div style={styles.container} ref={containerRef}>
                    <AutoComplete
                        style={{ margin: '1rem' }}
                        label={translate('select_node')}
                        value={selectedNode?.id || null}
                        onChange={(_event, value) =>
                            handleNodeClick(
                                nodes.find((node) => node.id === value) || null,
                            )
                        }
                        getOptionLabel={(option: string) => option}
                        options={nodes.map((node) => node.id as string)}
                    />
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
                                const circleRadius = node.radius / globalScale;

                                if (isSelected) {
                                    ctx.fillStyle = '#880000';
                                    ctx.beginPath();
                                    ctx.arc(
                                        node.x!,
                                        node.y!,
                                        circleRadius + 4 / globalScale,
                                        0,
                                        2 * Math.PI,
                                        false,
                                    );
                                    ctx.fill();
                                }

                                ctx.fillStyle = node.color
                                    ? `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, ${isSelected ? 1 : 0.75})`
                                    : colorSet
                                      ? `${colorSet![0]}${isSelected ? 'ff' : '7f'}`
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
                            linkColor={(link) =>
                                link.color
                                    ? `rgba(${link.color.r}, ${link.color.g}, ${link.color.b}, 0.25)`
                                    : '#99999999'
                            }
                            linkVisibility={(link) => {
                                if (!selectedNode && !hoveredNode) {
                                    return true;
                                }

                                return (
                                    selectedNode?.id ===
                                        (link.source! as NodeObject).id ||
                                    hoveredNode?.id ===
                                        (link.source! as NodeObject).id
                                );
                            }}
                            onNodeClick={handleNodeClick}
                            onNodeHover={handleNodeHover}
                            enableNodeDrag={false}
                            cooldownTime={forcePosition ? 0 : cooldownTime}
                            cooldownTicks={forcePosition ? 0 : undefined}
                            linkCurvature={linkCurvature}
                            nodePointerAreaPaint={(
                                node,
                                color,
                                ctx,
                                globalScale,
                            ) => {
                                const circleRadius = node.radius / globalScale;

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
                            linkPointerAreaPaint={() => {}}
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
                </div>
            </FormatFullScreenMode>
        </div>
    );
};

interface NetworkProps {
    colorSet?: string[];
    formatData?: NetworkData[];
    field: Field;
}

const Network = ({ formatData, colorSet, field }: NetworkProps) => {
    const { nodes, links } = useFormatNetworkData({
        formatData,
        displayWeighted:
            typeof field?.format?.args?.displayWeighted === 'boolean'
                ? field.format.args.displayWeighted
                : true,
    });

    return <NetworkBase colorSet={colorSet} nodes={nodes} links={links} />;
};

// @ts-expect-error TS2345
export default compose(injectData())(Network);
