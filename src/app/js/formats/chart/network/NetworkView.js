import React, { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import compose from 'recompose/compose';
import get from 'lodash/get';
import { scaleLinear } from 'd3-scale';

import injectData from '../../injectData';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import MouseIcon from '../../utils/components/MouseIcon';
import PropTypes from 'prop-types';
import Loading from '../../../lib/components/Loading';
import { useTranslate } from '../../../i18n/I18NContext';

const ForceGraph2D = lazy(
    () => import(/* webpackMode: "eager" */ 'react-force-graph-2d'),
);

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
        width: '100%',
    },
};

const Network = ({ formatData, p, colorSet }) => {
    const { translate } = useTranslate();
    const [cooldownTime, setCooldownTime] = useState(10000);
    const [selectedNode, setSelectedNode] = useState(null);
    const [highlightedNodes, setHighlightedNodes] = useState([]);
    const [highlightedLinks, setHighlightedLinks] = useState([]);

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
            ({ source, target }) => source && target,
        );

        const nodesDic = sanitizedFormatData.reduce(
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
        const radiusList = nodes.map(({ radius }) => radius);
        const max = Math.max(...radiusList);
        const min = Math.min(...radiusList);

        const nodeScale = scaleLinear().domain([min, max]).range([1, 10]);

        const weightList = sanitizedFormatData.map(({ weight }) => weight);
        const maxWeight = Math.max(...weightList);
        const minWeight = Math.min(...weightList);

        const linkScale = scaleLinear()
            .domain([minWeight, maxWeight])
            .range([1, 20]);

        const links = sanitizedFormatData.map(({ source, target, weight }) => ({
            source,
            target,
            value: linkScale(weight),
        }));

        links.forEach((link) => {
            const a = nodes.find((node) => node.id === link.source);
            const b = nodes.find((node) => node.id === link.target);
            !a.neighbors && (a.neighbors = []);
            !b.neighbors && (b.neighbors = []);
            a.neighbors.push(b);
            b.neighbors.push(a);

            !a.links && (a.links = []);
            !b.links && (b.links = []);
            a.links.push(link);
            b.links.push(link);
        });

        return {
            nodes: nodes.map((node) => ({
                ...node,
                radius: nodeScale(node.radius),
            })),
            links,
        };
    }, [formatData]);

    const handleNodeHover = (node) => {
        // freeze the chart so that it does not rearrange itself every time we interact with it
        setCooldownTime(0);
        if (selectedNode) {
            if (!node) {
                setHighlightedNodes([selectedNode, ...selectedNode.neighbors]);
                setHighlightedLinks(selectedNode.links);
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

    const handleNodeClick = (node) => {
        if (!node || selectedNode?.id === node?.id) {
            setSelectedNode(null);
            setHighlightedNodes([]);
            setHighlightedLinks([]);
            return;
        }
        setSelectedNode(node);
        setHighlightedNodes([node, ...node.neighbors]);
        setHighlightedLinks(node.links);
    };

    return (
        <FormatFullScreenMode>
            <div style={styles.container}>
                <Suspense fallback={<Loading>{translate('loading')}</Loading>}>
                    <ForceGraph2D
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
                            ctx.fillText(
                                node.label,
                                node.x,
                                node.y + circleRadius + fontSize,
                            );

                            ctx.fillStyle = colorSet[0];
                            ctx.beginPath();
                            ctx.arc(
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
                                    highlightedLink.source === link.source &&
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

                <div>{<MouseIcon polyglot={p} />}</div>
            </div>
        </FormatFullScreenMode>
    );
};

Network.propTypes = {
    colorSet: PropTypes.arrayOf(PropTypes.string),
    formatData: PropTypes.arrayOf({
        source: PropTypes.string.isRequired,
        target: PropTypes.string.isRequired,
    }),
    p: polyglotPropTypes.isRequired,
};

export default compose(injectData())(Network);
