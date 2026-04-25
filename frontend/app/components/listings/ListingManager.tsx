import React, { useEffect, useState } from 'react';
import { FiCheck, FiX, FiTrash2, FiEdit3, FiPlus, FiLoader, FiPackage, FiEye } from 'react-icons/fi';
import NewListingForm from '../forrms/listingForm';
import { getShopListings, updateListing, deleteListing } from '~/services/listing.service';
import { Link } from 'react-router';

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

    const startEditing = (item: Listing) => {
        setEditingId(item.id);
        setEditBuffer({ title: item.title, price: item.price });
    };

    const handleSaveEdit = async (id: number) => {
        try {
            const updated = await updateListing(id, editBuffer);
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
        <div className="min-h-screen bg-transparent text-black">
            {showListingForm ? (
                <NewListingForm shopId={shopId.toString()} onBack={() => setShowListingForm(false)} />
            ) : (
                <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
                    {/* Responsive Header */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div className='space-y-1 md:space-y-2 text-left'>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500">Inventory_Control</p>
                            <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                                Your <span className="bg-black text-white px-2">Listings</span>
                            </h1>
                        </div>
                        <button
                            onClick={() => setShowListingForm(true)}
                            className="w-full md:w-auto bg-yellow-400 cursor-pointer border-4 border-black px-6 py-3 font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1"
                        >
                            <FiPlus strokeWidth={4} /> Add Product
                        </button>
                    </header>

                    {isLoading ? (
                        <div className="flex flex-col items-center py-20">
                            <FiLoader className="animate-spin text-4xl mb-4 text-yellow-400" />
                            <p className="font-black uppercase text-xs tracking-widest">Scanning_Vault...</p>
                        </div>
                    ) : myListings.length === 0 ? (
                        <div className="border-4 border-dashed border-gray-300 p-12 md:p-20 text-center bg-gray-50/50">
                            <FiPackage className="mx-auto text-4xl text-gray-300 mb-4" />
                            <p className="font-black uppercase text-gray-300 text-xl md:text-2xl italic tracking-tighter">Empty Shelf</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {myListings.map((item) => (
                                <div key={item.id} className="group border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden">
                                    <div className="aspect-video bg-gray-100 border-b-4 border-black relative overflow-hidden">
                                        <img
                                            src={item.images[0] || 'https://via.placeholder.com/400'}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-all duration-500"
                                        />
                                        <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-[9px] font-black uppercase tracking-widest border border-white/20">
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="p-4 md:p-6 text-left space-y-4">
                                        {editingId === item.id ? (
                                            <div className="space-y-3">
                                                <input
                                                    autoFocus
                                                    className="w-full border-2 border-black p-2 font-black uppercase text-xs md:text-sm outline-none bg-yellow-50"
                                                    value={editBuffer.title}
                                                    onChange={e => setEditBuffer({ ...editBuffer, title: e.target.value })}
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        className="w-full border-2 border-black p-2 font-mono font-bold text-sm outline-none bg-yellow-50"
                                                        value={editBuffer.price}
                                                        onChange={e => setEditBuffer({ ...editBuffer, price: e.target.value })}
                                                    />
                                                    <button onClick={() => handleSaveEdit(item.id)} className="bg-green-400 p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"><FiCheck /></button>
                                                    <button onClick={() => setEditingId(null)} className="bg-gray-100 p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"><FiX /></button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="text-lg md:text-xl font-black uppercase truncate italic tracking-tight">{item.title}</h3>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xl md:text-2xl font-black italic tracking-tighter leading-none">${item.price}</span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => startEditing(item)}
                                                            className="p-2 bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                                                        >
                                                            <FiEdit3 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 hover:text-white transition-all active:shadow-none"
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                        <Link to={`/inventory/${item.id}`}
                                                            onClick={() => startEditing(item)}
                                                            className="p-2 bg-blue-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                                                        >
                                                            <FiEye size={16} />
                                                        </Link>
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