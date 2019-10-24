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
    tooltipItem: {
        color: 'black',
    },
};

const BarChartView = ({
    colorSet,
    formatData,
    direction,
    valueAxisProps,
    categoryAxisProps,
    barSize,
    height,
}) => (
    <div style={styles.container}>
        <ResponsiveContainer width="100%" height={height}>
            <BarChart
                data={formatData}
                layout={direction === 'horizontal' ? 'vertical' : 'horizontal'}
                margin={margin}
                maxBarSize={barSize}
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
                />
                <Tooltip itemStyle={styles.tooltipItem} />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="value">
                    {formatData.map((entry, index) => (
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

BarChartView.propTypes = {
    formatData: PropTypes.array.isRequired,
    colorSet: PropTypes.arrayOf(PropTypes.string),
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    categoryMargin: PropTypes.number.isRequired,
    valueMargin: PropTypes.number.isRequired,
    valueAxisProps: PropTypes.any,
    categoryAxisProps: PropTypes.any,
    barSize: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};

export const getValueAxisProps = ({
    diagonalValueAxis,
    direction,
    axisRoundValue,
    scale,
    max = 5,
    valueMargin,
}) => ({
    angle: diagonalValueAxis ? -45 : null,
    textAnchor: diagonalValueAxis
        ? 'end'
        : direction === 'horizontal'
        ? 'middle'
        : 'end',
    type: 'number',
    allowDecimals: !axisRoundValue,
    scale,
    tickCount: max > 5 ? 5 : max + 1,
    domain: scale === 'log' ? ['auto', 'auto'] : [0, 'auto'], // log scale won't work with a domain starting at 0 (`auto` detect the boudaries and ensure it is readable)
    dataKey: 'value',
    [direction === 'horizontal' ? 'height' : 'width']: valueMargin,
});

export const getCategoryAxisProps = ({
    direction,
    diagonalCategoryAxis,
    categoryMargin,
}) => ({
    angle: diagonalCategoryAxis ? -45 : null,
    textAnchor: diagonalCategoryAxis
        ? 'end'
        : direction === 'horizontal'
        ? 'end'
        : 'middle',
    type: 'category',
    dataKey: '_id',
    interval: 0,
    padding: padding,
    [direction === 'horizontal' ? 'width' : 'height']: categoryMargin,
});

const mapStateToProps = (
    state,
    {
        formatData = [],
        axisRoundValue,
        diagonalCategoryAxis,
        diagonalValueAxis,
        scale,
        direction = 'horizontal',
        valueMargin = 120,
        categoryMargin = 120,
        barSize = 20,
    },
) => {
    const valueAxisProps = getValueAxisProps({
        diagonalValueAxis,
        direction,
        axisRoundValue,
        scale,
        max: Math.max(...formatData.map(({ value }) => value)),
        valueMargin: parseInt(valueMargin),
    });

    const categoryAxisProps = getCategoryAxisProps({
        direction,
        diagonalCategoryAxis,
        categoryMargin: parseInt(categoryMargin),
    });

    const height =
        direction === 'horizontal'
            ? formatData.length * (parseInt(barSize) + 8) +
              20 +
              parseInt(valueMargin)
            : 300 + parseInt(categoryMargin);

    return {
        direction,
        valueMargin: parseInt(valueMargin),
        categoryMargin: parseInt(categoryMargin),
        valueAxisProps,
        categoryAxisProps,
        barSize: parseInt(barSize),
        height,
        formatData,
    };
};

export default compose(
    injectData(),
    connect(mapStateToProps),
)(BarChartView);
