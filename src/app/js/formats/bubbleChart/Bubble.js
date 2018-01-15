import React from 'react';
import memoize from 'lodash.memoize';
import { hsl } from 'd3-color';
import { scaleOrdinal } from 'd3-scale';
import { schemeAccent } from 'd3-scale-chromatic';
import PropTypes from 'prop-types';

const colorScale = scaleOrdinal(schemeAccent);

const styles = {
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

const Bubble = ({ r, x, y, name, value }) => (
    <div
        style={styles.leaf({ r, x, y }, name)}
        data-value={value}
        data-name={name}
    >
        {r > 10 && (
            <div
                style={styles.leafLabel({ r, x, y })}
                data-value={value}
                data-name={name}
            >
                {name}
            </div>
        )}
    </div>
);

Bubble.propTypes = {
    r: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
};

export default Bubble;
