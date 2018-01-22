import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { pack, hierarchy } from 'd3-hierarchy';
import { scaleOrdinal } from 'd3-scale';
import memoize from 'lodash.memoize';
import { Tooltip, actions } from 'redux-tooltip';
import get from 'lodash.get';
import { schemeAccent } from 'd3-scale-chromatic';
import Transition from 'react-inline-transition-group';

import injectData from '../injectData';
import Bubble from './Bubble';
import { fromFields } from '../../sharedSelectors';

const styles = {
    container: memoize(({ width, height }) => ({
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
    })),

    base: {
        opacity: 0,
        transition: 'all 500ms',
    },

    appear: {
        opacity: 1,
    },

    leave: {
        opacity: 0,
    },
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
        const { data, width, height, colorScale } = this.props;
        return (
            <div>
                <Transition
                    style={styles.container({ width, height })}
                    onMouseMove={this.handleMove}
                    onMouseLeave={this.handleLeave}
                    childrenStyles={{
                        base: styles.base,
                        appear: styles.appear,
                        enter: styles.appear,
                        leave: styles.leave,
                    }}
                >
                    {data.map(({ data: { _id: key }, r, x, y, value }) => (
                        <Bubble
                            key={key}
                            r={r}
                            x={x}
                            y={y}
                            name={key}
                            value={value}
                            color={colorScale(key)}
                        />
                    ))}
                </Transition>
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
    colorScale: PropTypes.func.isRequired,
};

BubbleView.displayName = 'BubbleView';

const mapStateToProps = (state, { chartData, field }) => {
    const {
        width = 500,
        height = 500,
        colorScheme,
    } = fromFields.getFieldFormatArgs(state, field.name);
    if (!chartData) {
        return {
            data: [],
        };
    }

    const packingFunction = pack()
        .size([width, height])
        .padding(5);

    const root = hierarchy({ name: 'root', children: chartData })
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    const data = packingFunction(root).leaves();

    const colorScale = scaleOrdinal(colorScheme || schemeAccent);

    return {
        data,
        width,
        height,
        colorScale,
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
