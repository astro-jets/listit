import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiEye, FiSearch, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '~/components/layouts/AdminLayout';
// Import your real service functions
import { getPendingShops, approveShop, rejectShop } from '~/services/admin.service';

const AdminShops = () => {
    const [shops, setShops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // 1. Load Shops on Mount
    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        setLoading(true);
        try {
            const data = await getPendingShops();
            // Ensure we handle if the data is nested in .data
            setShops(Array.isArray(data) ? data : data?.data || []);
        } catch (err) {
            console.error("Failed to fetch shops", err);
        } finally {
            setLoading(false);
        }
    };

    // 2. Action Handlers
    const handleApprove = async (shopId: number) => {
        try {
            await approveShop(shopId);
            // Optimistic Update: Remove from list immediately
            setShops(prev => prev.filter(s => s.id !== shopId));
        } catch (err) {
            alert("Approval failed. Check permissions.");
        }
    };

    const handleReject = async (shopId: number) => {
        if (!window.confirm("Are you sure you want to reject/delete this shop?")) return;
        try {
            await rejectShop(shopId);
            setShops(prev => prev.filter(s => s.id !== shopId));
        } catch (err) {
            console.error(err);
        }
    };

    // 3. Filter logic for the search bar
    const filteredShops = shops.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end border-b-8 border-black pb-6 gap-4">
                    <div>
                        <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
                            Shop <span className="text-yellow-400 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">Registry</span>
                        </h1>
                        <p className="font-mono text-[10px] mt-2 uppercase font-bold text-gray-500">
                            {shops.length} PENDING_VERIFICATIONS_FOUND
                        </p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                        <input
                            className="w-full border-4 border-black p-3 pl-12 text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all outline-none"
                            placeholder="SEARCH_BY_NAME_OR_OWNER..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* --- CONTENT --- */}
                <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 border-4 border-dashed border-black">
                            <FiLoader className="text-4xl animate-spin mb-4" />
                            <p className="font-black uppercase italic text-sm tracking-widest">Accessing_Database...</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredShops.map(shop => (
                                <motion.div
                                    key={shop.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="border-4 border-black p-5 bg-white flex flex-col md:flex-row items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(250,204,21,1)] transition-all"
                                >
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="w-16 h-16 bg-zinc-900 text-yellow-400 flex items-center justify-center font-black text-2xl border-4 border-black italic shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                            {shop.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-black uppercase text-xl leading-none">{shop.name}</h3>
                                            <div className="flex gap-2 mt-2">
                                                <span className="text-[9px] bg-black text-white px-2 py-0.5 font-bold uppercase tracking-tighter">
                                                    Owner: {shop.owner_name || 'Unknown'}
                                                </span>
                                                <span className="text-[9px] border-2 border-black px-2 py-0.5 font-bold uppercase tracking-tighter">
                                                    UID: {shop.id.toString().slice(0, 8)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 items-center mt-6 md:mt-0 w-full md:w-auto justify-end">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[9px] font-black uppercase text-gray-400 leading-none">Registered</p>
                                            <p className="font-black italic text-sm">{new Date(shop.created_at).toLocaleDateString()}</p>
                                        </div>

                                        <div className="px-4 py-2 border-2 border-black bg-yellow-400 font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                            Pending_Review
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(shop.id)}
                                                className="p-3 border-4 border-black bg-white hover:bg-green-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all group"
                                                title="Approve Shop"
                                            >
                                                <FiCheckCircle className="text-xl group-hover:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                onClick={() => handleReject(shop.id)}
                                                className="p-3 border-4 border-black bg-white hover:bg-red-500 hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all group"
                                                title="Reject Shop"
                                            >
                                                <FiXCircle className="text-xl group-hover:scale-110 transition-transform" />
                                            </button>
                                            <button className="p-3 border-4 border-black bg-cyan-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all group">
                                                <FiEye className="text-xl group-hover:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                    {!loading && filteredShops.length === 0 && (
                        <div className="text-center py-20 border-4 border-black bg-gray-50">
                            <p className="font-black uppercase italic text-2xl text-gray-300 italic tracking-widest">No_Shops_Awaiting_Action</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminShops;