import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { field as fieldPropTypes } from '../propTypes.js';
import { fromCharacteristic, fromGraph } from '../public/selectors';
import { preLoadChartData } from '../public/graph';

export default FormatView => {
    class GraphItem extends Component {
        static propTypes = {
            field: fieldPropTypes.isRequired,
            resource: PropTypes.object.isRequired,
            preLoadChartData: PropTypes.func.isRequired,
            chartData: PropTypes.any,
        };
        componentDidMount() {
            const { field, resource, preLoadChartData } = this.props;
            if (!field) {
                return;
            }

            preLoadChartData({ field, value: resource[field.name] });
        }
        render() {
            const { preLoadChartData, chartData, ...props } = this.props;

            return <FormatView {...props} chartData={chartData} />;
        }
    }

    const mapStateToProps = (state, { field }) => ({
        resource: fromCharacteristic.getCharacteristicsAsResource(state),
        chartData: fromGraph.getChartData(state, field.name),
    });

    const mapDispatchToProps = {
        preLoadChartData,
    };

    return connect(mapStateToProps, mapDispatchToProps)(GraphItem);
};
