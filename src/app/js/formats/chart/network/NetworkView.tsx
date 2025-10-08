// @ts-expect-error TS7016
import { scaleLinear } from 'd3-scale';
import get from 'lodash/get';
// @ts-expect-error TS6133
import React, {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import compose from 'recompose/compose';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

import PropTypes from 'prop-types';
import { useTranslate } from '../../../i18n/I18NContext';
import Loading from '../../../lib/components/Loading';
import injectData from '../../injectData';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import MouseIcon from '../../utils/components/MouseIcon';

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

// @ts-expect-error TS7031
const Network = ({ formatData, p, colorSet }) => {
    const { translate } = useTranslate();
    const [{ width, height }, setDimensions] = useState({
        width: 0,
        height: 0,
    });
    const [cooldownTime, setCooldownTime] = useState(10000);
    const [selectedNode, setSelectedNode] = useState(null);
    const [highlightedNodes, setHighlightedNodes] = useState([]);
    const [highlightedLinks, setHighlightedLinks] = useState([]);

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

    const { nodes, links } = useMemo(() => {
        if (!formatData) {
            return {
                nodes: [],
                links: [],
            };
        }
        const sanitizedFormatData = formatData.filter(
            // @ts-expect-error TS7031
            ({ source, target }) => source && target,
        );

        const nodesDic = sanitizedFormatData.reduce(
            // @ts-expect-error TS7006
            (acc, { source, target }) => ({
                ...acc,
                [source]: {
                    id: source,
                    label: source,
                    radius: get(acc, [source, 'radius'], 0) + 1,
                },
                [target]: {
                    id: target,
                    label: target,
                    radius: get(acc, [target, 'radius'], 0) + 1,
                },
            }),
            {},
        );

        const nodes = Object.values(nodesDic);
        // @ts-expect-error TS2345
        const radiusList = nodes.map(({ radius }) => radius);
        // @ts-expect-error TS2345
        const max = Math.max(...radiusList);
        // @ts-expect-error TS2345
        const min = Math.min(...radiusList);

        const nodeScale = scaleLinear().domain([min, max]).range([1, 10]);

        // @ts-expect-error TS7031
        const weightList = sanitizedFormatData.map(({ weight }) => weight);
        const maxWeight = Math.max(...weightList);
        const minWeight = Math.min(...weightList);

        const linkScale = scaleLinear()
            .domain([minWeight, maxWeight])
            .range([1, 20]);

        // @ts-expect-error TS7031
        const links = sanitizedFormatData.map(({ source, target, weight }) => ({
            source,
            target,
            value: linkScale(weight),
        }));

        // @ts-expect-error TS7006
        links.forEach((link) => {
            // @ts-expect-error TS18046
            const a = nodes.find((node) => node.id === link.source);
            // @ts-expect-error TS18046
            const b = nodes.find((node) => node.id === link.target);
            // @ts-expect-error TS18046
            if (!a.neighbors) {
                // @ts-expect-error TS18046
                a.neighbors = [];
            }
            // @ts-expect-error TS18046
            if (!b.neighbors) {
                // @ts-expect-error TS18046
                b.neighbors = [];
            }
            // @ts-expect-error TS18046
            a.neighbors.push(b);
            // @ts-expect-error TS18046
            b.neighbors.push(a);

            // @ts-expect-error TS18046
            if (!a.links) {
                // @ts-expect-error TS18046
                a.links = [];
            }
            // @ts-expect-error TS18046
            if (!b.links) {
                // @ts-expect-error TS18046
                b.links = [];
            }
            // @ts-expect-error TS18046
            a.links.push(link);
            // @ts-expect-error TS18046
            b.links.push(link);
        });

        return {
            nodes: nodes.map((node) => ({
                // @ts-expect-error TS2698
                ...node,
                // @ts-expect-error TS18046
                radius: nodeScale(node.radius),
            })),
            links,
        };
    }, [formatData]);

    // @ts-expect-error TS7006
    const handleNodeHover = (node) => {
        // freeze the chart so that it does not rearrange itself every time we interact with it
        setCooldownTime(0);
        if (selectedNode) {
            if (!node) {
                // @ts-expect-error TS2322
                setHighlightedNodes([selectedNode, ...selectedNode.neighbors]);
                // @ts-expect-error TS2339
                setHighlightedLinks(selectedNode.links);
                return;
            }
            if (
                highlightedNodes.some(
                    // @ts-expect-error TS2339
                    (highlightedNode) => highlightedNode.id === node.id,
                )
            ) {
                return;
            }

            setHighlightedNodes([
                selectedNode,
                // @ts-expect-error TS2322
                ...selectedNode.neighbors,
                // @ts-expect-error TS2322
                node,
            ]);
            return;
        }

        if (!node) {
            setHighlightedNodes([]);
            setHighlightedLinks([]);
            return;
        }
        // @ts-expect-error TS2322
        setHighlightedNodes([node, ...node.neighbors]);
        setHighlightedLinks(node.links);
    };

    // @ts-expect-error TS7006
    const handleNodeClick = (node) => {
        // @ts-expect-error TS2339
        if (!node || selectedNode?.id === node?.id) {
            setSelectedNode(null);
            setHighlightedNodes([]);
            setHighlightedLinks([]);
            return;
        }
        setSelectedNode(node);
        // @ts-expect-error TS2322
        setHighlightedNodes([node, ...node.neighbors]);
        setHighlightedLinks(node.links);
    };

    return (
        <div style={{ height: `500px`, position: 'relative' }}>
            <FormatFullScreenMode>
                {/*
                 // @ts-expect-error TS2322 */}
                <div style={styles.container} ref={containerRef}>
                    <Suspense
                        fallback={<Loading>{translate('loading')}</Loading>}
                    >
                        <ForceGraph2D
                            width={width}
                            height={height}
                            graphData={{ nodes, links }}
                            nodeCanvasObject={(node, ctx, globalScale) => {
                                if (
                                    highlightedNodes.length === 0 ||
                                    highlightedNodes.some(
                                        (highlightNode) =>
                                            // @ts-expect-error TS2339
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
                                ctx.fillText(
                                    node.label,
                                    // @ts-expect-error TS2345
                                    node.x,
                                    node.y + circleRadius + fontSize,
                                );

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
                                        // @ts-expect-error TS2339
                                        highlightedLink.source ===
                                            link.source &&
                                        // @ts-expect-error TS2339
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
                        {<MouseIcon polyglot={p} />}
                    </div>
                </div>
            </FormatFullScreenMode>
        </div>
    );
};

Network.propTypes = {
    colorSet: PropTypes.arrayOf(PropTypes.string),
    formatData: PropTypes.arrayOf({
        // @ts-expect-error TS2353
        source: PropTypes.string.isRequired,
        target: PropTypes.string.isRequired,
    }),
    p: polyglotPropTypes.isRequired,
};

// @ts-expect-error TS2345
export default compose(injectData())(Network);
