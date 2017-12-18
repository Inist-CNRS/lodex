import React from 'react';
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

const CartographyView = ({ chartData, maxValue }) => (
    <div style={styles.container}>
        <ComposableMap
            projectionConfig={projectionConfig}
            width={980}
            height={551}
            style={styles.composableMap}
        >
            <ZoomableGroup center={[0, 20]} disablePanning>
                <Geographies disableOptimization geography={mapJson}>
                    {(geographies, projection) =>
                        geographies.map(geography => (
                            <Geography
                                key={`geography-${geography.properties.ABBREV}`}
                                cacheId={`geography-${
                                    geography.properties.ABBREV
                                }`}
                                geography={geography}
                                projection={projection}
                                style={styles.geography({
                                    value:
                                        chartData[
                                            geography.properties.ISO_A3
                                        ] || 0,
                                    maxValue,
                                })}
                            />
                        ))
                    }
                </Geographies>
            </ZoomableGroup>
        </ComposableMap>
    </div>
);

CartographyView.propTypes = {
    chartData: PropTypes.array.isRequired,
    maxValue: PropTypes.number.isRequired,
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

export default connect(mapStateToProps)(CartographyView);
