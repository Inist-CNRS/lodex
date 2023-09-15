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
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../chartsUtils';
import BarChart from '../../models/BarChart';
import { CustomActionVegaLite } from '../vega-lite-component';
import deepClone from 'lodash.clonedeep';
import InvalidFormat from '../../../InvalidFormat';
import { VEGA_ACTIONS_WIDTH } from '../vega-lite-component/VegaLiteComponent';

const styles = {
    container: {
        userSelect: 'none',
    },
};

class BarChartView extends Component {
    render() {
        const data = this.props.data;
        const { advancedMode, advancedModeSpec, field } = this.props;

        // Create a new bar chart instance

        const barChartSpec = deepClone(new BarChart());

        // Set all bar chart parameter the chosen by the administrator

        barChartSpec.setAxisDirection(
            this.props.direction === 'vertical'
                ? AXIS_VERTICAL
                : AXIS_HORIZONTAL,
        );

        barChartSpec.setOrderBy(lodexOrderToIdOrder(this.props.params.orderBy));
        barChartSpec.setScale(lodexScaleToIdScale(this.props.scale));
        barChartSpec.setColor(this.props.colors);
        barChartSpec.setRoundValue(this.props.axisRoundValue);
        barChartSpec.setTooltip(this.props.tooltip);
        barChartSpec.setTooltipCategory(this.props.tooltipCategory);
        barChartSpec.setTooltipValue(this.props.tooltipValue);
        barChartSpec.setLabels(this.props.labels);
        barChartSpec.setLabelOverlap(this.props.labelOverlap);
        barChartSpec.setSize(this.props.barSize);

        if (this.props.diagonalCategoryAxis)
            barChartSpec.setLabelAngle(AXIS_X, -45);
        if (this.props.diagonalValueAxis)
            barChartSpec.setLabelAngle(AXIS_Y, -45);

        let advanceSpec;

        try {
            advanceSpec = JSON.parse(advancedModeSpec);
        } catch (e) {
            return <InvalidFormat format={field.format} value={e.message} />;
        }

        // return the finish chart
        return (
            <div style={styles.container}>
                {/* Make the chart responsive */}
                <ContainerDimensions>
                    {({ width }) => {
                        const spec = advancedMode
                            ? {
                                  ...advanceSpec,
                                  width: width - VEGA_ACTIONS_WIDTH,
                              }
                            : barChartSpec.buildSpec(width, data.values.length);
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

BarChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    colors: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    diagonalCategoryAxis: PropTypes.bool.isRequired,
    diagonalValueAxis: PropTypes.bool.isRequired,
    scale: PropTypes.string.isRequired,
    params: PropTypes.any.isRequired,
    axisRoundValue: PropTypes.bool.isRequired,
    tooltip: PropTypes.bool.isRequired,
    tooltipCategory: PropTypes.string.isRequired,
    tooltipValue: PropTypes.string.isRequired,
    labels: PropTypes.string.isRequired,
    labelOverlap: PropTypes.string.isRequired,
    barSize: PropTypes.number.isRequired,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
};

BarChartView.defaultProps = {
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

export default compose(injectData(), connect(mapStateToProps))(BarChartView);
