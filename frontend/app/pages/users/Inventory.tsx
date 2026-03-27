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
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <FiLoader className="animate-spin text-4xl mb-4 text-yellow-400" />
                    <p className="font-black uppercase tracking-widest text-sm">Syncing Inventory...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {!shop ? (
                <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 animate-in fade-in zoom-in duration-500">
                    <div className="bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-lg text-center">
                        <div className="w-20 h-20 bg-yellow-400 border-4 border-black flex items-center justify-center mx-auto mb-6 -rotate-3">
                            <FiShoppingBag className="text-4xl" />
                        </div>
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">No Shop Found</h2>
                        <p className="font-bold text-gray-600 mb-8 leading-tight">
                            You need an active shop to list products and start earning. Setup your storefront in less than a minute.
                        </p>
                        <button
                            onClick={() => navigate("/myshop")}
                            className="cursor-pointer w-full bg-black text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black border-2 border-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                        >
                            <FiPlus className="inline mr-2" strokeWidth={4} /> Create Storefront
                        </button>
                    </div>
                </div>
            ) : (
                <ListingsManager shopId={shop.id} />
            )}
        </DashboardLayout>
    );
}

export default InventoryPage;