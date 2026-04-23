import { TileLayer, Popup, MapContainer, Marker } from "react-leaflet";
import { FiMapPin, FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { renderToString } from 'react-dom/server'; // Required to convert Icon to string
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 1. Create the Custom Neo-Brutalist Shop Icon
const shopMarkerIcon = L.divIcon({
    html: renderToString(
        <div style={{
            backgroundColor: '#facc15', // yellow-400
            // border: '3px solid black',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 0.48)',
            borderRadius: '9999px',
            transform: 'translate(-50%, -50%)' // Center the box over coordinates
        }}>
            <FiShoppingCart color="black" size={24} />
        </div>
    ),
    className: 'custom-shop-icon', // Clear default leaflet styles
    iconSize: [40, 40],
    iconAnchor: [20, 20], // Point of the icon which will correspond to marker's location
});

const LocationViewer = ({ coords, shop }: { coords: { lat: number; lng: number }; shop: any }) => {
    return (
        <div className="grid grid-cols-1 gap-6">
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
                        url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                        maxZoom={20}
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        attribution="&copy; Google"
                    />

                    {/* 2. Apply the custom shopMarkerIcon here */}
                    <Marker
                        position={[coords.lat, coords.lng]}
                        icon={shopMarkerIcon}
                    >
                        <Popup>
                            <div className="font-black uppercase text-center">
                                <p className="border-b-2 border-black mb-1">{shop.name}</p>
                                <p className="text-[10px] text-gray-500">Verified Vendor</p>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
}

export default LocationViewer;