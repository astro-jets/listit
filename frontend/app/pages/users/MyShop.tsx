import React, { useEffect, useState } from 'react';
import { getMyShop, deleteShop } from '~/services/shop.service';
import { FiEdit3, FiTrash2, FiMapPin, FiCheckCircle, FiX, FiLoader, FiClock, FiCheck } from 'react-icons/fi';
import CreateShopOnboarding from '~/components/forrms/ShopForm';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import ShopManager from '~/components/shop/shopManager';

const MyShop = () => {
    const [shop, setShop] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const loadShopData = async () => {
        setLoading(true);
        try {
            const data = await getMyShop();
            setShop(data);
        } catch (err) {
            setShop(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadShopData(); }, []);

    const handleOnboardingComplete = () => {
        setShowSuccessModal(true);
        loadShopData();
    };

    const handleDelete = async () => {
        if (window.confirm("WARNING: This will permanently delete your shop. Proceed?")) {
            try {
                await deleteShop(shop.id);
                setShop(null);
            } catch (err) {
                alert("Failed to delete shop.");
            }
        }
    };

    return (
        <DashboardLayout>
            <div className=" md:p-8 max-w-7xl mx-auto w-full min-h-screen">
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <FiLoader className="animate-spin text-4xl mb-4 text-yellow-400" />
                        <p className="font-black uppercase tracking-widest text-xs md:text-sm italic">Synchronizing_Archive...</p>
                    </div>
                ) : (
                    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {!shop ? (
                            <div className="max-w-2xl mx-auto">
                                <CreateShopOnboarding onComplete={handleOnboardingComplete} />
                            </div>
                        ) : (
                            <div className="relative border-4 border-black bg-white overflow-hidden">

                                {/* Shop Banner Section */}
                                <div className="h-32 md:h-56 w-full border-b-4 border-black bg-zinc-100 relative">
                                    {shop.banner_url ? (
                                        <img
                                            src={shop.banner_url}
                                            alt="Banner"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                                            <p className="font-black uppercase text-zinc-300 tracking-tighter text-4xl italic">No_Banner</p>
                                        </div>
                                    )}

                                    {/* Status Sticker */}
                                    <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                                        {!shop.is_approved ? (
                                            <div className="bg-yellow-400 border-2 border-black px-3 py-1 flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce-subtle">
                                                <FiClock className="text-black" />
                                                <span className="font-black uppercase text-[10px] tracking-widest">Pending_Approval</span>
                                            </div>
                                        ) : (
                                            <div className="bg-green-400 border-2 border-black px-3 py-1 flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                <FiCheck className="text-black" strokeWidth={4} />
                                                <span className="font-black uppercase text-[10px] tracking-widest">Sector_Approved</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Shop Details */}
                                <div className=" md:p-8">
                                    <ShopManager
                                        shop={shop}
                                        onDelete={handleDelete}
                                        onUpdate={() => { alert("Updated successfully") }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Success Modal */}
                        {showSuccessModal && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                                <div className="bg-white border-4 border-black p-8 max-w-sm w-full shadow-[16px_16px_0px_0px_rgba(34,197,94,1)] text-center relative">
                                    <button
                                        onClick={() => setShowSuccessModal(false)}
                                        className="absolute top-4 right-4 hover:rotate-90 transition-transform"
                                    >
                                        <FiX size={24} />
                                    </button>

                                    <div className="w-20 h-20 bg-green-400 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <FiCheckCircle size={40} />
                                    </div>

                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">ESTABLISHED!</h3>
                                    <p className="font-bold text-[10px] uppercase text-gray-500 mb-8">Your shop is awaiting final sector verification.</p>

                                    <button
                                        onClick={() => setShowSuccessModal(false)}
                                        className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none"
                                    >
                                        Return to Deck
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyShop;