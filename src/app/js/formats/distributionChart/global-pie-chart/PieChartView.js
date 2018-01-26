import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import compose from 'recompose/compose';

import { field as fieldPropTypes } from '../../../propTypes';
import injectData from '../../injectData';
import exportableToPng from '../../exportableToPng';

const styles = {
    container: {
        fontSize: '1.5rem',
    },
};

const PieChartView = ({ formatData = [], colorSet }) => (
    <div style={styles.container}>
        <ResponsiveContainer className="lodex-chart" width="100%" height={300}>
            <PieChart>
                <Legend
                    verticalAlign="middle"
                    layout="vertical"
                    align="right"
                />
                <Pie
                    cx={155}
                    data={formatData}
                    nameKey="_id"
                    fill="#8884d8"
                    outerRadius="63%"
                    labelLine
                    label
                >
                    {formatData.map((entry, index) => (
                        <Cell
                            key={String(index).concat('_cell_pie')}
                            fill={colorSet[index % colorSet.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    </div>
);

PieChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    formatData: PropTypes.array,
    colorSet: PropTypes.arrayOf(PropTypes.string),
};

export default compose(injectData(), exportableToPng)(PieChartView);
