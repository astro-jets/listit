import React, { useEffect, useState } from 'react';
import { FiCheck, FiX, FiTrash2, FiEdit3, FiPlus, FiLoader, FiPackage } from 'react-icons/fi';
import NewListingForm from '../forrms/listingForm';
import { getShopListings, updateListing, deleteListing } from '~/services/listing.service';

interface Listing {
    id: number;
    title: string;
    price: string;
    category: string;
    images: string[];
    status: string;
}

const ListingsManager = ({ shopId }: { shopId: number }) => {
    const [showListingForm, setShowListingForm] = useState(false);
    const [myListings, setMyListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fast Edit States
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editBuffer, setEditBuffer] = useState<Partial<Listing>>({});

    const fetchListings = async () => {
        setIsLoading(true);
        try {
            const data = await getShopListings(shopId);
            setMyListings(data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!showListingForm) fetchListings();
    }, [showListingForm, shopId]);

    // --- Action Handlers ---

    const startEditing = (item: Listing) => {
        setEditingId(item.id);
        setEditBuffer({ title: item.title, price: item.price });
    };

    const handleSaveEdit = async (id: number) => {
        try {
            const updated = await updateListing(id, editBuffer);
            // Update local state without a full refresh
            setMyListings(myListings.map(l => l.id === id ? { ...l, ...updated } : l));
            setEditingId(null);
        } catch (error) {
            alert("Failed to update listing");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure? This will permanently delete this listing.")) return;

        try {
            await deleteListing(id);
            setMyListings(myListings.filter(l => l.id !== id));
        } catch (error) {
            alert("Failed to delete listing");
        }
    };

    return (
        <div className="min-h-screen bg-white text-black">
            {showListingForm ? (
                <NewListingForm shopId={shopId.toString()} onBack={() => setShowListingForm(false)} />
            ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <header className="flex justify-between items-end">
                        <div className='space-y-2 text-left'>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500">Inventory</p>
                            <h1 className="text-5xl font-black uppercase italic tracking-tighter">Your <span className="bg-black text-white px-2">Listings</span></h1>
                        </div>
                        <button onClick={() => setShowListingForm(true)} className="bg-yellow-400 border-4 border-black px-6 py-3 font-black uppercase text-xs flex items-center gap-2 hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1">
                            <FiPlus strokeWidth={4} /> Add Product
                        </button>
                    </header>

                    {isLoading ? (
                        <div className="flex flex-col items-center py-20"><FiLoader className="animate-spin text-4xl mb-4" /><p className="font-black uppercase text-sm tracking-widest">Loading...</p></div>
                    ) : myListings.length === 0 ? (
                        <div className="border-4 border-dashed border-gray-200 p-20 text-center bg-gray-50"><FiPackage className="mx-auto text-4xl text-gray-300 mb-4" /><p className="font-black uppercase text-gray-300 text-2xl italic">Empty Shelf</p></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {myListings.map((item) => (
                                <div key={item.id} className="group border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden">
                                    <div className="aspect-video bg-gray-100 border-b-4 border-black relative overflow-hidden">
                                        <img src={item.images[0] || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" />
                                        <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">{item.category}</div>
                                    </div>

                                    <div className="p-6 text-left space-y-4">
                                        {editingId === item.id ? (
                                            /* FAST EDIT MODE */
                                            <div className="space-y-3">
                                                <input
                                                    className="w-full border-2 border-black p-2 font-black uppercase text-sm"
                                                    value={editBuffer.title}
                                                    onChange={e => setEditBuffer({ ...editBuffer, title: e.target.value })}
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        className="w-full border-2 border-black p-2 font-mono font-bold"
                                                        value={editBuffer.price}
                                                        onChange={e => setEditBuffer({ ...editBuffer, price: e.target.value })}
                                                    />
                                                    <button onClick={() => handleSaveEdit(item.id)} className="bg-green-500 text-white p-2 border-2 border-black"><FiCheck /></button>
                                                    <button onClick={() => setEditingId(null)} className="bg-gray-200 p-2 border-2 border-black"><FiX /></button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* VIEW MODE */
                                            <>
                                                <h3 className="text-xl font-black uppercase truncate italic">{item.title}</h3>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-2xl font-black italic tracking-tighter">${item.price}</span>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => startEditing(item)} className="p-2 bg-yellow-400 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-1 transition-all"><FiEdit3 /></button>
                                                        <button onClick={() => handleDelete(item.id)} className="p-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 hover:text-white transition-all"><FiTrash2 /></button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ListingsManager;