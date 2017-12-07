import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    CartesianGrid,
    XAxis,
    YAxis,
} from 'recharts';

import { field as fieldPropTypes } from '../../propTypes';

const BarChartView = ({ colorSet, chartData }) => (
    <ResponsiveContainer width={600} height={300}>
        <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 15, right: 50, left: 0, bottom: 0 }}
            maxBarSize={10}
        >
            <XAxis type="number" dataKey="value" />
            <YAxis
                type="category"
                dataKey="name"
                interval={0}
                padding={{ top: 3, bottom: 3 }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="value" fill="#8884d8">
                {chartData.map((entry, index) => (
                    <Cell
                        key={String(index).concat('_cell_bar')}
                        fill={colorSet[index % colorSet.length]}
                    />
                ))}
            </Bar>
        </BarChart>
    </ResponsiveContainer>
);

BarChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object,
    resource: PropTypes.object.isRequired,
    chartData: PropTypes.array.isRequired,
    colorSet: PropTypes.arrayOf(PropTypes.string),
};

BarChartView.defaultProps = {
    className: null,
};

export default translate(BarChartView);
