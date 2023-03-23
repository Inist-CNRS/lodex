import React, { Component } from 'react';
import { CustomActionVegaLite } from '../vega-lite-component';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions';
import deepClone from 'lodash.clonedeep';
import {
    lodexOrderToIdOrder,
    VEGA_LITE_DATA_INJECT_TYPE_A,
} from '../../../chartsUtils';
import BubblePlot from '../../models/BubblePlot';

const styles = {
    container: {
        userSelect: 'none',
    },
};

class BubblePlotView extends Component {
    render() {
        const data = this.props.data;

        // Create a new bubble plot instance

        const bubblePlot = deepClone(new BubblePlot());

        // Set all bubble plot parameter the chosen by the administrator

        bubblePlot.setColor(this.props.colors);
        bubblePlot.setOrderBy(lodexOrderToIdOrder(this.props.params.orderBy));
        bubblePlot.flipAxis(this.props.flipAxis);
        bubblePlot.setTooltip(this.props.tooltip);
        bubblePlot.setTooltipCategory(this.props.tooltipSource);
        bubblePlot.setTooltipTarget(this.props.tooltipTarget);
        bubblePlot.setTooltipValue(this.props.tooltipWeight);

        // return the finish chart
        return (
            <div style={styles.container}>
                <ContainerDimensions>
                    {/* Make the chart responsive */}
                    {({ width }) => {
                        const spec = bubblePlot.buildSpec(width);
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

BubblePlotView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    params: PropTypes.any.isRequired,
    colors: PropTypes.string.isRequired,
    flipAxis: PropTypes.bool.isRequired,
    tooltip: PropTypes.bool.isRequired,
    tooltipSource: PropTypes.string.isRequired,
    tooltipTarget: PropTypes.string.isRequired,
    tooltipWeight: PropTypes.string.isRequired,
};

BubblePlotView.defaultProps = {
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

export default compose(injectData(), connect(mapStateToProps))(BubblePlotView);
