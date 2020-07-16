import React, { Component } from 'react';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { field as fieldPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions';
import { CustomActionVega } from '../vega-component';
import RadarChart from '../../models/RadarChart';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

class RadarChartView extends Component {
    render() {
        let data = this.props.data;

        // format the data for the vega template

        if (data !== undefined) {
            data.values.forEach(e => {
                e.category = 0;
            });
        }

        // Create a new bar chart instance

        const radarChart = new RadarChart();

        // Set all barchart parameter the chosen by the administrator

        radarChart.setColors(this.props.colors.split(' '));
        radarChart.setTooltip(this.props.tooltip);
        radarChart.setTooltipCategory(this.props.tooltipCategory);
        radarChart.setTooltipValue(this.props.tooltipValue);

        // return the finish chart
        return (
            <div style={styles.container}>
                {/* Make the chart responsive */}
                <ContainerDimensions>
                    {({ width }) => {
                        const spec = radarChart.buildSpec(width);
                        /* add the data into the vega chart  */
                        spec.data.forEach(e => {
                            if (e.name === 'table') {
                                e.values = data.values;
                            }
                        });
                        return <CustomActionVega spec={spec} />;
                    }}
                </ContainerDimensions>
            </div>
        );
    }
}

RadarChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    colors: PropTypes.string.isRequired,
    tooltip: PropTypes.bool.isRequired,
    tooltipCategory: PropTypes.string.isRequired,
    tooltipValue: PropTypes.string.isRequired,
};

RadarChartView.defaultProps = {
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

export default compose(injectData(), connect(mapStateToProps))(RadarChartView);
