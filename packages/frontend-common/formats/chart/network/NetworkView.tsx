import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import compose from 'recompose/compose';

import Loading from '../../../components/Loading';
import type { Field } from '../../../fields/types';
import { useTranslate } from '../../../i18n/I18NContext';
import injectData from '../../injectData';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import MouseIcon from '../../utils/components/MouseIcon';
import {
    useFormatNetworkData,
    type Link,
    type NetworkData,
} from './useFormatNetworkData';
import { AutoComplete } from '../../../form-fields/AutoCompleteField';
import type { ForceGraphMethods, NodeObject } from 'react-force-graph-2d';

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

interface NetworkProps {
    colorSet?: string[];
    formatData?: NetworkData[];
    field: Field;
}

const Network = ({ formatData, colorSet, field }: NetworkProps) => {
    const { translate } = useTranslate();
    const fgRef = useRef<ForceGraphMethods>();
    const [{ width, height }, setDimensions] = useState({
        width: 0,
        height: 0,
    });
    const [cooldownTime, setCooldownTime] = useState(10000);
    const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null);
    const [highlightedNodes, setHighlightedNodes] = useState<NodeObject[]>([]);
    const [highlightedLinks, setHighlightedLinks] = useState<Link[]>([]);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [k, setK] = useState(1);

    // @ts-expect-error TS7006
    const containerRef = useCallback((node) => {
        if (!node) return;
        const resizeObserver = new ResizeObserver(() => {
            if (node)
                setDimensions({
                    width: node.clientWidth,
                    height: node.clientHeight,
                });
        });
        resizeObserver.observe(node);
    }, []);

    useEffect(() => {
        setCooldownTime(10000);
        setSelectedNode(null);
        setHighlightedNodes([]);
        setHighlightedLinks([]);
    }, [formatData]);

    const { nodes, links } = useFormatNetworkData({
        formatData,
        displayWeighted:
            typeof field?.format?.args?.displayWeighted === 'boolean'
                ? field.format.args.displayWeighted
                : true,
    });

    // @ts-expect-error TS7006
    const handleNodeHover = (node) => {
        // freeze the chart so that it does not rearrange itself every time we interact with it
        setCooldownTime(0);
        if (selectedNode) {
            if (!node) {
                setHighlightedNodes([selectedNode, ...selectedNode.neighbors]);
                setHighlightedLinks(selectedNode!.links ?? []);
                return;
            }
            if (
                highlightedNodes.some(
                    (highlightedNode) => highlightedNode.id === node.id,
                )
            ) {
                return;
            }

            setHighlightedNodes([
                selectedNode,
                ...selectedNode.neighbors,
                node,
            ]);
            return;
        }

        if (!node) {
            setHighlightedNodes([]);
            setHighlightedLinks([]);
            return;
        }
        setHighlightedNodes([node, ...node.neighbors]);
        setHighlightedLinks(node.links);
    };

    useEffect(() => {
        if (!fgRef.current) return;
        fgRef.current.zoom(k, 0); // set zoom level without changing position
        fgRef.current.centerAt(x, y, 0); // set position without animation
    }, [width, height]); // We only want to re-zoom on container resize

    const handleNodeClick = (node: NodeObject | null) => {
        if (!node || selectedNode?.id === node?.id) {
            setSelectedNode(null);
            setHighlightedNodes([]);
            setHighlightedLinks([]);
            return;
        }
        setSelectedNode(node);
        setHighlightedNodes([node, ...node.neighbors]);
        setHighlightedLinks(node.links ?? []);

        if (!fgRef.current) return;
        fgRef.current.zoomToFit(
            300,
            100,
            (n) =>
                n.id === node.id ||
                node.neighbors.some(
                    (neighbor: { id: string }) => neighbor.id === n.id,
                ),
        );
    };

    return (
        <div style={{ height: `500px`, position: 'relative' }}>
            <FormatFullScreenMode>
                {/*
                 // @ts-expect-error TS2322 */}
                <div style={styles.container} ref={containerRef}>
                    <AutoComplete
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
                                if (x === 0 && y === 0 && k === 1) return;
                                setK(k);
                                setX(x);
                                setY(y);
                            }}
                            ref={fgRef}
                            width={width}
                            height={height}
                            graphData={{ nodes, links }}
                            nodeCanvasObject={(node, ctx, globalScale) => {
                                if (
                                    highlightedNodes.length === 0 ||
                                    highlightedNodes.some(
                                        (highlightNode) =>
                                            highlightNode.id === node.id,
                                    )
                                ) {
                                    ctx.globalAlpha = 1;
                                } else {
                                    ctx.globalAlpha = 0.1;
                                }
                                const fontSize = 12 / globalScale;
                                const circleRadius = node.radius;

                                ctx.font = `${fontSize}px Sans-Serif`;
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = 'black';
                                ctx.strokeStyle = 'white';
                                ctx.strokeText(
                                    node.label,
                                    node.x!,
                                    node.y + circleRadius + fontSize,
                                );
                                ctx.fillText(
                                    node.label,
                                    // @ts-expect-error TS2345
                                    node.x,
                                    node.y + circleRadius + fontSize,
                                );

                                // @ts-expect-error TS18048
                                ctx.fillStyle = colorSet[0];
                                ctx.beginPath();
                                ctx.arc(
                                    // @ts-expect-error TS2345
                                    node.x,
                                    node.y,
                                    circleRadius,
                                    0,
                                    2 * Math.PI,
                                    false,
                                );
                                ctx.fill();
                                ctx.globalAlpha = 1;
                            }}
                            linkVisibility={(link) =>
                                highlightedLinks.length === 0 ||
                                highlightedLinks.some(
                                    (highlightedLink) =>
                                        highlightedLink.source ===
                                            link.source &&
                                        highlightedLink.target === link.target,
                                )
                                    ? true
                                    : false
                            }
                            onNodeClick={handleNodeClick}
                            onNodeHover={handleNodeHover}
                            enableNodeDrag={false}
                            cooldownTime={cooldownTime}
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

// @ts-expect-error TS2345
export default compose(injectData())(Network);
