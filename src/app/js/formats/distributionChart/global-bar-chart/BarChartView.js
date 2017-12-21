import React from 'react';
import PropTypes from 'prop-types';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';
import get from 'lodash.get';

import { field as fieldPropTypes } from '../../../propTypes';
import injectData from '../../injectData';

const margin = {
    top: 15,
    right: 50,
    left: 0,
    bottom: 0,
};
const padding = { top: 3, bottom: 3 };

const BarChartView = ({ colorSet, chartData, field }) => {
    const axisRoundValue = get(field, 'format.args.axisRoundValue');
    const scale = get(field, 'format.args.scale');
    const direction = get(field, 'format.args.direction', 'horizontal');
    const rightMargin = get(field, 'format.args.rightMargin', 120);
    const max = Math.max(...chartData.map(({ value }) => value));

    const valueAxisProps = {
        type: 'number',
        allowDecimals: !axisRoundValue,
        scale,
        tickCount: max > 5 ? 5 : max + 1,
        domain: scale === 'log' ? ['auto', 'auto'] : [0, 'auto'], // log scale won't work with a domain starting at 0 (`auto` detect the boudaries and ensure it is readable)
        dataKey: 'value',
    };

    const categoryAxisProps = {
        type: 'category',
        dataKey: 'name',
        interval: 0,
        padding: padding,
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={chartData}
                layout={direction === 'horizontal' ? 'vertical' : 'horizontal'}
                margin={margin}
                maxBarSize={10}
            >
                <XAxis
                    {...(direction === 'horizontal'
                        ? valueAxisProps
                        : categoryAxisProps)}
                />
                <YAxis
                    {...(direction === 'horizontal'
                        ? categoryAxisProps
                        : valueAxisProps)}
                    width={parseInt(rightMargin)}
                />
                <Tooltip />
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
};

BarChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object,
    resource: PropTypes.object.isRequired,
    chartData: PropTypes.array.isRequired,
    colorSet: PropTypes.arrayOf(PropTypes.string),
    axisRoundValue: PropTypes.bool,
};

BarChartView.defaultProps = {
    className: null,
};

export default injectData(BarChartView);
