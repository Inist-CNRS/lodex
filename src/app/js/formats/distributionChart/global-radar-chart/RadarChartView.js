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

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../../propTypes';

const RadarChartView = ({ chartData, colorSet, p: polyglot }) => {
    const color = colorSet[0];
    if (!chartData) {
        return <p>{polyglot.t('no_data')}</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
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
    colorSet: PropTypes.arrayOf(PropTypes.string),
    p: polyglotPropTypes,
};

RadarChartView.defaultProps = {
    className: null,
};

export default translate(RadarChartView);
