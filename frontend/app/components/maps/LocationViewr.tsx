import { TileLayer, Popup } from "react-leaflet"
import { FiMapPin } from "react-icons/fi"
import { MapContainer } from "react-leaflet"
import { Marker } from "react-leaflet/Marker"
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationViewer = ({ coords, shop }: { coords: { lat: number; lng: number }; shop: any }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 border-4 border-black h-[400px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-0">
                <div className="absolute top-4 left-12 z-[1000] bg-black text-white px-4 py-1 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <FiMapPin /> Physical Location
                </div>
                <MapContainer
                    center={[coords.lat, coords.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    <Marker position={[coords.lat, coords.lng]}>
                        <Popup font-black >
                            {shop.name}
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center space-y-4">
                <h3 className="text-xl font-black uppercase italic">Contact Details</h3>
                <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Coordinates</p>
                    <code className="block bg-gray-100 p-2 text-xs border-2 border-black">
                        LAT: {coords.lat.toFixed(4)} <br />
                        LNG: {coords.lng.toFixed(4)}
                    </code>
                </div>
                <p className="text-sm font-medium italic">"Find us at the heart of the marketplace. Tap the marker for directions."</p>
            </div>
        </div>
    );
}

export default LocationViewer;