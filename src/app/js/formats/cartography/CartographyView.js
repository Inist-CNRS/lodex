import React, { Component } from 'react';
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
} from 'react-simple-maps';
import { connect } from 'react-redux';
import memoize from 'lodash.memoize';
import PropTypes from 'prop-types';
import { ZoomIn, ZoomOut } from '@material-ui/icons';
import IconButton from 'material-ui/IconButton';
import compose from 'recompose/compose';
import ReactTooltip from 'react-tooltip';

import injectData from '../injectData';
import getGradientScaleAndLegend from '../../lib/components/getGradientScaleAndLegend';
import exportableToPng from '../exportableToPng';
import mapJson from './world-50m.json';

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
    state = {
        zoom: 1,
        center: [0, 20],
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
        const { formatData, legend, colorScale, hoverColorScale } = this.props;
        if (!colorScale) {
            return null;
        }

        const { zoom } = this.state;

        return (
            <div style={styles.container} onClick={this.handleZoom}>
                {legend}
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
                                            formatData[
                                                geography.properties.ISO_A3
                                            ];

                                        return (
                                            <Geography
                                                key={`geography-${i}`}
                                                data-for="cartography"
                                                data-tip={
                                                    value
                                                        ? `${geography.properties.NAME},${value}`
                                                        : undefined
                                                }
                                                cacheId={`geography-${i}`}
                                                geography={geography}
                                                projection={projection}
                                                style={styles.geography({
                                                    color: colorScale(value),
                                                    hoverColor: hoverColorScale(
                                                        value,
                                                    ),
                                                })}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ZoomableGroup>
                    </ComposableMap>
                </div>
                <ReactTooltip
                    id="cartography"
                    type="light"
                    getContent={data => {
                        if (!data) {
                            return;
                        }
                        const [name, value] = data.split(',');

                        return (
                            <div>
                                <p>{name}</p>
                                <p>{value}</p>
                            </div>
                        );
                    }}
                />
            </div>
        );
    }
}

CartographyView.propTypes = {
    formatData: PropTypes.object.isRequired,
    legend: PropTypes.element,
    showTooltip: PropTypes.func.isRequired,
    hideTooltip: PropTypes.func.isRequired,
    colorScale: PropTypes.func,
    hoverColorScale: PropTypes.func,
};

const mapStateToProps = (
    state,
    { formatData, colorScheme, hoverColorScheme },
) => {
    if (!formatData) {
        return {
            formatData: {},
            maxValue: 0,
        };
    }

    const maxValue = formatData.reduce(
        (acc, { value }) => (value > acc ? value : acc),
        0,
    );

    const { colorScale, hoverColorScale, legend } = getGradientScaleAndLegend({
        colorScheme,
        hoverColorScheme,
        maxValue,
    });

    return {
        formatData: formatData
            ? formatData.reduce(
                  (acc, { _id, value }) => ({
                      ...acc,
                      [_id]: value,
                  }),
                  {},
              )
            : null,
        maxValue: formatData.reduce(
            (acc, { value }) => (value > acc ? value : acc),
            0,
        ),
        colorScale,
        hoverColorScale,
        legend,
    };
};

const mapDispatchToProps = {};

export default compose(
    injectData(),
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    exportableToPng,
)(CartographyView);
