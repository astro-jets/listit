import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { FiMapPin } from 'react-icons/fi';
import L from 'leaflet';

// --- Leaflet Assets ---
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapController = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 13);
    }, [center, map]);
    return null;
};

interface ShopLocationData {
    shopName: string;
    shopBio: string;
    lat: number;
    lng: number;
    logo: File | null;
}

// Added optional initialCoords prop
interface LocationSelectorProps {
    onComplete: (data: ShopLocationData) => void;
    initialCoords?: { lat: number; lng: number };
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onComplete, initialCoords }) => {
    // Default fallback position
    const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);

    // Handle initial coordinates or geolocation logic
    useEffect(() => {
        if (initialCoords) {
            // Priority 1: Use provided coordinates
            setPosition([initialCoords.lat, initialCoords.lng]);
        } else if ("geolocation" in navigator) {
            // Priority 2: Use browser geolocation
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude]);
                },
                (err) => {
                    console.warn("Could not get location, using default", err);
                }
            );
        }
    }, [initialCoords]); // Re-run if initialCoords change

    // Communicate back to parent
    useEffect(() => {
        onComplete({
            shopName: '',
            shopBio: '',
            lat: position[0],
            lng: position[1],
            logo: null
        });
    }, [position[0], position[1], onComplete]); // Specific dependencies to prevent loop

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
            },
        });
        return <Marker position={position} />;
    };

    return (
        <div className="w-full h-full space-y-4">
            <div className="space-y-4">
                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                    <FiMapPin className="text-yellow-500" /> Shop Location
                </h2>

                <div className="h-[400px] w-full relative z-0 overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <MapContainer
                        center={position}
                        zoom={14}
                        scrollWheelZoom={false}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                            maxZoom={20}
                            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                            attribution="&copy; Google"
                        />
                        <MapController center={position} />
                        <LocationMarker />
                    </MapContainer>
                </div>

                {/* Coordinate Readout */}
                <div className="flex gap-2">
                    <div className="flex-1 border-2 border-black bg-black text-yellow-400 p-2 text-center">
                        <span className="text-[9px] block font-black opacity-50 uppercase">Latitude</span>
                        <span className="font-mono font-bold">{position[0].toFixed(6)}</span>
                    </div>
                    <div className="flex-1 border-2 border-black bg-black text-yellow-400 p-2 text-center">
                        <span className="text-[9px] block font-black opacity-50 uppercase">Longitude</span>
                        <span className="font-mono font-bold">{position[1].toFixed(6)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationSelector;