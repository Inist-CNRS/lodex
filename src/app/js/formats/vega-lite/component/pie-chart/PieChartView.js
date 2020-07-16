import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import PieChart from '../../models/PieChart';
import { CustomActionVegaLite } from '../vega-lite-component';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

class PieChartView extends Component {
    render() {
        const data = this.props.data;

        // Create a new bar chart instance

        const pieChart = new PieChart();

        // enable the orderBy in vega-lite

        let count = 1;
        data.values.forEach(e => {
            e.order = count++;
        });

        // Set all barchart parameter the chosen by the administrator

        pieChart.setTooltip(this.props.tooltip);
        pieChart.setTooltipCategory(this.props.tooltipCategory);
        pieChart.setTooltipValue(this.props.tooltipValue);
        pieChart.setColor(this.props.colors);

        // return the finish chart
        return (
            <div style={styles.container}>
                {/* Make the chart responsive */}
                <ContainerDimensions>
                    {({ width }) => {
                        const spec = pieChart.buildSpec(width);
                        return <CustomActionVegaLite spec={spec} data={data} />;
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
