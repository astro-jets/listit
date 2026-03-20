import { useState } from "react";
import { FiEdit3, FiMapPin, FiTrash2, FiSave, FiX, FiLoader, FiGlobe, FiShoppingBag } from "react-icons/fi";

import { updateShop } from "~/services/shop.service";

import React from "react";
const LocationViewer = React.lazy(() => import("../maps/LocationViewr"));

interface params {
    shop: any;
    onDelete: () => void;
    onUpdate: (updatedShop: any) => void;
}

const ShopManager = ({ shop, onDelete, onUpdate }: params) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Ensure we have fallback coordinates if location is null
    const coords = shop.location || { lat: 0, lng: 0 };

    const [editForm, setEditForm] = useState({
        name: shop.name,
        description: shop.description,
        location: coords
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updated = await updateShop(shop.id, editForm);
            onUpdate(updated);
            setIsEditing(false);
        } catch (err) {
            alert("Failed to update shop");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700">
            {/* --- HERO / PROFILE HEADER --- */}
            <div className="relative border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="h-32 bg-yellow-400 border-b-4 border-black flex items-end p-6">
                    <div className="w-24 h-24 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden">
                        {shop.logo_url ? (
                            <img src={shop.logo_url} alt="logo" className="w-full h-full object-cover" />
                        ) : (
                            <FiShoppingBag className="text-4xl" />
                        )}
                    </div>
                </div>

                <div className="p-8 pt-12 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-1">
                        {isEditing ? (
                            <input
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                className="text-4xl font-black uppercase border-b-4 border-black focus:outline-none w-full italic"
                            />
                        ) : (
                            <h1 className="text-5xl font-black uppercase italic tracking-tighter">{shop.name}</h1>
                        )}

                        {isEditing ? (
                            <textarea
                                value={editForm.description}
                                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                className="w-full border-2 border-black p-2 font-medium"
                                rows={3}
                            />
                        ) : (
                            <p className="text-lg font-medium text-gray-700 max-w-2xl leading-tight">{shop.description}</p>
                        )}

                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                            <FiGlobe /> Established {new Date(shop.created_at).getFullYear()}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[200px]">
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} disabled={isSaving} className="bg-black text-white px-6 py-3 font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-yellow-400 hover:text-black transition-all">
                                    {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />} Save Changes
                                </button>
                                <button onClick={() => setIsEditing(false)} className="border-2 border-black px-6 py-3 font-black uppercase text-xs flex items-center justify-center gap-2">
                                    <FiX /> Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setIsEditing(true)} className="bg-yellow-400 border-4 border-black px-6 py-3 font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none">
                                    <FiEdit3 /> Manage Profile
                                </button>
                                <button onClick={onDelete} className="text-[10px] font-black uppercase text-red-500 hover:underline flex items-center justify-center gap-1">
                                    <FiTrash2 /> Delete Shop
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MAP SECTION --- */}
            <LocationViewer coords={coords} shop={shop} />


        </div>
    );
};

export default ShopManager;