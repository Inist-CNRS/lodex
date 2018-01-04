import React, { Component } from 'react';
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
} from 'react-simple-maps';
import mapJson from 'react-simple-maps/topojson-maps/world-50m.json';
import { connect } from 'react-redux';
import { scaleQuantize } from 'd3-scale';
import memoize from 'lodash.memoize';
import PropTypes from 'prop-types';
import { Tooltip, actions } from 'redux-tooltip';
import ZoomIn from 'material-ui/svg-icons/action/zoom-in';
import ZoomOut from 'material-ui/svg-icons/action/zoom-out';
import IconButton from 'material-ui/IconButton';
import compose from 'recompose/compose';

import injectData from '../injectData';
import ColorScaleLegend from '../../lib/components/ColorScaleLegend';
import { fromFields } from '../../sharedSelectors';

const maxZoom = 16;
const minZoom = 1;

const styles = {
    container: {
        width: '100%',
        maxWidth: 980,
        margin: 0,
        fontSize: '1.5rem',
    },
    geography: memoize(({ color, hoverColor }) => ({
        default: {
            fill: color,
            transition: 'fill 0.5s',
            stroke: '#607D8B',
            strokeWidth: 0.75,
            outline: 'none',
        },
        hover: {
            fill: hoverColor,
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
    })),
    composableMap: {
        width: '100%',
        height: 'auto',
    },
    legendColor: color => ({
        display: 'block',
        backgroundColor: color,
        height: '2em',
        width: '100%',
    }),
    legend: {
        display: 'flex',
        width: '100%',
        margin: '20px',
    },
    legendItem: {
        flex: 1,
    },
    zoom: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        right: 0,
    },
    subContainer: {
        position: 'relative',
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

    state = {
        zoom: 1,
        center: [0, 20],
    };

    handleLeave = () => {
        this.props.hideTooltip();
    };

    zoomIn = () => {
        const { zoom, ...state } = this.state;
        this.setState({
            ...state,
            zoom: zoom < maxZoom ? zoom * 2 : zoom,
        });
    };

    zoomOut = () => {
        const { zoom, ...state } = this.state;
        this.setState({
            ...state,
            zoom: zoom > minZoom ? zoom / 2 : zoom,
        });
    };

    render() {
        const {
            chartData,
            maxValue,
            colorScheme,
            hoverColorScheme,
            defaultColor,
        } = this.props;
        if (!colorScheme) {
            return null;
        }

        const { zoom } = this.state;

        const color = scaleQuantize()
            .range(colorScheme)
            .domain([0, maxValue])
            .nice();

        const hoverColor = scaleQuantize()
            .range(hoverColorScheme)
            .domain([0, maxValue])
            .nice();

        return (
            <div style={styles.container} onClick={this.handleZoom}>
                <ColorScaleLegend colorScale={color} />
                <div style={styles.subContainer}>
                    <div style={styles.zoom}>
                        <IconButton
                            disabled={zoom >= maxZoom}
                            onClick={this.zoomIn}
                        >
                            <ZoomIn />
                        </IconButton>
                        <IconButton
                            disabled={zoom <= minZoom}
                            onClick={this.zoomOut}
                        >
                            <ZoomOut />
                        </IconButton>
                    </div>
                    <ComposableMap
                        projectionConfig={projectionConfig}
                        width={980}
                        height={551}
                        style={styles.composableMap}
                    >
                        <ZoomableGroup center={[0, 20]} zoom={this.state.zoom}>
                            <Geographies
                                disableOptimization
                                geography={mapJson}
                            >
                                {(geographies, projection) =>
                                    geographies.map((geography, i) => {
                                        const value =
                                            chartData[
                                                geography.properties.ISO_A3
                                            ];

                                        return (
                                            <Geography
                                                key={`geography-${i}`}
                                                onMouseMove={this.handleMove}
                                                onMouseLeave={this.handleLeave}
                                                cacheId={`geography-${i}`}
                                                geography={geography}
                                                projection={projection}
                                                style={styles.geography({
                                                    color:
                                                        color(value) ||
                                                        defaultColor,
                                                    hoverColor:
                                                        hoverColor(value) ||
                                                        defaultColor,
                                                })}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ZoomableGroup>
                    </ComposableMap>
                </div>
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
    colorScheme: PropTypes.arrayOf(PropTypes.string).isRequired,
    hoverColorScheme: PropTypes.arrayOf(PropTypes.string).isRequired,
    defaultColor: PropTypes.string.isRequired,
};

const mapStateToProps = (state, { chartData, field }) => {
    const {
        colorScheme,
        hoverColorScheme,
        defaultColor,
    } = fromFields.getFieldFormatArgs(state, field.name);

    if (!chartData) {
        return {
            chartData: {},
            maxValue: 0,
            colorScheme,
            hoverColorScheme,
            defaultColor,
        };
    }
    return {
        chartData: chartData
            ? chartData.reduce(
                  (acc, { _id, value }) => ({
                      ...acc,
                      [_id]: value,
                  }),
                  {},
              )
            : null,
        maxValue: chartData.reduce(
            (acc, { value }) => (value > acc ? value : acc),
            0,
        ),
        colorScheme,
        hoverColorScheme,
        defaultColor,
    };
};

const mapSispatchToProps = {
    showTooltip: actions.show,
    hideTooltip: actions.hide,
};

export default compose(
    injectData,
    connect(mapStateToProps, mapSispatchToProps),
)(CartographyView);
