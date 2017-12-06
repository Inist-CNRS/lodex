import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { field as fieldPropTypes } from '../../propTypes.js';
import Format from '../Format';
import { fromCharacteristic, fromGraph } from '../selectors';
import GraphItemContainer from './GraphItemContainer';
import { preLoadChartData } from '../graph';

class PureGraphItem extends Component {
    componentDidMount() {
        const { field, resource, preLoadChartData } = this.props;
        if (!field) {
            return;
        }

        preLoadChartData({ field, value: resource[field.name] });
    }
    render() {
        const { field, resource, chartData } = this.props;

        return (
            <GraphItemContainer
                link={`/graph/${field.name}`}
                label={field.label}
            >
                {chartData ? (
                    <Format
                        field={field}
                        resource={resource}
                        chartData={chartData}
                    />
                ) : (
                    <span />
                )}
            </GraphItemContainer>
        );
    }
}

PureGraphItem.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    preLoadChartData: PropTypes.func.isRequired,
    chartData: PropTypes.any,
};

const mapStateToProps = (state, { field }) => ({
    resource: fromCharacteristic.getCharacteristicsAsResource(state),
    chartData: fromGraph.getChartData(state, field.name),
});

const mapDispatchToProps = {
    preLoadChartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(PureGraphItem);
