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
import NewListingForm from '../forrms/listingForm';

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
                            <div className="ml-28 -mb-2.5">
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

