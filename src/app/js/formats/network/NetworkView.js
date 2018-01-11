import React from 'react';
import PropTypes from 'prop-types';
import {
    InteractiveForceGraph,
    ForceGraphNode,
    ForceGraphLink,
} from 'react-vis-force';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import get from 'lodash.get';
import { scaleLinear } from 'd3-scale';

import injectData from '../injectData';
import { fromFields } from '../../sharedSelectors';

const simulationOptions = {
    strength: {
        charge: -1000,
    },
    alpha: 1,
};

const labelOffset = {
    x: ({ radius }) => radius * Math.cos(Math.PI / 4),
    y: ({ radius }) => radius * Math.sin(Math.PI / 4) + 6,
};

const styles = {
    container: {
        overflow: 'hidden',
    },
};

const zoomOptions = { minScale: 0.25, maxScale: 16 };

const Network = ({ nodes, links, nodeColor }) => (
    <div style={styles.container}>
        <InteractiveForceGraph
            simulationOptions={simulationOptions}
            zoom
            showLabels
            zoomOptions={zoomOptions}
            labelAttr="label"
            labelOffset={labelOffset}
            highlightDependencies
        >
            {nodes.map(node => (
                <ForceGraphNode key={node.id} node={node} fill={nodeColor} />
            ))}
            {links.map(link => (
                <ForceGraphLink
                    key={`${link.source}_${link.target}`}
                    link={link}
                />
            ))}
        </InteractiveForceGraph>
    </div>
);

Network.propTypes = {
    nodeColor: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string,
            radius: PropTypes.number,
        }),
    ).isRequired,
    links: PropTypes.arrayOf(
        PropTypes.shape({
            source: PropTypes.string,
            target: PropTypes.string,
            weight: PropTypes.number,
        }),
    ).isRequired,
};

const mapStateToProps = (state, { chartData, field }) => {
    const { nodeColor } = fromFields.getFieldFormatArgs(state, field.name);
    if (!chartData) {
        return {
            nodes: [],
            links: [],
        };
    }

    const nodesDic = chartData.reduce(
        (acc, { source, target, weight }) => ({
            ...acc,
            [source]: {
                id: source,
                label: source,
                radius: get(acc, [source, 'radius'], 0) + weight,
            },
            [target]: {
                id: target,
                label: target,
                radius: get(acc, [target, 'radius'], 0) + weight,
            },
        }),
        {},
    );

    const nodes = Object.values(nodesDic);
    const radiusList = nodes.map(({ radius }) => radius);
    const max = Math.max(...radiusList);
    const min = Math.min(...radiusList);

    const scale = scaleLinear()
        .domain([min, max])
        .range([1, 40]);

    return {
        nodeColor,
        nodes: nodes.map(node => ({
            ...node,
            radius: scale(node.radius),
        })),
        links: chartData.map(({ source, target, weight: value }) => ({
            source,
            target,
            value,
        })),
    };
};

export default compose(injectData, connect(mapStateToProps))(Network);
