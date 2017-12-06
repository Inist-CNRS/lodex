import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

import { field as fieldPropTypes } from '../../propTypes';
import CustomizedLabel from './CustomizedLabel';

const PieChartView = ({ field, chartData }) => {
    const { colors } = field.format.args || { colors: '' };
    const colorsSet = String(colors)
        .split(/[^\w]/)
        .filter(x => x.length > 0)
        .map(x => String('#').concat(x));

    return (
        <ResponsiveContainer className="lodex-chart" width={600} height={300}>
            <PieChart>
                <Legend
                    verticalAlign="middle"
                    layout="vertical"
                    align="right"
                />
                <Pie
                    cx={155}
                    data={chartData}
                    fill="#8884d8"
                    outerRadius="63%"
                    labelLine
                    label={CustomizedLabel}
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            key={String(index).concat('_cell_pie')}
                            fill={colorsSet[index % colorsSet.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

PieChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    chartData: PropTypes.array.isRequired,
};

PieChartView.defaultProps = {
    className: null,
};

export default translate(PieChartView);
