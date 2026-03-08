import React, { useState, type ChangeEvent } from 'react';

// --- Types ---
interface Listing {
    id: number;
    title: string;
    price: string;
    category: string;
    image: string;
    status: 'Active' | 'Sold';
}

const ListingsManager = () => {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    // --- Mock Listings for the "My Listings" Page ---
    const myListings: Listing[] = [
        { id: 1, title: "Modern Studio", price: "$1,200", category: "Rentals", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80", status: 'Active' },
        { id: 2, title: "Mountain Bike", price: "$450", category: "Sports", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80", status: 'Active' },
        { id: 3, title: "Gaming Laptop", price: "$900", category: "Electronics", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=400&q=80", status: 'Sold' },
    ];

    // --- Image Upload Handler ---
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            // Limit to 5 total
            if (selectedImages.length + filesArray.length > 5) {
                alert("You can only upload a maximum of 5 images.");
                return;
            }
            setSelectedImages((prev) => [...prev, ...filesArray]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };

    return (

        <div className="min-h-screen bg-white text-black">
            {/* Header Navigation */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">My Inventory
                    </h1>
                    <p className="text-gray-500 font-medium">Manage your marketplace presence</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myListings.map((item) => (
                        <div key={item.id} className="group bg-white border-2 border-black p-4 transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="relative h-48 mb-4 overflow-hidden bg-gray-100 border border-black">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                <div className={`absolute top-2 right-2 px-3 py-1 text-[10px] font-black uppercase border border-black ${item.status === 'Active' ? 'bg-yellow-400' : 'bg-gray-200'}`}>
                                    {item.status}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-1 uppercase tracking-tight">{item.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 font-semibold">{item.category}</p>
                            <div className="flex justify-between items-center pt-4 border-t border-black/10">
                                <span className="text-2xl font-black italic">{item.price}</span>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-yellow-400 border border-transparent hover:border-black transition-all"><EditIcon /></button>
                                    <button className="p-2 hover:bg-red-500 hover:text-white border border-transparent hover:border-black transition-all"><TrashIcon /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

// --- Raw SVG Icons (Customized for the yellow/black theme) ---

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
);

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
);

const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
);

const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

export default ListingsManager;