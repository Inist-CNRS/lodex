import React, { useEffect, useMemo, useState } from 'react';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import {
    InteractiveForceGraph,
    ForceGraphNode,
    ForceGraphLink,
    createSimulation,
    updateSimulation,
} from 'react-vis-force';
import compose from 'recompose/compose';
import get from 'lodash/get';
import { scaleLinear } from 'd3-scale';

import injectData from '../../injectData';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';
import MouseIcon from '../../utils/components/MouseIcon';
import PropTypes from 'prop-types';

const simulationOptions = {
    animate: true,
    strength: {
        charge: ({ radius }) => -radius * 100,
    },
    width: '100%',
};

const labelOffset = {
    x: ({ radius }) => radius * Math.cos(Math.PI / 4),
    y: ({ radius }) => radius * Math.sin(Math.PI / 4) + 6,
};

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

const zoomOptions = { minScale: 0.25, maxScale: 16 };

const Network = ({ formatData, p, colorSet }) => {
    const [simulation, setSimulation] = useState();

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

        const nodeScale = scaleLinear()
            .domain([min, max])
            .range([min === max ? 50 : 10, 50]);

        const weightList = sanitizedFormatData.map(({ weight }) => weight);
        const maxWeight = Math.max(...weightList);
        const minWeight = Math.min(...weightList);

        const linkScale = scaleLinear()
            .domain([minWeight, maxWeight])
            .range([1, 20]);

        return {
            nodes: nodes.map((node) => ({
                ...node,
                radius: nodeScale(node.radius),
            })),
            links: sanitizedFormatData.map(({ source, target, weight }) => ({
                source,
                target,
                value: linkScale(weight),
            })),
        };
    }, [formatData]);

    useEffect(() => {
        if (!simulation) {
            return;
        }

        simulation.alpha(1).restart();
    }, [simulation, nodes, links]);

    return (
        <FormatFullScreenMode>
            <div style={styles.container}>
                <InteractiveForceGraph
                    simulationOptions={simulationOptions}
                    zoom
                    showLabels
                    zoomOptions={zoomOptions}
                    labelAttr="label"
                    labelOffset={labelOffset}
                    highlightDependencies
                    createSimulation={(options) => {
                        const sim = createSimulation(options);
                        setSimulation(sim);

                        return sim;
                    }}
                    updateSimulation={(options, data) => {
                        const sim = updateSimulation(options, data);
                        setSimulation(sim);

                        return sim;
                    }}
                >
                    {nodes.map((node) => (
                        <ForceGraphNode
                            key={node.id}
                            node={node}
                            fill={colorSet[0]}
                        />
                    ))}
                    {links.map((link, index) => (
                        <ForceGraphLink
                            key={`${link.source}_${link.target}_${index}`}
                            link={link}
                        />
                    ))}
                </InteractiveForceGraph>

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
