// @ts-expect-error TS6133
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster'; // see vite.config.js
// @ts-expect-error TS7016
import 'leaflet/dist/leaflet.css';
// @ts-expect-error TS7016
import './react-leaflet-markercluster.min.css';
// @ts-expect-error TS7016
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL(
        'leaflet/dist/images/marker-icon-2x.png',
        import.meta.url,
    ).toString(),
    iconUrl: new URL(
        'leaflet/dist/images/marker-icon.png',
        import.meta.url,
    ).toString(),
    shadowUrl: new URL(
        'leaflet/dist/images/marker-shadow.png',
        import.meta.url,
    ).toString(),
});

interface MapProps {
    center?: unknown[];
    zoom?: number;
    width?: string;
    height?: string;
    input?: {
        lat: number;
        lng: number;
        txt: unknown;
    }[];
}

export default function Map({
    input = [],
    width,
    height,
    zoom,
    center
}: MapProps) {
    return (
        (<MapContainer
            // @ts-expect-error TS2322
            center={center}
            zoom={zoom}
            style={{ height, width }}
        >
            <TileLayer
                // @ts-expect-error TS2322
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup>
                {[]
                    .concat(input)
                    // @ts-expect-error TS7031
                    .filter((item) => item.lat && item.lng)
                    .map((item, index) => {
                        return (
                            // @ts-expect-error TS2322
                            (<Marker key={index} position={[item.lat, item.lng]}>
                                {/* 
                                // @ts-expect-error TS2322 */}
                                {item.txt && <Popup>{item.txt}</Popup>}
                            </Marker>)
                        );
                    })}
            </MarkerClusterGroup>
        </MapContainer>)
    );
}
