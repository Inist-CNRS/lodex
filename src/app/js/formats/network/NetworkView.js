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

import injectData from '../injectData';

const simulationOptions = {
    strength: {
        charge: -1000,
    },
    alpha: 1,
};

const styles = {
    container: {
        overflow: 'hidden',
    },
};

const zoomOptions = { minScale: 0.25, maxScale: 16 };

const Network = ({ nodes, links }) => (
    <div style={styles.container}>
        <InteractiveForceGraph
            simulationOptions={simulationOptions}
            zoom
            showLabels
            zoomOptions={zoomOptions}
            labelAttr="label"
            highlightDependencies
        >
            {nodes.map(node => (
                <ForceGraphNode key={node.id} node={node} fill="red" />
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

const mapStateToProps = (state, { chartData }) => {
    if (!chartData) {
        return {
            nodes: [],
            links: [],
        };
    }

    const nodesDic = chartData.reduce(
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

    return {
        nodes,
        links: chartData.map(({ source, target, weight: value }) => ({
            source,
            target,
            value,
        })),
    };
};

export default compose(injectData, connect(mapStateToProps))(Network);
