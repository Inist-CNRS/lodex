import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
// @ts-expect-error TS7016
import { pack, hierarchy } from 'd3-hierarchy';
import memoize from 'lodash/memoize';

import injectData from '../../injectData';
import Bubble from './Bubble';
import { getColor } from '../../utils/colorUtils';
import FormatFullScreenMode from '../../utils/components/FormatFullScreenMode';

const styles = {
    container: memoize(({ diameter }) => ({
        position: 'relative',
        width: diameter,
        height: diameter,
        overflow: 'hidden',
    })),
};

// @ts-expect-error TS7031
export const BubbleView = ({ data, diameter, colorSet }) => (
    <FormatFullScreenMode>
        {/* 
        // @ts-expect-error TS7006 */}
        <div style={styles.container({ diameter })}>
            {/*
             // @ts-expect-error TS7031 */}
            {data.map(({ data: { _id: key }, r, x, y, value }, index) => (
                <Bubble
                    key={key}
                    r={r}
                    x={x}
                    y={y}
                    name={key}
                    value={value}
                    color={getColor(colorSet, index)}
                />
            ))}
        </div>
    </FormatFullScreenMode>
);

BubbleView.propTypes = {
    data: PropTypes.array.isRequired,
    diameter: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    colorSet: PropTypes.arrayOf(PropTypes.string),
};

BubbleView.displayName = 'BubbleView';

// @ts-expect-error TS7006
const mapStateToProps = (_, { formatData, diameter: stringDiameter }) => {
    const diameter = parseInt(stringDiameter, 10);
    if (!formatData) {
        return {
            data: [],
            diameter,
        };
    }

    const packingFunction = pack().size([diameter, diameter]).padding(5);

    const root = hierarchy({ name: 'root', children: formatData })
        // @ts-expect-error TS7006
        .sum((d) => d.value)
        // @ts-expect-error TS7006
        .sort((a, b) => b.value - a.value);
    const data = packingFunction(root).leaves();

    return {
        data,
        diameter,
    };
};

export default compose(injectData(), connect(mapStateToProps))(BubbleView);
