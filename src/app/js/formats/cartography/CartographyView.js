import React from 'react';
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
} from 'react-simple-maps';
import mapJson from 'react-simple-maps/topojson-maps/world-50m.json';

const styles = {
    container: {
        width: '100%',
        maxWidth: 980,
        margin: 0,
    },
    geography: {
        default: {
            fill: '#ECEFF1',
            stroke: '#607D8B',
            strokeWidth: 0.75,
            outline: 'none',
        },
        hover: {
            fill: '#607D8B',
            stroke: '#607D8B',
            strokeWidth: 0.75,
            outline: 'none',
        },
        pressed: {
            fill: '#FF5722',
            stroke: '#607D8B',
            strokeWidth: 0.75,
            outline: 'none',
        },
    },
    composableMap: {
        width: '100%',
        height: 'auto',
    },
};

const projectionConfig = {
    scale: 205,
    rotation: [-11, 0, 0],
};

const CartographyView = () => (
    <div style={styles.container}>
        <ComposableMap
            projectionConfig={projectionConfig}
            width={980}
            height={551}
            style={styles.composableMap}
        >
            <ZoomableGroup center={[0, 20]} disablePanning>
                <Geographies geography={mapJson}>
                    {(geographies, projection) =>
                        geographies.map((geography, i) => (
                            <Geography
                                key={i}
                                geography={geography}
                                projection={projection}
                                style={styles.geography}
                            />
                        ))
                    }
                </Geographies>
            </ZoomableGroup>
        </ComposableMap>
    </div>
);

export default CartographyView;
