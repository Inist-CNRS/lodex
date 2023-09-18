import React, { Component } from 'react';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../../../propTypes';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions';
import { CustomActionVega } from '../vega-component';
import FlowMap from '../../models/FlowMap';
import { VEGA_DATA_INJECT_TYPE_B } from '../../../chartsUtils';
import { schemeBlues } from 'd3-scale-chromatic';
import MouseIcon from '../../../shared/MouseIcon';
import InvalidFormat from '../../../InvalidFormat';
import { VEGA_ACTIONS_WIDTH } from '../../../vega-lite/component/vega-lite-component/VegaLiteComponent';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

class FlowMapView extends Component {
    render() {
        const { advancedMode, advancedModeSpec, field, data } = this.props;

        // Create a new flow map instance

        const flowMap = new FlowMap();

        // Set all flow map parameter the chosen by the administrator

        flowMap.setTooltip(this.props.tooltip);
        flowMap.setTooltipCategory(this.props.tooltipCategory);
        flowMap.setTooltipValue(this.props.tooltipValue);
        flowMap.setColor(this.props.color.split(' ')[0]);
        flowMap.setColorScheme(
            this.props.colorScheme !== undefined
                ? this.props.colorScheme
                : schemeBlues[9].split(' '),
        );

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
                                  height: width * 0.6,
                              }
                            : flowMap.buildSpec(width, data.values.length);
                        return (
                            <CustomActionVega
                                spec={spec}
                                data={data}
                                injectType={VEGA_DATA_INJECT_TYPE_B}
                            />
                        );
                    }}
                </ContainerDimensions>
                <MouseIcon polyglot={this.props.p} />
            </div>
        );
    }
}

FlowMapView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    tooltip: PropTypes.bool.isRequired,
    tooltipCategory: PropTypes.string.isRequired,
    tooltipValue: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    colorScheme: PropTypes.arrayOf(PropTypes.string).isRequired,
    p: polyglotPropTypes.isRequired,
    advancedMode: PropTypes.bool,
    advancedModeSpec: PropTypes.string,
};

FlowMapView.defaultProps = {
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

export default compose(injectData(), connect(mapStateToProps))(FlowMapView);
