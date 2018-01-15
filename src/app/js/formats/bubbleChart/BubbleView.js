import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { pack, hierarchy } from 'd3-hierarchy';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { schemeAccent } from 'd3-scale-chromatic';
import memoize from 'lodash.memoize';
import { hsl } from 'd3-color';

import injectData from '../injectData';

const colorScale = scaleOrdinal(schemeAccent);

const styles = {
    container: memoize(({ width, height }) => ({
        position: 'relative',
        width,
        height,
    })),
    leaf: memoize(({ x, y, r }, name) => ({
        position: 'absolute',
        top: x - r,
        left: y - r,
        width: r * 2,
        height: r * 2,
        backgroundColor: colorScale(name),
        color: hsl(colorScale(name)).l > 0.57 ? '#222' : '#fff',
        alignItems: 'center',
        borderRadius: '100%',
        display: 'flex',
        justifyContent: 'center',
    })),
    leafLabel: memoize(({ r }) => ({
        overflow: 'hidden',
        padding: '10px',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        fontSize: r / 3,
    })),
};

class BubbleView extends React.Component {
    render() {
        const { data, width, height } = this.props;
        return (
            <div style={styles.container({ width, height })}>
                {data.map(({ data, ...props }) => (
                    <div key={data._id} style={styles.leaf(props, data._id)}>
                        {props.r > 10 && (
                            <div style={styles.leafLabel(props)}>
                                {data._id}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }
}

BubbleView.propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};

BubbleView.displayName = 'BubbleView';

const mapStateToProps = (state, { chartData, width = 500, height = 500 }) => {
    if (!chartData) {
        return {
            data: [],
        };
    }

    const values = chartData.map(({ value }) => value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const radiusScale = scaleLinear()
        .range([5, 100])
        .domain([min, max]);
    const packingFunction = pack()
        .radius(node => radiusScale(node.value))
        .size([width, height])
        .padding(5);

    const root = hierarchy({ name: 'root', children: chartData })
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    const data = packingFunction(root).leaves();

    return {
        data,
        steps: 50,
        width,
        height,
    };
};

export default compose(injectData, connect(mapStateToProps))(BubbleView);
