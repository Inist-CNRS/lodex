import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    InteractiveForceGraph,
    ForceGraphNode,
    ForceGraphLink,
    createSimulation,
} from 'react-vis-force';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import get from 'lodash.get';
import isEqual from 'lodash.isequal';
import { scaleLinear } from 'd3-scale';

import injectData from '../injectData';
import exportableToPng from '../exportableToPng';
import ReactTooltip from 'react-tooltip';

const simulationOptions = {
    animate: true,
    strength: {
        charge: ({ radius }) => -radius * 100,
    },
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

class Network extends Component {
    createSimulation = options => {
        // extends react-vis-force createSimulation to get a reference on the simulation
        this.simulation = createSimulation(options);

        return this.simulation;
    };

    componentDidUpdate(prevProps) {
        if (isEqual(prevProps, this.props)) {
            return;
        }

        this.simulation.alpha(1).restart(); // reset simulation alpha and restart it to fix animation on node change
    }

    centerGraphClick() {
        // TODO !
    }

    render() {
        const { nodes, links, colorSet, p: polyglot } = this.props;

        return (
            <div style={styles.container}>
                <InteractiveForceGraph
                    simulationOptions={simulationOptions}
                    zoom
                    showLabels
                    zoomOptions={zoomOptions}
                    labelAttr="label"
                    labelOffset={labelOffset}
                    highlightDependencies
                    createSimulation={this.createSimulation}
                >
                    {nodes.map(node => (
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

                {/* 1) MouseIcon */}
                <div>
                    {/* TODO : put svg data in separate file */}
                    <svg
                        data-tip
                        data-for="mouseIconTooltip"
                        width="45"
                        height="45"
                        viewBox="0 0 197.896 197.896"
                    >
                        <path
                            d="M102.004 56.098c-.054-4.559 2.061-8.12 4.119-11.581 2.713-4.574 5.522-9.305 3.568-15.808-1.986-5.966-5.751-8.893-9.087-11.495-4.488-3.482-7.727-5.998-6.038-15.543l.147-.82L89.883 0l-.143.812c-2.201 12.469 3.142 16.617 7.856 20.278 3.042 2.373 5.916 4.61 7.415 9.097 1.31 4.381-.644 7.669-3.11 11.832-2.294 3.869-4.889 8.231-4.828 14.076-24.469.025-49.47 1.041-49.47 88.004 0 39.192 31.49 53.797 51.346 53.797 19.845 0 51.346-14.605 51.346-53.797-.001-86.859-25.479-87.929-48.291-88.001zm-.604 4.907c20.195.043 39.106.845 43.172 57.809-13.814 6.46-28.33 9.896-43.172 10.236v-10.615c3.024-.58 5.3-3.253 5.3-6.378V80.005c0-3.135-2.28-5.801-5.3-6.385V61.005zM97.724 78.38h2.452a1.63 1.63 0 0 1 1.621 1.625v32.052c0 .891-.73 1.607-1.621 1.607h-2.452a1.612 1.612 0 0 1-1.618-1.607V80.005c0-.891.727-1.625 1.618-1.625zm-1.235-17.375V73.62c-3.024.583-5.293 3.257-5.293 6.385v32.052c0 3.124 2.269 5.798 5.293 6.378v10.615c-22.586-.53-39.027-8.06-43.172-10.16 4.048-57.047 22.97-57.842 43.172-57.885zm2.459 131.97c-17.952 0-46.439-13.267-46.439-48.88 0-7.097.161-13.789.48-19.909 7.168 3.325 23.964 9.806 46.053 9.806 15.725 0 31.15-3.343 45.856-9.917.319 6.148.483 12.884.483 20.024-.001 35.609-28.481 48.876-46.433 48.876z"
                            fill="#010002"
                        />
                        <path
                            fill="#010002"
                            d="M114.742 70.936l-4.807 5.87h9.602zM114.913 121.223l4.796-5.869h-9.591z"
                        />
                    </svg>
                    <ReactTooltip id="mouseIconTooltip">
                        <ul>
                            {polyglot.t('user_can_interact_with_mouse_1')}
                            {<br />}
                            {polyglot.t('user_can_interact_with_mouse_2')}
                        </ul>
                    </ReactTooltip>
                </div>
            </div>
        );
    }
}

Network.propTypes = {
    colorSet: PropTypes.arrayOf(PropTypes.string),
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
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (state, { formatData }) => {
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
        nodes: nodes.map(node => ({
            ...node,
            radius: nodeScale(node.radius),
        })),
        links: sanitizedFormatData.map(({ source, target, weight }) => ({
            source,
            target,
            value: linkScale(weight),
        })),
    };
};

export default compose(
    injectData(),
    connect(mapStateToProps),
    exportableToPng,
)(Network);
