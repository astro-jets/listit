import React, { useState } from 'react';
import { FiCheck, FiX, FiTrash2, FiEdit3 } from 'react-icons/fi';

interface Listing {
    id: number;
    title: string;
    price: string;
    category: string;
    image: string;
    status: 'Active' | 'Sold';
}

const ListingsManager = () => {
    // State for managing the list of products
    const [myListings, setMyListings] = useState<Listing[]>([
        { id: 1, title: "Modern Studio", price: "$1,200", category: "Rentals", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80", status: 'Active' },
        { id: 2, title: "Mountain Bike", price: "$450", category: "Sports", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80", status: 'Active' },
        { id: 3, title: "Gaming Laptop", price: "$900", category: "Electronics", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=400&q=80", status: 'Sold' },
    ]);

    // State to track which ID is currently being edited
    const [editingId, setEditingId] = useState<number | null>(null);
    // Temporary state for the fields being changed
    const [editBuffer, setEditBuffer] = useState<Listing | null>(null);

    const startEditing = (item: Listing) => {
        setEditingId(item.id);
        setEditBuffer({ ...item });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditBuffer(null);
    };

    const saveEdit = () => {
        if (editBuffer) {
            setMyListings(prev => prev.map(item => item.id === editBuffer.id ? editBuffer : item));
            setEditingId(null);
            setEditBuffer(null);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (editBuffer) {
            setEditBuffer({ ...editBuffer, [name]: value });
        }
    };

    return (
        <div className="min-h-screen bg-white text-black p-4">
            <div className="max-w-6xl p-4 mx-auto flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Inventory Manager</h1>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-1">Direct Inventory Control</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myListings.map((item) => {
                        const isEditing = editingId === item.id;

                        return (
                            <div
                                key={item.id}
                                className={`group bg-white  p-5 transition-all  shadow-black/90 shadow 
                                ${isEditing ? 'ring-4 ring-yellow-400 -translate-y-2' : 'hover:-translate-y-1'}`}
                            >
                                {/* Image Section */}
                                <div className="relative h-48 mb-4 overflow-hidden bg-gray-100">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    {isEditing ? (
                                        <select
                                            name="status"
                                            value={editBuffer?.status}
                                            onChange={handleInputChange}
                                            className="absolute top-2 right-2 bg-black text-white px-2 py-1 font-black text-[10px] uppercase border-2 border-yellow-400 outline-none"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Sold">Sold</option>
                                        </select>
                                    ) : (
                                        <div className={`absolute top-2 right-2 px-3 py-1 text-[10px] font-black uppercase border-2 border-black ${item.status === 'Active' ? 'bg-yellow-400' : 'bg-gray-200'}`}>
                                            {item.status}
                                        </div>
                                    )}
                                </div>

                                {/* Editable Fields */}
                                <div className="space-y-3">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                name="title"
                                                value={editBuffer?.title}
                                                onChange={handleInputChange}
                                                className="w-full border-2 border-black p-2 font-black uppercase tracking-tight focus:bg-yellow-50 outline-none"
                                            />
                                            <input
                                                type="text"
                                                name="category"
                                                value={editBuffer?.category}
                                                onChange={handleInputChange}
                                                className="w-full border-2 border-black p-2 text-xs font-bold uppercase tracking-widest focus:bg-yellow-50 outline-none"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-xl font-black uppercase tracking-tight truncate">{item.title}</h3>
                                            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">{item.category}</p>
                                        </>
                                    )}
                                </div>

                                {/* Price and Actions */}
                                <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-black">
                                    {isEditing ? (
                                        <div className="flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                name="price"
                                                value={editBuffer?.price}
                                                onChange={handleInputChange}
                                                className="w-full border-2 border-black p-2 font-mono font-black text-lg focus:bg-yellow-50 outline-none"
                                            />
                                            <button onClick={saveEdit} className="p-3 bg-black text-white border-2 border-black hover:bg-yellow-400 hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                <FiCheck strokeWidth={4} />
                                            </button>
                                            <button onClick={cancelEdit} className="p-3 bg-white border-2 border-black hover:bg-red-500 hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                <FiX strokeWidth={4} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-2xl font-black italic tracking-tighter">{item.price}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEditing(item)}
                                                    className="p-2 bg-yellow-400 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-1 transition-all"
                                                >
                                                    <FiEdit3 />
                                                </button>
                                                <button className="p-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 hover:text-white transition-all">
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ListingsManager;