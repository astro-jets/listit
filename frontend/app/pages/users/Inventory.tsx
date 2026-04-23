import { useEffect, useState } from "react";
import { FiPlus, FiShoppingBag, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router";
import DashboardLayout from "~/components/layouts/DashboardLayout";
import ListingsManager from "~/components/listings/ListingManager";
import { getMyShop } from "~/services/shop.service";

const InventoryPage = () => {
    const [shop, setShop] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[60vh] p-4">
                    <FiLoader className="animate-spin text-4xl mb-4 text-yellow-400" />
                    <p className="font-black uppercase tracking-widest text-xs md:text-sm">Syncing Inventory...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                {!shop ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[70vh] animate-in fade-in zoom-in duration-500">
                        <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-lg w-full text-center">

                            {/* Icon Container */}
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-400 border-4 border-black flex items-center justify-center mx-auto mb-6 -rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <FiShoppingBag className="text-3xl md:text-4xl" />
                            </div>

                            <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter mb-4 leading-none">
                                No Shop Found
                            </h2>

                            <p className="font-bold text-sm md:text-base text-gray-600 mb-8 leading-tight uppercase">
                                You need an active shop to list products and start earning. Setup your storefront in less than a minute.
                            </p>

                            <button
                                onClick={() => navigate("/myshop")}
                                className="w-full bg-black text-white px-6 py-4 font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black border-2 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 flex items-center justify-center"
                            >
                                <FiPlus className="mr-2" strokeWidth={4} />
                                <span className="text-sm md:text-base">Create Storefront</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ListingsManager shopId={shop.id} />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default InventoryPage;