import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// @ts-expect-error TS7016
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
// @ts-expect-error TS7016
import './leaflet.css';
// @ts-expect-error TS7016
import './react-leaflet-markercluster.min.css';
// @ts-expect-error TS7016
import L from 'leaflet';

declare const __VITE_PORT__: string | null;

const assetBase = __VITE_PORT__ ? `http://localhost:${__VITE_PORT__}` : '';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: `${assetBase}/icons/marker-icon-2x.png`,
    iconUrl: `${assetBase}/icons/marker-icon.png`,
    shadowUrl: `${assetBase}/icons/marker-shadow.png`,
});

export default function Map({
    input = [],
    width,
    height,
    zoom,
    center,
    // @ts-expect-error TS2304
}: MapProps) {
    return (
        <MapContainer
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
                            <Marker key={index} position={[item.lat, item.lng]}>
                                {/*
                                // @ts-expect-error TS2322 */}
                                {item.txt && <Popup>{item.txt}</Popup>}
                            </Marker>
                        );
                    })}
            </MarkerClusterGroup>
        </MapContainer>
    );
}
