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
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import injectData from '../../injectData';
import { fromFields } from '../../../sharedSelectors';

const margin = {
    top: 10,
    right: 10,
    left: 10,
    bottom: 10,
};
const padding = { top: 3, bottom: 3 };

const styles = {
    container: {
        fontSize: '1.5rem',
        margin: '10px',
    },
};

const BarChartView = ({
    colorSet,
    chartData,
    axisRoundValue,
    diagonalValueAxis,
    diagonalCategoryAxis,
    scale,
    direction,
    rightMargin,
    max,
}) => {
    const valueAxisProps = {
        angle: diagonalValueAxis && -45,
        textAnchor: 'end',
        type: 'number',
        allowDecimals: !axisRoundValue,
        scale,
        tickCount: max > 5 ? 5 : max + 1,
        domain: scale === 'log' ? ['auto', 'auto'] : [0, 'auto'], // log scale won't work with a domain starting at 0 (`auto` detect the boudaries and ensure it is readable)
        dataKey: 'value',
    };

    const categoryAxisProps = {
        angle: diagonalCategoryAxis && -45,
        textAnchor: 'end',
        type: 'category',
        dataKey: '_id',
        interval: 0,
    };

    return (
        <div style={styles.container}>
            <ResponsiveContainer
                width="100%"
                height={
                    direction === 'horizontal' ? chartData.length * 40 : 300
                }
            >
                <BarChart
                    data={chartData}
                    layout={
                        direction === 'horizontal' ? 'vertical' : 'horizontal'
                    }
                    margin={margin}
                    maxBarSize={10}
                >
                    <XAxis
                        {...(direction === 'horizontal'
                            ? valueAxisProps
                            : categoryAxisProps)}
                        padding={padding}
                    />
                    <YAxis
                        {...(direction === 'horizontal'
                            ? categoryAxisProps
                            : valueAxisProps)}
                        width={parseInt(rightMargin)}
                        padding={padding}
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
        </div>
    );
};

BarChartView.propTypes = {
    linkedResource: PropTypes.object,
    resource: PropTypes.object.isRequired,
    chartData: PropTypes.array.isRequired,
    colorSet: PropTypes.arrayOf(PropTypes.string),
    axisRoundValue: PropTypes.bool,
    diagonalValueAxis: PropTypes.bool,
    diagonalCategoryAxis: PropTypes.bool,
    scale: PropTypes.oneOf(['linear', 'log']),
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    rightMargin: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
};

BarChartView.defaultProps = {
    className: null,
};

const mapStateToProps = (state, { field, chartData }) => {
    const {
        axisRoundValue,
        diagonalCategoryAxis,
        diagonalValueAxis,
        scale,
        direction = 'horizontal',
        rightMargin = 120,
    } = fromFields.getFieldFormatArgs(state, field.name);

    return {
        axisRoundValue,
        diagonalCategoryAxis,
        diagonalValueAxis,
        scale,
        direction,
        rightMargin: parseInt(rightMargin),
        max: Math.max(...chartData.map(({ value }) => value)),
    };
};

export default compose(injectData, connect(mapStateToProps))(BarChartView);
