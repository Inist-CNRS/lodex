import React from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';  // see vite.config.js
import 'leaflet/dist/leaflet.css';
import './react-leaflet-markercluster.min.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
});

export default function Map({ input = [], width, height, zoom, center }) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width }}
    >
        <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
            {Array().concat(input).filter(item => (item.lat && item.lng)).map((item, index) => {
                 return (
                        <Marker key={index} position={[item.lat, item.lng]}>
                            {item.txt && <Popup>{ item.txt  }</Popup>}
                        </Marker>
                 );
             })}
        </MarkerClusterGroup>
    </MapContainer>
  );
};
Map.propTypes = {
    center: PropTypes.array,
    zoom: PropTypes.number,
    width: PropTypes.string,
    height: PropTypes.string,
    input: PropTypes.arrayOf(PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
        txt: PropTypes.isRequired,
    })),
};


