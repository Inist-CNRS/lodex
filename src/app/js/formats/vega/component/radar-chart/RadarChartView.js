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

        if (data !== undefined) {
            data.values.forEach(e => {
                e.category = 0;
            });
        }

        const radarChart = new RadarChart();
        radarChart.setColors(this.props.colors.split(' '));
        radarChart.setTooltip(this.props.tooltip);
        radarChart.setTooltipCategory(this.props.tooltipCategory);
        radarChart.setTooltipValue(this.props.tooltipValue);

        return (
            <div style={styles.container}>
                <ContainerDimensions>
                    {({ width }) => {
                        const spec = radarChart.buildSpec(width);
                        spec.data.forEach(e => {
                            if (e.name === 'table') {
                                e.values = data.values;
                            }
                        });
                        return <CustomActionVega spec={spec} data={data} />;
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
