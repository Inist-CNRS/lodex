import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { pack, hierarchy } from 'd3-hierarchy';
import { scaleLinear } from 'd3-scale';
import memoize from 'lodash.memoize';
import { Tooltip, actions } from 'redux-tooltip';
import get from 'lodash.get';

import injectData from '../injectData';
import Bubble from './Bubble';

const styles = {
    container: memoize(({ width, height }) => ({
        position: 'relative',
        width,
        height,
    })),
};

class BubbleView extends React.Component {
    handleMove = event => {
        const x = event.clientX;
        const y = event.clientY + window.pageYOffset;
        const { value, name } = get(event, ['target', 'dataset'], {});

        if (!value && value !== 0) {
            this.props.hideTooltip();
            return;
        }

        this.props.showTooltip({
            origin: { x, y },
            content: (
                <p>
                    {name}: {value}
                </p>
            ),
        });
    };

    handleLeave = () => {
        this.props.hideTooltip();
    };
    render() {
        const { data, width, height } = this.props;
        return (
            <div>
                <div
                    style={styles.container({ width, height })}
                    onMouseMove={this.handleMove}
                    onMouseLeave={this.handleLeave}
                >
                    {data.map(({ data: { _id: key }, r, x, y, value }) => (
                        <Bubble
                            key={key}
                            r={r}
                            x={x}
                            y={y}
                            name={key}
                            value={value}
                        />
                    ))}
                </div>
                <Tooltip />
            </div>
        );
    }
}

BubbleView.propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    hideTooltip: PropTypes.func.isRequired,
    showTooltip: PropTypes.func.isRequired,
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

const mapDispatchToProps = {
    showTooltip: actions.show,
    hideTooltip: actions.hide,
};

export default compose(
    injectData,
    connect(mapStateToProps, mapDispatchToProps),
)(BubbleView);
