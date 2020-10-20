import React, { Component } from 'react';
import { CustomActionVegaLite } from '../vega-lite-component';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import HeatMap from '../../models/HeatMap';
import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions';
import deepClone from 'lodash.clonedeep';
import {
    lodexOrderToIdOrder,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../chartsUtils';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

class HeatMapView extends Component {
    render() {
        const data = this.props.data;

        // Create a new heat map instance

        const heatMap = deepClone(new HeatMap());

        // Set all heat map parameter the chosen by the administrator

        heatMap.setColor(this.props.colorScheme.join(' '));
        heatMap.setOrderBy(lodexOrderToIdOrder(this.props.params.orderBy));
        heatMap.flipAxis(this.props.flipAxis);
        heatMap.setTooltip(this.props.tooltip);
        heatMap.setTooltipCategory(this.props.tooltipSource);
        heatMap.setTooltipTarget(this.props.tooltipTarget);
        heatMap.setTooltipValue(this.props.tooltipWeight);

        // return the finish chart
        return (
            <div style={styles.container}>
                <ContainerDimensions>
                    {/* Make the chart responsive */}
                    {({ width }) => {
                        const spec = heatMap.buildSpec(width);
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

HeatMapView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    params: PropTypes.any.isRequired,
    colorScheme: PropTypes.arrayOf(PropTypes.string).isRequired,
    flipAxis: PropTypes.bool.isRequired,
    tooltip: PropTypes.bool.isRequired,
    tooltipSource: PropTypes.string.isRequired,
    tooltipTarget: PropTypes.string.isRequired,
    tooltipWeight: PropTypes.string.isRequired,
};

HeatMapView.defaultProps = {
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

export default compose(injectData(), connect(mapStateToProps))(HeatMapView);
