import React, { Component } from 'react';
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
} from 'react-simple-maps';
import mapJson from 'react-simple-maps/topojson-maps/world-50m.json';
import { connect } from 'react-redux';
import { scaleLinear } from 'd3-scale';
import { schemeBlues, schemeOrRd } from 'd3-scale-chromatic';
import { grey100 } from 'material-ui/styles/colors';
import memoize from 'lodash.memoize';
import PropTypes from 'prop-types';
import { Tooltip, actions } from 'redux-tooltip';

const color = scaleLinear()
    .domain([0, 21])
    .range(schemeOrRd[3]);

const hoverColor = scaleLinear()
    .domain([0, 21])
    .range(schemeBlues[3]);

const styles = {
    container: {
        width: '100%',
        maxWidth: 980,
        margin: 0,
    },
    geography: memoize(({ value, maxValue }) => {
        color.domain([0, maxValue]);
        hoverColor.domain([0, maxValue]);

        return {
            default: {
                fill: value === 0 ? grey100 : color(value),
                transition: 'fill 0.5s',
                stroke: '#607D8B',
                strokeWidth: 0.75,
                outline: 'none',
            },
            hover: {
                fill: value === 0 ? grey100 : hoverColor(value),
                stroke: '#607D8B',
                strokeWidth: 0.75,
                outline: 'none',
            },
            pressed: {
                fill: '#263238',
                stroke: '#607D8B',
                strokeWidth: 0.75,
                outline: 'none',
            },
        };
    }),
    composableMap: {
        width: '100%',
        height: 'auto',
    },
};

const projectionConfig = {
    scale: 205,
    rotation: [-11, 0, 0],
};

class CartographyView extends Component {
    handleMove = (data, event) => {
        const x = event.clientX;
        const y = event.clientY + window.pageYOffset;
        const value = this.props.chartData[data.properties.ISO_A3];
        if (!value) {
            return;
        }
        this.props.showTooltip({
            origin: { x, y },
            content: (
                <dl>
                    <dt>{data.properties.NAME}</dt>
                    <dd>{value}</dd>
                </dl>
            ),
        });
    };
    handleLeave = () => {
        this.props.hideTooltip();
    };
    render() {
        const { chartData, maxValue } = this.props;

        return (
            <div style={styles.container}>
                <ComposableMap
                    projectionConfig={projectionConfig}
                    width={980}
                    height={551}
                    style={styles.composableMap}
                >
                    <ZoomableGroup disablePanning center={[0, 20]}>
                        <Geographies disableOptimization geography={mapJson}>
                            {(geographies, projection) =>
                                geographies.map(
                                    (geography, i) =>
                                        geography.id !== 'ATA' && (
                                            <Geography
                                                key={`geography-${i}`}
                                                onMouseMove={this.handleMove}
                                                onMouseLeave={this.handleLeave}
                                                cacheId={`geography-${i}`}
                                                geography={geography}
                                                projection={projection}
                                                style={styles.geography({
                                                    value:
                                                        chartData[
                                                            geography.properties
                                                                .ISO_A3
                                                        ] || 0,
                                                    maxValue,
                                                })}
                                            />
                                        ),
                                )
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
                <Tooltip />
            </div>
        );
    }
}

CartographyView.propTypes = {
    chartData: PropTypes.object.isRequired,
    maxValue: PropTypes.number.isRequired,
    showTooltip: PropTypes.func.isRequired,
    hideTooltip: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { chartData }) => {
    if (!chartData) {
        return {
            chartData: {},
            maxValue: 0,
        };
    }
    return {
        chartData: chartData
            ? chartData.reduce(
                  (acc, { name, value }) => ({
                      ...acc,
                      [name]: value,
                  }),
                  {},
              )
            : null,
        maxValue: chartData.reduce(
            (acc, { value }) => (value > acc ? value : acc),
            0,
        ),
    };
};

const mapSispatchToProps = {
    showTooltip: actions.show,
    hideTooltip: actions.hide,
};

export default connect(mapStateToProps, mapSispatchToProps)(CartographyView);
