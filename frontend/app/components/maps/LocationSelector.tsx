import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { FiShoppingBag, FiArrowRight, FiMapPin, FiInfo, FiImage } from 'react-icons/fi';
import L from 'leaflet';

// --- Leaflet Assets ---
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Helper to update map center dynamically ---
const MapController = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 13);
    }, [center, map]);
    return null;
};

// --- Types ---
interface ShopLocationData {
    shopName: string;
    shopBio: string;
    lat: number;
    lng: number;
    logo: File | null;
}

interface LocationSelectorProps {
    onComplete: (data: ShopLocationData) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onComplete }) => {
    const [shopName, setShopName] = useState('');
    const [shopBio, setShopBio] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);

    // --- Get User Location on Mount ---
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude]);
                },
                (err) => {
                    console.warn("Could not get location, using default", err);
                }
            );
        }
    }, []);

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
            },
        });
        return <Marker position={position} />;
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogo(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (!shopName.trim()) return alert("Please enter a shop name");
        onComplete({
            shopName,
            shopBio,
            lat: position[0],
            lng: position[1],
            logo
        });
    };

    return (
        <div className="w-full space-y-10">
            {/* Left Column: Details */}
            <div className="space-y-6">
                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                    <FiInfo className="text-yellow-500" /> Shop Details
                </h2>
                <div className="space-y-4">
                    {/* ... Inputs remain the same ... */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest mb-1 block text-gray-400">Shop Name</label>
                        <input
                            type="text"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            placeholder="Enter Brand Name"
                            className="w-full border-2 border-black p-3 font-bold focus:bg-yellow-50 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest mb-1 block text-gray-400">Bio / Tagline</label>
                        <textarea
                            rows={3}
                            value={shopBio}
                            onChange={(e) => setShopBio(e.target.value)}
                            placeholder="Tell the world what you sell..."
                            className="w-full border-2 border-black p-3 font-medium focus:bg-yellow-50 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all"
                        />
                    </div>
                    {/* Logo Upload */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest block text-gray-400">Visual Identity</label>
                        <label className="p-4 border-2 border-dashed border-black bg-gray-50 flex items-center justify-center gap-4 cursor-pointer hover:bg-yellow-50 transition-colors group">
                            <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                            <div className="p-3 bg-black text-yellow-400 group-hover:scale-110 transition-transform">
                                {logo ? <FiImage size={24} /> : <FiShoppingBag size={24} />}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-black uppercase">{logo ? logo.name : "Upload Shop Logo"}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">PNG, JPG up to 5MB</p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Right Column: Map */}
            <div className="space-y-6">
                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                    <FiMapPin className="text-yellow-500" /> Shop Location
                </h2>

                <div className="h-100 w-full relative z-0 overflow-hidden ">
                    <MapContainer
                        center={position}
                        zoom={14}
                        scrollWheelZoom={false}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

            {/* Action */}
            <div className="pt-6 border-t-4 border-black">
                <button
                    onClick={handleSubmit}
                    className="group w-full bg-black text-white py-6 text-2xl font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-yellow-400 hover:text-black transition-all border-2 border-black shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                >
                    Launch My Shop <FiArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default LocationSelector;