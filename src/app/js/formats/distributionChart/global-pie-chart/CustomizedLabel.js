import React from 'react';
import PropTypes from 'prop-types';

const RADIAN = Math.PI / 180;

const CustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.25;
    const x = cx + radius * Math.cos(-1 * midAngle * RADIAN);
    const y = cy + radius * Math.sin(-1 * midAngle * RADIAN);
    const per100 = (percent * 100).toFixed(0);
    return (
        <text
            x={x}
            y={y}
            fill="#000"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
        >
            {per100}%
        </text>
    );
};

CustomizedLabel.propTypes = {
    cx: PropTypes.number.isRequired,
    cy: PropTypes.number.isRequired,
    midAngle: PropTypes.number.isRequired,
    innerRadius: PropTypes.number.isRequired,
    outerRadius: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
};

CustomizedLabel.defaultProps = {};

export default CustomizedLabel;
