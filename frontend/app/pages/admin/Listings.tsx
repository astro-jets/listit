import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiTrash2, FiAlertCircle, FiImage, FiLoader, FiTerminal } from 'react-icons/fi';
import AdminLayout from "~/components/layouts/AdminLayout";
import { getAllListings, approveListing, deleteListing } from '~/services/admin.service';

const AdminListings = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getAllListings();
            setListings(Array.isArray(data) ? data : data?.data || []);
        } catch (err) {
            console.error("Sync Error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleApprove = async (id: number) => {
        try {
            await approveListing(id);
            setListings(prev => prev.map(item =>
                item.id === id ? { ...item, is_approved: true } : item
            ));
        } catch (err) {
            alert("Protocol_Failure: Could not verify item.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("TERMINATE_ENTRY: Are you sure?")) return;
        try {
            await deleteListing(id);
            setListings(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            alert("Delete_Failed: Archive lock active.");
        }
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="border-b-4 md:border-b-8 border-black pb-6">
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                        Item <span className="text-cyan-400 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] md:drop-shadow-[5px_5px_0px_rgba(0,0,0,1)]">Verification</span>
                    </h1>
                    <p className="font-mono text-[10px] md:text-xs mt-4 font-black uppercase text-zinc-500 flex items-center gap-2">
                        <FiTerminal /> system.admin.listings_queue // {listings.length} entries found
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FiLoader className="animate-spin text-5xl text-yellow-400 mb-4" />
                        <span className="font-black uppercase italic tracking-widest text-sm">Syncing_Records...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        <AnimatePresence mode="popLayout">
                            {listings.length > 0 ? (
                                listings.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full"
                                    >
                                        {/* Image Header */}
                                        <div className="h-48 md:h-64 bg-zinc-100 border-b-4 border-black relative overflow-hidden group">
                                            {item.primary_image ? (
                                                <img
                                                    src={item.primary_image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-200">
                                                    <FiImage className="text-4xl mb-2 opacity-20" />
                                                </div>
                                            )}

                                            <div className={`absolute top-4 left-4 px-2 py-1 border-2 border-black font-black text-[9px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${item.is_approved ? 'bg-green-400' : 'bg-yellow-400'}`}>
                                                {item.is_approved ? 'VERIFIED' : 'PENDING_SCAN'}
                                            </div>
                                        </div>

                                        {/* Body Content */}
                                        <div className="p-4 md:p-6 space-y-4 flex-grow flex flex-col">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-black text-lg md:text-xl uppercase leading-tight line-clamp-2">{item.title}</h3>
                                                <p className="font-mono font-black text-lg text-cyan-600 italic">MWK {item.price}</p>
                                            </div>

                                            <div className="bg-zinc-100 p-2 border-2 border-black text-[9px] font-black uppercase flex items-center justify-between">
                                                <span>Origin: {item.shop_name}</span>
                                                <span className="text-zinc-400">ID: #{item.id}</span>
                                            </div>

                                            {/* Action Bar */}
                                            <div className="flex gap-2 pt-2 mt-auto">
                                                {!item.is_approved && (
                                                    <button
                                                        onClick={() => handleApprove(item.id)}
                                                        className="flex-1 bg-green-400 border-2 border-black py-3 font-black uppercase text-[10px] flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:bg-green-500"
                                                    >
                                                        Verify <FiCheck className="text-base" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="w-12 border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 border-4 border-dashed border-black flex flex-col items-center justify-center bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                    <FiAlertCircle className="text-5xl mb-4 text-zinc-300" />
                                    <h2 className="text-2xl font-black uppercase italic">Deck_Clear</h2>
                                    <p className="font-mono text-xs uppercase text-zinc-400">No pending artifacts in queue.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminListings;