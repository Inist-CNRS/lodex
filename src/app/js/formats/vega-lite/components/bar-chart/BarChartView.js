import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { VegaLite } from 'react-vega';
import injectData from '../../../injectData';
import { field as fieldPropTypes } from '../../../../propTypes';
import ContainerDimensions from 'react-container-dimensions';
import BasicBarChart from "../../models/BasicBarChart";
import {
    AXIS_HORIZONTAL,
    AXIS_VERTICAL,
    AXIS_X,
    AXIS_Y,
    lodexOrderToIdOrder, lodexScaleToIdScale,
    PADDING_BOTTOM,
    PADDING_LEFT
} from "../../chartsUtils";

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

class BarChartView extends Component {
    render() {
        let data = this.props.data;
        let barChartSpec = new BasicBarChart();

        barChartSpec.setAxisDirection(this.props.direction === 'vertical' ? AXIS_VERTICAL : AXIS_HORIZONTAL);
        barChartSpec.setOrderBy(lodexOrderToIdOrder(this.props.params.orderBy));
        barChartSpec.setScale(lodexScaleToIdScale(this.props.scale));
        barChartSpec.setColor(this.props.colors);
        barChartSpec.setPadding(PADDING_LEFT, this.props.categoryMargin);
        barChartSpec.setPadding(PADDING_BOTTOM, this.props.valueMargin);

        if (this.props.diagonalCategoryAxis)
            barChartSpec.setLabelAngle(AXIS_X, -45)
        if (this.props.diagonalValueAxis)
            barChartSpec.setLabelAngle(AXIS_Y, -45)

        let spec = barChartSpec.buildSpec();

        return (
            <div  style={styles.container}>
                <ContainerDimensions>
                    {({width}) => {
                        spec.width = width - (width / 8);
                        spec.height = 320;
                        return <VegaLite spec={spec} data={data}/>
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
    categoryMargin: PropTypes.number.isRequired,
    valueMargin: PropTypes.number.isRequired,
    scale: PropTypes.string.isRequired
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
