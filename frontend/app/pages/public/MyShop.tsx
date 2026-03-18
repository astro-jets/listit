import React, { useEffect, useState } from 'react';
import { getMyShop, deleteShop } from '~/services/shop.service';

import { FiEdit3, FiTrash2, FiMapPin, FiCheckCircle, FiX } from 'react-icons/fi';
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
            setShop(null); // No shop found
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadShopData(); }, []);

    const handleOnboardingComplete = () => {
        setShowSuccessModal(true);
        loadShopData(); // Refresh state to show the shop card
    };

    const handleDelete = async () => {
        if (window.confirm("WARNING: This will permanently delete your shop and all listings. Proceed?")) {
            try {
                await deleteShop(shop.id);
                setShop(null);
            } catch (err) {
                alert("Failed to delete shop.");
            }
        }
    };

    if (loading) return <div className="p-10 font-black animate-pulse">SYNCING DATA...</div>;

    return (
        <DashboardLayout>
            <div className="p-6 md:p-10 max-w-5xl mx-auto">
                {!shop ? (
                    <CreateShopOnboarding onComplete={handleOnboardingComplete} />
                ) : (
                    <ShopManager shop={shop} onDelete={handleDelete} onUpdate={() => { alert("updated successfully") }} />
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-white border-4 border-black p-8 max-w-sm w-full shadow-[16px_16px_0px_0px_rgba(34,197,94,1)] text-center relative">
                            <button onClick={() => setShowSuccessModal(false)} className="absolute top-4 right-4"><FiX size={24} /></button>
                            <div className="w-20 h-20 bg-green-400 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <FiCheckCircle size={40} />
                            </div>
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Established!</h3>
                            <p className="font-bold text-xs uppercase text-gray-500 mb-8">Your shop is now live in the sector.</p>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-colors border-2 border-black"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyShop;