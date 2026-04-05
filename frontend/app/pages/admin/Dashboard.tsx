import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUsers, FiShield, FiCheckSquare, FiAlertTriangle,
    FiUserPlus, FiStopCircle, FiExternalLink, FiSearch,
    FiShoppingBag, FiMoreHorizontal, FiTrash2, FiCheck
} from 'react-icons/fi';
import AdminLayout from '~/components/layouts/AdminLayout';
import { getAdminStats, getPendingShops, getAllUsers, approveShop } from '~/services/admin.service';


type AdminTab = 'users' | 'verifications' | 'listings';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('users');
    const [stats, setStats] = useState<any>(null);
    const [pendingShops, setPendingShops] = useState<any[]>([]);
    const [tableData, setTableData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // 1. Initial Data Fetch
    useEffect(() => {
        const loadDashboard = async () => {
            setLoading(true);
            try {
                const [statsRes, pendingRes, usersRes] = await Promise.all([
                    getAdminStats(),
                    getPendingShops(),
                    getAllUsers()
                ]);

                // DEBUG: See exactly what the variables hold
                console.log("Stats Check:", statsRes);
                console.log("Pending Check:", pendingRes);

                // 1. Force-parse the stats (handles the "1" strings from your screenshot)
                if (statsRes) {
                    setStats({
                        total_users: parseInt(statsRes.total_users || 0),
                        active_shops: parseInt(statsRes.active_shops || 0),
                        active_listings: parseInt(statsRes.active_listings || 0),
                        total_reviews: parseInt(statsRes.total_reviews || 0),
                    });
                }

                // 2. Data Digging: If pendingRes isn't an array, check pendingRes.data
                const validatedPending = Array.isArray(pendingRes)
                    ? pendingRes
                    : (pendingRes?.data || []);

                const validatedUsers = Array.isArray(usersRes)
                    ? usersRes
                    : (usersRes?.data || []);

                setPendingShops(validatedPending);
                setTableData(validatedUsers);

            } catch (err) {
                console.error("Dashboard Sync Failed", err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);
    // 2. Handle Shop Approval
    const handleApproveShop = async (id: number) => {
        try {
            await approveShop(id);
            // Smooth exit animation triggered by state change
            setPendingShops(prev => prev.filter(shop => shop.id !== id));
            // Refresh stats to reflect new active shop
            const newStats = await getAdminStats();
            setStats(newStats);
        } catch (err) {
            console.error("Approval Error", err);
        }
    };

    console.log("Stats:", stats);
    console.log("Pending Shops:", pendingShops);
    console.log("Table Data:", tableData);

    return (
        <AdminLayout>
            <div className="min-h-screen bg-white p-4 md:p-8 space-y-10 text-black">

                {/* --- HEADER & NAVIGATION --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-8 border-black pb-10">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">
                            System <span className="text-yellow-400 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">Control</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-4 bg-black text-white px-3 py-1 w-fit font-mono text-[10px] uppercase tracking-widest">
                            <FiShield /> Superuser Auth: Active
                        </div>
                    </motion.div>

                    <div className="flex bg-gray-100 border-4 border-black p-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
                        {(['users', 'verifications', 'listings'] as AdminTab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative z-10 px-8 py-3 font-black uppercase text-xs transition-colors duration-300 ${activeTab === tab ? 'text-white' : 'text-black hover:bg-yellow-200'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="adminTabBg"
                                        className="absolute inset-0 bg-black -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Live Users" value={stats?.total_users} icon={<FiUsers />} color="bg-white" />
                    <StatCard label="Pending Approval" value={pendingShops.length} icon={<FiCheckSquare />} color="bg-yellow-400" />
                    <StatCard label="Active Gear" value={stats?.active_listings} icon={<FiShoppingBag />} color="bg-cyan-400" />
                    <StatCard label="Reports" value="03" icon={<FiAlertTriangle />} color="bg-red-500" textColor="text-white" />
                </div>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* TABLE SECTION */}
                    <div className="lg:col-span-8 border-4 border-black bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
                        <div className="p-5 border-b-4 border-black flex justify-between items-center bg-zinc-900 text-white">
                            <h2 className="font-black uppercase tracking-tighter text-xl italic">{activeTab} Database</h2>
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="SEARCH_BY_ID..."
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white text-black text-xs font-bold p-2 pl-10 border-2 border-white outline-none focus:bg-yellow-400 focus:border-black transition-all"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-100 border-b-4 border-black font-black uppercase text-[10px]">
                                    <tr>
                                        <th className="p-5 border-r-2 border-black">Reference</th>
                                        <th className="p-5 border-r-2 border-black">Status</th>
                                        <th className="p-5 border-r-2 border-black">Created</th>
                                        <th className="p-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="font-bold text-sm">
                                    <AnimatePresence mode="popLayout">
                                        {tableData.map((row) => (
                                            <motion.tr
                                                key={row.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="border-b-2 border-black hover:bg-yellow-50 transition-colors"
                                            >
                                                <td className="p-5 border-r-2 border-black">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black italic text-xs">
                                                            {activeTab[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="uppercase leading-tight">{row.username || row.title || row.name}</p>
                                                            <p className="text-[9px] text-zinc-400 font-mono">ID: {row.id.toString().slice(0, 8)}...</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5 border-r-2 border-black">
                                                    <span className={`px-3 py-1 border-2 border-black text-[10px] uppercase font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${row.is_approved !== false ? 'bg-green-400' : 'bg-yellow-400'}`}>
                                                        {row.is_approved !== false ? 'Verified' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="p-5 border-r-2 border-black font-mono text-xs opacity-50">
                                                    {new Date(row.created_at).toISOString().split('T')[0]}
                                                </td>
                                                <td className="p-5 text-right space-x-2">
                                                    <button className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                        <FiMoreHorizontal />
                                                    </button>
                                                    <button className="p-2 border-2 border-black bg-red-500 text-white hover:translate-y-1 hover:shadow-none transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                        <FiTrash2 />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* VERIFICATION QUEUE SIDEBAR */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="border-4 border-black bg-yellow-400 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                                <FiCheckSquare className="text-3xl" /> Shop Queue
                            </h3>
                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {pendingShops.map((shop) => (
                                        <motion.div
                                            key={shop.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                                            className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-black text-sm uppercase tracking-tighter">{shop.name}</span>
                                                <span className="font-mono text-[8px] text-zinc-400">{new Date(shop.created_at).toLocaleTimeString()}</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 italic">Owner: {shop.owner_name}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApproveShop(shop.id)}
                                                    className="flex-1 bg-black text-white text-[10px] font-black uppercase py-3 border-2 border-black hover:bg-green-500 transition-all flex items-center justify-center gap-2"
                                                >
                                                    Approve <FiCheck />
                                                </button>
                                                <button className="p-3 border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-all">
                                                    <FiStopCircle />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {pendingShops.length === 0 && (
                                    <div className="text-center py-10 border-4 border-dashed border-black/20 font-black text-black/40 uppercase text-xs italic">
                                        All Quests Verified
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-4 border-black bg-cyan-400 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-xl font-black uppercase italic mb-4 flex items-center gap-3">
                                <FiShoppingBag /> Market Registry
                            </h3>
                            <button className="w-full bg-white border-4 border-black py-4 font-black uppercase text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2">
                                Export Database <FiExternalLink />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

// --- STAT CARD COMPONENT ---
const StatCard = ({ label, value, icon, color, textColor = "text-black" }: any) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className={`border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between ${color} ${textColor}`}
    >
        <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">{label}</p>
            <p className="text-5xl font-black italic tracking-tighter leading-none">{value || '0'}</p>
        </div>
        <div className="text-4xl opacity-30">{icon}</div>
    </motion.div>
);

export default AdminDashboard;