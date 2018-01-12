import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { pack, hierarchy } from 'd3-hierarchy';
import { scaleLinear } from 'd3-scale';

import injectData from '../injectData';

const styles = {
    container: ({ width, height }) => ({
        position: 'relative',
        width,
        height,
    }),
    leaf: ({ x, y, r }) => ({
        position: 'absolute',
        top: x - r,
        left: y - r,
        width: r * 2,
        height: r * 2,
        backgroundColor: 'red',
        alignItems: 'center',
        borderRadius: '100%',
        display: 'flex',
        justifyContent: 'center',
    }),
    leafLabel: ({ r }) => ({
        overflow: 'hidden',
        padding: '10px',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        fontSize: r / 5,
        whiteSpace: 'nowrap',
    }),
};

class BubbleView extends React.Component {
    render() {
        const { data, width, height } = this.props;
        return (
            <div style={styles.container({ width, height })}>
                {data.map(({ data, ...props }) => (
                    <div key={data._id} style={styles.leaf(props)}>
                        <div style={styles.leafLabel(props)}>{data._id}</div>
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
