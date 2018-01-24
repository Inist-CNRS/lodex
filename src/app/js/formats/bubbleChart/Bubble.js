import React from 'react';
import memoize from 'lodash.memoize';
import { hsl } from 'd3-color';
import PropTypes from 'prop-types';

const styles = {
    leaf: memoize(({ x, y, r }, name, color, style) => ({
        ...style,
        position: 'absolute',
        top: x - r,
        left: y - r,
        width: r * 2,
        height: r * 2,
        backgroundColor: color,
        color: hsl(color).l > 0.57 ? '#222' : '#fff',
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

const Bubble = ({ r, x, y, name, value, color, style }) => (
    <div
        style={styles.leaf({ r, x, y }, name, color, style)}
        data-value={value}
        data-name={name}
    >
        {r > 10 && (
            <div
                style={styles.leafLabel({ r, x, y }, color)}
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
    color: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
};

export default Bubble;
