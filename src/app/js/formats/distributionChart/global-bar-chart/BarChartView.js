import React, { Component } from 'react';
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
    Tooltip,
} from 'recharts';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../../propTypes';

const margin = {
    top: 15,
    right: 50,
    left: 0,
    bottom: 0,
};
const padding = { top: 3, bottom: 3 };

class BarChartView extends Component {
    handleClickBar = ({ name: value }) => {
        const { resource, field, toggleFacetValue } = this.props;
        const match = resource[field.name].match(
            /^\/api\/run\/distinct-by\/(.*?)\//,
        );

        if (!match) {
            console.warn('Could not retrieve name of facet from uri');
            return;
        }
        const name = match[1];
        toggleFacetValue({ name, value });
    };

    render() {
        const { colorSet, chartData, p: polyglot } = this.props;
        if (!chartData) {
            return <p>{polyglot.t('no_data')}</p>;
        }

        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={margin}
                    maxBarSize={10}
                >
                    <XAxis type="number" dataKey="value" />
                    <YAxis
                        type="category"
                        dataKey="name"
                        interval={0}
                        padding={padding}
                        width={120}
                        tickFormatter={v => v.toLowerCase()}
                    />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar
                        dataKey="value"
                        fill="#8884d8"
                        onClick={this.handleClickBar}
                    >
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
    }
}

BarChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object,
    resource: PropTypes.object.isRequired,
    chartData: PropTypes.array.isRequired,
    colorSet: PropTypes.arrayOf(PropTypes.string),
    toggleFacetValue: PropTypes.func.isRequired,
    p: polyglotPropTypes,
};

BarChartView.defaultProps = {
    className: null,
};

export default translate(BarChartView);
