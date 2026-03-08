import React, { useState } from 'react';
import {
    FiShoppingBag, FiEdit3, FiPlus, FiEye,
    FiStar, FiPackage, FiSettings,

    FiArrowRight
} from 'react-icons/fi';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import ListingsManager from '~/components/listings/ListingManager';
// Use lazy loading to avoid importing Leaflet on the server
const LocationSelector = React.lazy(() => import('~/components/maps/LocationSelector'));
import ClientOnly from '~/utils/ClientOnly';

type View = 'shop-overview' | 'manage-listings' | 'create-listing' | 'settings';

const ShopDashboard = () => {
    // 1. New State to track if shop exists
    const [hasShop, setHasShop] = useState(false);
    const [currentView, setCurrentView] = useState<View>('shop-overview');

    const shopData = {
        name: "Golden Era Vintage",
        description: "Curated high-end collectibles and rare finds from around the globe.",
        rating: 4.9,
        totalSales: 128,
        joined: "March 2024"
    };

    // 2. Conditional Rendering Gate
    if (!hasShop) {
        return (

            <CreateShopOnboarding onComplete={() => setHasShop(true)} />

        );
    }

    return (
        <div className="min-h-screen bg-white text-black font-sans flex flex-col">
            <nav className="bg-black text-white px-8 py-4 flex flex-col md:flex-row items-center justify-between border-b-4 border-yellow-400 gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-yellow-400 p-2 border-2 border-black">
                        <FiShoppingBag className="text-black text-xl" />
                    </div>
                    <div>
                        <div className="text-xl font-black tracking-tighter text-yellow-400 italic leading-none">{shopData.name}</div>
                        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em]">Console</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-8">
                    <TabLink
                        icon={<FiShoppingBag />}
                        label="Profile"
                        active={currentView === 'shop-overview'}
                        onClick={() => setCurrentView('shop-overview')}
                    />
                    <TabLink
                        icon={<FiPackage />}
                        label="Listings"
                        active={currentView === 'manage-listings'}
                        onClick={() => setCurrentView('manage-listings')}
                    />
                    <TabLink
                        icon={<FiSettings />}
                        label="Settings"
                        active={currentView === 'settings'}
                        onClick={() => setCurrentView('settings')}
                    />
                </div>

                <button
                    onClick={() => setCurrentView('create-listing')}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-6 py-2 rounded-none flex items-center justify-center gap-2 transition-all active:translate-y-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none"
                >
                    <FiPlus strokeWidth={3} /> <span className="text-xs uppercase">New Listing</span>
                </button>
            </nav>

            <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
                {currentView === 'shop-overview' && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        {/* Shop Header / Banner */}
                        <div className="relative border-4 border-black h-48 bg-yellow-400 flex items-end p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="absolute -bottom-10 left-8 w-24 h-24 bg-black border-4 border-white flex items-center justify-center text-yellow-400">
                                <FiShoppingBag size={40} />
                            </div>
                            <div className="ml-28 mb-[-10px]">
                                <h1 className="text-4xl font-black uppercase tracking-tighter bg-black text-white px-4 py-1 inline-block">
                                    {shopData.name}
                                </h1>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
                            <StatCard icon={<FiStar className="text-yellow-500" />} label="Rating" value={shopData.rating.toString()} />
                            <StatCard icon={<FiPackage className="text-blue-500" />} label="Items Sold" value={shopData.totalSales.toString()} />
                            <StatCard icon={<FiEye className="text-green-500" />} label="Shop Views" value="12.4k" />
                        </div>

                        <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-black uppercase">About the Shop</h2>
                                <button className="text-sm font-bold flex items-center gap-1 hover:text-yellow-600 underline">
                                    <FiEdit3 /> Edit
                                </button>
                            </div>
                            <p className="text-gray-600 leading-relaxed font-medium">{shopData.description}</p>
                        </div>
                    </div>
                )}

                {currentView === 'create-listing' && <NewListingForm onBack={() => setCurrentView('shop-overview')} />}
                {currentView === 'manage-listings' && <ListingsManager />}
            </main>
        </div>

    );
};

export default ShopDashboard;
// --- New Onboarding Component ---
const CreateShopOnboarding = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-8">
            <div className=" w-full border-4 border-black p-4  bg-white shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] text-center space-y-8">
                <div className="w-20 h-20 bg-yellow-400 border-4 border-black flex items-center justify-center mx-auto -mt-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <FiShoppingBag size={40} />
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
                        Ready to <span className="bg-black text-yellow-400 px-2">Sell?</span>
                    </h1>
                    <p className="text-lg font-bold text-gray-500">
                        You don't have a shop yet. Create one in seconds and start reaching thousands of buyers today.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="p-4 border-2 border-black bg-gray-50">
                        <FiStar className="mb-2 text-yellow-600" />
                        <p className="text-[10px] font-black uppercase">Get Rated</p>
                    </div>
                    <div className="p-4 border-2 border-black bg-gray-50">
                        <FiEye className="mb-2 text-blue-600" />
                        <p className="text-[10px] font-black uppercase">Get Views</p>
                    </div>
                    <div className="p-4 border-2 border-black bg-gray-50">
                        <FiPackage className="mb-2 text-green-600" />
                        <p className="text-[10px] font-black uppercase">Earn Fast</p>
                    </div>
                </div>


                <ClientOnly>
                    <React.Suspense fallback={<div>Loading Map...</div>}>
                        <LocationSelector onComplete={(data) => console.log(data)} />
                    </React.Suspense>
                </ClientOnly>

                <div className="space-y-4 pt-4">
                    <div className="text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest ml-1">Proposed Shop Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Vintage Vault"
                            className="w-full border-4 border-black p-4 font-black text-xl focus:bg-yellow-50 outline-none"
                        />
                    </div>

                    <button
                        onClick={onComplete}
                        className="group w-full bg-black text-white py-6 text-2xl font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-yellow-400 hover:text-black transition-all border-2 border-black shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] active:shadow-none active:translate-x-2"
                    >
                        Create My Shop <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>

                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        By creating a shop, you agree to our Seller Terms of Service.
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- Updated Helper Components ---
const TabLink = ({ icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 font-bold transition-all border-b-4 ${active
            ? 'border-yellow-400 text-yellow-400'
            : 'border-transparent text-gray-500 hover:text-white hover:border-gray-800'
            }`}
    >
        <span className="text-xl">{icon}</span>
        <span className="uppercase tracking-widest text-[10px] hidden sm:inline">{label}</span>
    </button>
);

const StatCard = ({ icon, label, value }: any) => (
    <div className="border-2 border-black p-6 bg-white flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
        <div className="text-3xl p-3 bg-gray-50 border border-black">{icon}</div>
        <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</p>
            <p className="text-3xl font-black">{value}</p>
        </div>
    </div>
);

// --- The Listing Form from previous turns is integrated here ---
const NewListingForm = ({ onBack }: { onBack: () => void }) => {
    // ... (Your existing NewListingForm code)
    return <div className="p-4 border-4 border-black">New Listing Form Content</div>;
};
