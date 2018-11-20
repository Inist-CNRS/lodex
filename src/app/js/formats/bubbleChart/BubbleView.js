import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { pack, hierarchy } from 'd3-hierarchy';
import { scaleOrdinal } from 'd3-scale';
import memoize from 'lodash.memoize';
import { schemeAccent } from 'd3-scale-chromatic';
import Transition from 'react-inline-transition-group';

import injectData from '../injectData';
import exportableToPng from '../exportableToPng';
import Bubble from './Bubble';

const styles = {
    container: memoize(({ diameter }) => ({
        position: 'relative',
        width: diameter,
        height: diameter,
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

export const BubbleView = ({ data, diameter, colorScale }) => (
    <div>
        <Transition
            style={styles.container({ diameter })}
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
    </div>
);

BubbleView.propTypes = {
    data: PropTypes.array.isRequired,
    diameter: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    colorScale: PropTypes.func,
};

BubbleView.displayName = 'BubbleView';

const mapStateToProps = (
    state,
    { formatData, diameter: stringDiameter, colorScheme },
) => {
    const diameter = parseInt(stringDiameter, 10);
    const colorScale = scaleOrdinal(colorScheme || schemeAccent);
    if (!formatData) {
        return {
            data: [],
            diameter,
            colorScale,
        };
    }

    const packingFunction = pack()
        .size([diameter, diameter])
        .padding(5);

    const root = hierarchy({ name: 'root', children: formatData })
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    const data = packingFunction(root).leaves();

    return {
        data,
        diameter,
        colorScale,
    };
};

export default compose(
    injectData(),
    connect(mapStateToProps),
    exportableToPng,
)(BubbleView);
