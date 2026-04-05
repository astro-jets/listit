import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiTrash2, FiAlertCircle, FiImage } from 'react-icons/fi';
import AdminLayout from "~/components/layouts/AdminLayout";
import { getAllListings, approveListing, deleteListing } from '~/services/admin.service';

const AdminListings = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
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
            // Update local state: Mark as approved or remove from "pending" view
            setListings(prev => prev.map(item =>
                item.id === id ? { ...item, is_approved: true } : item
            ));
        } catch (err) {
            console.error("Approval Failed", err);
        }
    };

    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                <div className="border-b-8 border-black pb-4">
                    <h1 className="text-6xl font-black uppercase italic italic tracking-tighter">
                        Item <span className="text-cyan-400 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">Verification</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {listings.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col"
                            >
                                {/* --- IMAGE SECTION --- */}
                                <div className="h-64 bg-zinc-100 border-b-4 border-black relative overflow-hidden group">
                                    {item.primary_image ? (
                                        <img
                                            src={item.primary_image}
                                            alt={item.title}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=IMAGE_NOT_FOUND';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-200">
                                            <FiImage className="text-4xl mb-2 opacity-20" />
                                            <span className="font-black text-[10px] uppercase opacity-30">No_Preview_Available</span>
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className={`absolute bottom-4 right-4 px-3 py-1 border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${item.is_approved ? 'bg-green-400' : 'bg-yellow-400'}`}>
                                        {item.is_approved ? 'Live' : 'Pending'}
                                    </div>
                                </div>

                                {/* --- INFO SECTION --- */}
                                <div className="p-6 space-y-4 flex-grow">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-black text-xl uppercase leading-tight truncate w-2/3">{item.title}</h3>
                                        <p className="font-mono font-black text-xl italic">${item.price}</p>
                                    </div>

                                    <div className="bg-zinc-100 p-2 border-2 border-black text-[10px] font-bold uppercase">
                                        Shop: {item.shop_name}
                                    </div>

                                    {/* --- ACTION BUTTONS --- */}
                                    <div className="flex gap-2 pt-4">
                                        {!item.is_approved && (
                                            <button
                                                onClick={() => handleApprove(item.id)}
                                                className="flex-1 cursor-pointer bg-green-400 border-2 border-black py-3 font-black uppercase text-xs flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                                            >
                                                Approve <FiCheck className="text-lg" />
                                            </button>
                                        )}
                                        <button
                                            className="px-4 border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                            onClick={() => {/* add delete logic */ }}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminListings;