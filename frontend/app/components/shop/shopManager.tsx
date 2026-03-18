import { useState } from "react";
import { FiEdit3, FiMapPin, FiTrash2, FiSave, FiX, FiLoader } from "react-icons/fi";
import { updateShop } from "~/services/shop.service";

interface params {
    shop: any;
    onDelete: () => void;
    onUpdate: (updatedShop: any) => void; // Add this to refresh parent state
}

const ShopManager = ({ shop, onDelete, onUpdate }: params) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Local state for the inputs
    const [editForm, setEditForm] = useState({
        name: shop.name,
        description: shop.description
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updated = await updateShop(shop.id, editForm);
            onUpdate(updated); // Pass new data back to parent
            setIsEditing(false);
        } catch (err) {
            alert(err || "Failed to update shop");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditForm({ name: shop.name, description: shop.description });
        setIsEditing(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex justify-between items-end">
                <div className='space-y-2'>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500">Merchant Status: Active</p>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter">
                        Your <span className="bg-black text-white px-2">{isEditing ? "Editing" : "Shops"}</span>
                    </h1>
                </div>
            </header>

            <div className={`bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row transition-all ${isEditing ? 'ring-4 ring-yellow-400' : ''}`}>
                {/* Logo Area */}
                <div className="md:w-72 h-72 bg-gray-100 border-b-4 md:border-b-0 md:border-r-4 border-black relative">
                    <img src={shop.logo_url} alt="Shop Logo" className="w-full h-full object-cover" />
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <p className="text-white font-black text-[10px] uppercase">Logo Locked in Fast-Edit</p>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                    <div className="space-y-4 text-left">
                        {isEditing ? (
                            <div className="space-y-4">
                                <input
                                    className="w-full text-4xl font-black uppercase tracking-tight border-b-4 border-black focus:outline-none focus:border-yellow-400 bg-gray-50 p-2"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    autoFocus
                                />
                                <div className="flex items-center gap-2 font-bold text-xs uppercase text-gray-500">
                                    <FiMapPin className="text-yellow-500" />
                                    {shop.location?.address || "Coordinates Hidden"}
                                </div>
                                <textarea
                                    className="w-full font-bold text-sm border-l-4 border-yellow-400 pl-4 py-2 leading-relaxed bg-gray-50 focus:outline-none focus:bg-yellow-50 min-h-[100px]"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                />
                            </div>
                        ) : (
                            <>
                                <h2 className="text-4xl font-black uppercase tracking-tight">{shop.name}</h2>
                                <div className="flex items-center gap-2 font-bold text-xs uppercase text-gray-500 text-left">
                                    <FiMapPin className="text-yellow-500" />
                                    {shop.location?.address || "Coordinates Hidden"}
                                </div>
                                <p className="font-bold text-sm border-l-4 border-yellow-400 pl-4 py-1 leading-relaxed text-left">
                                    {shop.description}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-green-500 text-black border-2 border-black px-6 py-3 font-black uppercase text-xs flex items-center gap-2 hover:bg-green-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                                >
                                    {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />} Save Changes
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-white border-2 border-black px-6 py-3 font-black uppercase text-xs flex items-center gap-2 hover:bg-gray-100 transition-all"
                                >
                                    <FiX /> Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-black text-white px-6 py-3 font-black uppercase text-xs flex items-center gap-2 hover:bg-yellow-400 hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(250,204,21,1)]"
                                >
                                    <FiEdit3 /> Edit
                                </button>
                                <button
                                    onClick={onDelete}
                                    className="border-2 border-black px-6 py-3 font-black uppercase text-xs flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                >
                                    <FiTrash2 /> Terminate
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopManager;