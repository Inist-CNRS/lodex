import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import {
    ResponsiveContainer,
    RadarChart,
    Radar,
    PolarAngleAxis,
    PolarRadiusAxis,
    PolarGrid,
} from 'recharts';

import { field as fieldPropTypes } from '../../propTypes';

const RadarChartView = ({ chartData, field }) => {
    const { colors } = field.format.args || { colors: '' };
    const colorsSet = String(colors)
        .split(/[^\w]/)
        .filter(x => x.length > 0)
        .map(x => String('#').concat(x));
    const color = colorsSet[0];

    return (
        <ResponsiveContainer width={600} height={300}>
            <RadarChart data={chartData}>
                <Radar
                    dataKey="value"
                    stroke={color}
                    fill={color}
                    fillOpacity={0.6}
                />
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
            </RadarChart>
        </ResponsiveContainer>
    );
};

RadarChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object,
    resource: PropTypes.object.isRequired,
    chartData: PropTypes.array.isRequired,
};

RadarChartView.defaultProps = {
    className: null,
};

export default translate(RadarChartView);
