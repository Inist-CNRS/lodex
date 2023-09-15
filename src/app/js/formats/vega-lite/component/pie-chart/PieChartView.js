import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import PieChart from '../../models/PieChart';
import { CustomActionVegaLite } from '../vega-lite-component';
import { VEGA_LITE_DATA_INJECT_TYPE_A } from '../../../chartsUtils';
import deepClone from 'lodash.clonedeep';

const styles = {
    container: {
        userSelect: 'none',
    },
};

class PieChartView extends Component {
    render() {
        const data = this.props.data;

        // Create a new pie chart instance

        const pieChart = deepClone(new PieChart());

        // enable the orderBy in vega-lite

        let count = 1;
        data.values.forEach(e => {
            e.order = count++;
        });

        // Set all pie chart parameter the chosen by the administrator

        pieChart.setTooltip(this.props.tooltip);
        pieChart.setTooltipCategory(this.props.tooltipCategory);
        pieChart.setTooltipValue(this.props.tooltipValue);
        pieChart.setColor(this.props.colors);
        pieChart.setLabels(this.props.labels);

        // return the finish chart
        return (
            <div style={styles.container}>
                {/* Make the chart responsive */}
                <ContainerDimensions>
                    {({ width }) => {
                        const spec = pieChart.buildSpec(width);
                        return (
                            <CustomActionVegaLite
                                spec={spec}
                                data={data}
                                injectType={VEGA_LITE_DATA_INJECT_TYPE_A}
                            />
                        );
                    }}
                </ContainerDimensions>
            </div>
        );
    }
}

PieChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    colors: PropTypes.string.isRequired,
    tooltip: PropTypes.bool.isRequired,
    tooltipCategory: PropTypes.string.isRequired,
    tooltipValue: PropTypes.string.isRequired,
    labels: PropTypes.bool.isRequired,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
};

PieChartView.defaultProps = {
    className: null,
};

const mapStateToProps = (state, { formatData }) => {
    if (!formatData) {
        return {
            data: {
                values: [],
            },
        };
    }
    return {
        data: {
            values: formatData,
        },
    };
};

export default compose(injectData(), connect(mapStateToProps))(PieChartView);
