import React, { useState, useEffect } from 'react';
import { FiTrash2, FiEdit3, FiMessageSquare, FiStar, FiCheck } from 'react-icons/fi';
import AdminLayout from "~/components/layouts/AdminLayout";
import { getAllReviews, deleteReview, updateReview } from '~/services/admin.service';

const AdminReviews = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editBuffer, setEditBuffer] = useState("");

    useEffect(() => { loadReviews(); }, []);

    const loadReviews = async () => {
        const data = await getAllReviews();
        setReviews(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Permanently delete this review?")) return;
        await deleteReview(id);
        setReviews(prev => prev.filter(r => r.id !== id));
    };

    const handleSaveEdit = async (id: number) => {
        await updateReview(id, editBuffer);
        setReviews(prev => prev.map(r => r.id === id ? { ...r, comment: editBuffer } : r));
        setEditingId(null);
    };

    return (
        <AdminLayout>
            <div className="p-8 space-y-6">
                <div className="bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(34,197,94,1)]">
                    <h1 className="text-4xl font-black uppercase italic italic tracking-tighter">Feedback <span className="text-green-400">Audit</span></h1>
                    <p className="font-mono text-[10px] mt-1 text-zinc-400">MONITORING_USER_SENTIMENT_PROTOCOL</p>
                </div>

                <div className="space-y-4">
                    {loading ? <p className="animate-pulse font-black">LOADING_REVIEWS...</p> :
                        reviews.map((rev) => (
                            <div key={rev.id} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2 flex-grow">
                                        <div className="flex items-center gap-3">
                                            <div className="flex text-yellow-400 bg-black px-2 py-1 border-2 border-black">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar key={i} fill={i < rev.rating ? "currentColor" : "none"} size={14} />
                                                ))}
                                            </div>
                                            <span className="font-black uppercase text-xs">By {rev.author_name}</span>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Target: {rev.listing_title} ({rev.shop_name})</span>
                                        </div>

                                        {editingId === rev.id ? (
                                            <div className="flex gap-2">
                                                <input
                                                    value={editBuffer}
                                                    onChange={(e) => setEditBuffer(e.target.value)}
                                                    className="flex-grow border-2 border-black p-2 font-mono text-sm outline-none"
                                                />
                                                <button onClick={() => handleSaveEdit(rev.id)} className="bg-green-400 p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><FiCheck /></button>
                                            </div>
                                        ) : (
                                            <p className="font-medium text-zinc-800 italic">"{rev.comment}"</p>
                                        )}
                                    </div>

                                    <div className="flex md:flex-col gap-2 shrink-0">
                                        <button
                                            onClick={() => { setEditingId(rev.id); setEditBuffer(rev.comment); }}
                                            className="p-3 border-2 border-black hover:bg-cyan-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                                        >
                                            <FiEdit3 />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(rev.id)}
                                            className="p-3 border-2 border-black hover:bg-red-500 hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminReviews;