import { useState } from 'react';
import {
    FiShoppingBag, FiEdit3, FiPlus, FiEye,
    FiStar, FiPackage, FiSettings, FiExternalLink,
    FiBriefcase,
    FiHome,
    FiImage,
    FiSmartphone,
    FiTag,
    FiTrash2,
    FiTruck
} from 'react-icons/fi';
import ListingsManager from '~/components/listings/ListingManager';

// --- Types ---
type View = 'shop-overview' | 'manage-listings' | 'create-listing' | 'settings';

const ShopDashboard = () => {
    const [currentView, setCurrentView] = useState<View>('shop-overview');

    // Mock Shop Data
    const shopData = {
        name: "Golden Era Vintage",
        description: "Curated high-end collectibles and rare finds from around the globe.",
        rating: 4.9,
        totalSales: 128,
        joined: "March 2024"
    };
    return (
        <div className="min-h-screen w-full bg-white text-black font-sans flex flex-col">

            {/* --- SHOP SUB-NAVBAR --- */}
            <nav className="bg-black text-white px-8 py-4 flex flex-col md:flex-row items-center justify-between border-b-4 border-yellow-400 gap-6">
                {/* Shop Branding Mini */}
                <div className="flex items-center gap-4">
                    <div className="bg-yellow-400 p-2 border-2 border-black">
                        <FiShoppingBag className="text-black text-xl" />
                    </div>
                    <div>
                        <div className="text-xl font-black tracking-tighter text-yellow-400 italic leading-none">SHOP Name</div>
                        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em]">Console</p>
                    </div>
                </div>

                {/* Horizontal Tabs */}
                <div className="flex items-center gap-2 md:gap-8">
                    <SidebarLink
                        icon={<FiShoppingBag />}
                        label="Profile"
                        active={currentView === 'shop-overview'}
                        onClick={() => setCurrentView('shop-overview')}
                    />
                    <SidebarLink
                        icon={<FiPackage />}
                        label="Listings"
                        active={currentView === 'manage-listings'}
                        onClick={() => setCurrentView('manage-listings')}
                    />
                    <SidebarLink
                        icon={<FiSettings />}
                        label="Settings"
                        active={currentView === 'settings'}
                        onClick={() => setCurrentView('settings')}
                    />
                </div>

                {/* Action Button */}
                <button
                    onClick={() => setCurrentView('create-listing')}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-6 py-2 rounded-none flex items-center justify-center gap-2 transition-all active:translate-y-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none"
                >
                    <FiPlus strokeWidth={3} /> <span className="text-xs uppercase">New Listing</span>
                </button>
            </nav>

            {/* --- MAIN AREA --- */}
            <main className="flex-1 p-6 overflow-y-auto">

                {currentView === 'shop-overview' && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        {/* Shop Header / Banner */}
                        <div className="relative h-48 flex items-end">
                            <div className="absolute -bottom-10 left-8 w-24 h-24 bg-black border-4 border-white flex items-center justify-center text-yellow-400">
                                <FiShoppingBag size={40} />
                            </div>
                            <div className="ml-28 mb-[-10px]">
                                <h1 className="text-4xl font-black uppercase tracking-tighter bg-black text-white px-4 py-1 inline-block">
                                    {shopData.name}
                                </h1>
                            </div>
                        </div>

                        {/* Shop Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
                            <StatCard icon={<FiStar className="text-yellow-500" />} label="Rating" value={shopData.rating.toString()} />
                            <StatCard icon={<FiPackage className="text-blue-500" />} label="Items Sold" value={shopData.totalSales.toString()} />
                            <StatCard icon={<FiEye className="text-green-500" />} label="Shop Views" value="12.4k" />
                        </div>

                        {/* Shop About Section */}
                        <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-black uppercase">About the Shop</h2>
                                <button className="text-sm font-bold flex items-center gap-1 hover:text-yellow-600 underline">
                                    <FiEdit3 /> Edit
                                </button>
                            </div>
                            <p className="text-gray-600 leading-relaxed font-medium">{shopData.description}</p>
                            <div className="mt-6 flex gap-4 text-xs font-bold text-gray-400">
                                <span>MEMBER SINCE: {shopData.joined}</span>
                                <span>•</span>
                                <span className="text-black flex items-center gap-1"><FiExternalLink /> VIEW PUBLIC STORE</span>
                            </div>
                        </div>
                    </div>
                )}

                {currentView === 'create-listing' && <NewListingForm onBack={() => setCurrentView('shop-overview')} />}

                {/* Placeholder for other views */}
                {currentView === 'manage-listings' && (
                    <ListingsManager />
                )}

            </main>
        </div>
    );
}

export default ShopDashboard;

// --- Sub-components ---

const SidebarLink = ({ icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 p-4 font-bold transition-all ${active ? 'bg-yellow-400 text-black translate-x-2' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
    >
        <span className="text-xl">{icon}</span>
        <span className="uppercase tracking-widest text-xs">{label}</span>
    </button>
);

const StatCard = ({ icon, label, value }: any) => (
    <div className="border-2 border-black p-6 bg-white flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-3xl p-3 bg-gray-50 border border-black">{icon}</div>
        <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</p>
            <p className="text-3xl font-black">{value}</p>
        </div>
    </div>
);

// --- New Listing Form with Image Upload & Category Selector ---
const NewListingForm = ({ onBack }: { onBack: () => void }) => {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [category, setCategory] = useState('');

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const arr = Array.from(e.target.files);
            if (selectedImages.length + arr.length > 5) return alert("Limit 5 images");
            setSelectedImages([...selectedImages, ...arr]);
        }
    };

    return (
        <div className="max-w-3xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 border-2 border-black hover:bg-yellow-400"><FiExternalLink className="rotate-180" /></button>
                <h2 className="text-3xl font-black uppercase tracking-tighter">New Shop Listing</h2>
            </div>

            <div className="w-full grid grid-cols-1 gap-8 bg-white border-4 border-black p-8 ">

                {/* Category Picker */}
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest">1. Select Category</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {[
                            { id: 'real', lab: 'Homes', icon: <FiHome /> },
                            { id: 'auto', lab: 'Cars', icon: <FiTruck /> },
                            { id: 'jobs', lab: 'Jobs', icon: <FiBriefcase /> },
                            { id: 'elec', lab: 'Tech', icon: <FiSmartphone /> },
                            { id: 'misc', lab: 'Other', icon: <FiTag /> },
                        ].map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`flex flex-col items-center p-3 border-2 border-black transition-all ${category === cat.id ? 'bg-yellow-400 translate-y-1 shadow-none' : 'hover:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
                            >
                                {cat.icon}
                                <span className="text-[9px] font-black uppercase mt-1">{cat.lab}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest">2. Product Images ({selectedImages.length}/5)</label>
                    <div className="flex flex-wrap gap-3">
                        {selectedImages.map((file, i) => (
                            <div key={i} className="relative w-20 h-20 border-2 border-black group">
                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="prev" />
                                <button
                                    onClick={() => setSelectedImages(selectedImages.filter((_, idx) => idx !== i))}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white border border-black p-1 hover:bg-black"
                                >
                                    <FiTrash2 size={12} />
                                </button>
                            </div>
                        ))}
                        {selectedImages.length < 5 && (
                            <label className="w-20 h-20 border-2 border-dashed border-black flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-50">
                                <FiImage className="text-gray-400" />
                                <input type="file" multiple className="hidden" onChange={handleFile} />
                            </label>
                        )}
                    </div>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                    <input type="text" placeholder="LISTING TITLE" className="w-full border-2 border-black p-4 font-black focus:outline-none focus:bg-yellow-50" />
                    <div className="flex gap-4">
                        <input type="text" placeholder="PRICE ($)" className="w-1/2 border-2 border-black p-4 font-mono font-bold focus:outline-none focus:bg-yellow-50" />
                        <div className="w-1/2 border-2 border-black p-4 font-bold bg-gray-50 flex items-center justify-between">
                            <span className="text-xs uppercase opacity-50">Shop ID:</span>
                            <span className="text-xs">#VINT-042</span>
                        </div>
                    </div>
                    <textarea placeholder="DESCRIPTION" rows={4} className="w-full border-2 border-black p-4 font-medium focus:outline-none focus:bg-yellow-50"></textarea>
                </div>

                <button className="w-full bg-black text-white py-5 text-xl font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] active:shadow-none active:translate-x-1">
                    PUBLISH TO SHOP
                </button>
            </div>
        </div>
    );
};