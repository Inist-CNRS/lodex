import React from 'react';
// @ts-expect-error TS7016
import memoize from 'lodash/memoize';
// @ts-expect-error TS7016
import { hsl } from 'd3-color';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import ReactTooltip from 'react-tooltip';

const styles = {
    // @ts-expect-error TS7031
    leaf: memoize(({ x, y, r }, name, color) => ({
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
    // @ts-expect-error TS7031
    leafLabel: memoize(({ r }) => ({
        overflow: 'hidden',
        padding: '10px',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        fontSize: r / 3,
    })),
};

// @ts-expect-error TS7031
const Bubble = ({ r, x, y, name, value, color }) => (
    <div
        style={styles.leaf({ r, x, y }, name, color)}
        data-tip={`${name}: ${value}`}
        data-for={`bubble-${name}`}
        data-iscapture="true"
    >
        {r > 10 && (
            <div style={styles.leafLabel({ r, x, y }, color)}>{name}</div>
        )}
        <ReactTooltip
            id={`bubble-${name}`}
            place="top"
            type="light"
            effect="float"
            // @ts-expect-error TS7006
            getContent={(dataTip) => dataTip}
        />
    </div>
);

Bubble.propTypes = {
    r: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
};

export default Bubble;
