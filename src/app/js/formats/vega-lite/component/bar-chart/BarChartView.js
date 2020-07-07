import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import injectData from '../../../injectData';
import { field as fieldPropTypes } from '../../../../propTypes';
import ContainerDimensions from 'react-container-dimensions';
import {
    AXIS_HORIZONTAL,
    AXIS_VERTICAL,
    AXIS_X,
    AXIS_Y,
    lodexOrderToIdOrder,
    lodexScaleToIdScale,
    PADDING_BOTTOM,
    PADDING_LEFT,
} from '../../chartsUtils';
import BarChart from '../../models/BarChart';
import { CustomActionVegaLite } from '../vega-component';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

class BarChartView extends Component {
    render() {
        let data = this.props.data;
        let barChartSpec = new BarChart();

        barChartSpec.setAxisDirection(
            this.props.direction === 'vertical'
                ? AXIS_VERTICAL
                : AXIS_HORIZONTAL,
        );

        barChartSpec.setOrderBy(lodexOrderToIdOrder(this.props.params.orderBy));
        barChartSpec.setScale(lodexScaleToIdScale(this.props.scale));
        barChartSpec.setColor(this.props.colors);
        barChartSpec.setPadding(PADDING_LEFT, this.props.categoryMargin);
        barChartSpec.setPadding(PADDING_BOTTOM, this.props.valueMargin);
        barChartSpec.setRoundValue(this.props.axisRoundValue);
        barChartSpec.setTooltip(this.props.tooltip);
        barChartSpec.setTooltipCategory(this.props.tooltipCategory);
        barChartSpec.setTooltipValue(this.props.tooltipValue);
        barChartSpec.setLabels(this.props.labels);

        const diagCat = this.props.diagonalCategoryAxis;
        if (diagCat) barChartSpec.setLabelAngle(AXIS_X, -45);
        const diagVal = this.props.diagonalValueAxis;
        if (diagVal) barChartSpec.setLabelAngle(AXIS_Y, -45);

        let spec = barChartSpec.buildSpec();

        return (
            <div style={styles.container}>
                <ContainerDimensions>
                    {({ width }) => {
                        spec.width =
                            width -
                            (this.props.direction !== 'vertical'
                                ? width * 0.26 + (width <= 820 ? 80 : 0)
                                : width * 0.09);
                        spec.height =
                            (this.props.direction !== 'vertical' ? 20 : 0) *
                                this.props.params.maxSize +
                            300;
                        return <CustomActionVegaLite spec={spec} data={data} />;
                    }}
                </ContainerDimensions>
            </div>
        );
    }
}

BarChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    colors: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    diagonalCategoryAxis: PropTypes.bool.isRequired,
    diagonalValueAxis: PropTypes.bool.isRequired,
    categoryMargin: PropTypes.string.isRequired,
    valueMargin: PropTypes.string.isRequired,
    scale: PropTypes.string.isRequired,
    params: PropTypes.any.isRequired,
    axisRoundValue: PropTypes.bool.isRequired,
    tooltip: PropTypes.bool.isRequired,
    tooltipCategory: PropTypes.string.isRequired,
    tooltipValue: PropTypes.string.isRequired,
    labels: PropTypes.string.isRequired,
};

BarChartView.defaultProps = {
    className: null,
};

const mapStateToProps = (state, { formatData }) => {
    if (!formatData) {
        return {};
    }
    return {
        data: {
            values: formatData,
        },
    };
};

export default compose(injectData(), connect(mapStateToProps))(BarChartView);
