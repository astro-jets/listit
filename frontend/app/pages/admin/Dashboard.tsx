import React, { useState } from 'react';
import {
    FiUsers, FiShield, FiCheckSquare, FiAlertTriangle,
    FiUserPlus, FiStopCircle, FiExternalLink, FiSearch,
    FiFilter, FiMoreHorizontal, FiShoppingBag
} from 'react-icons/fi';
import AdminLayout from '~/components/layouts/AdminLayout';

type AdminTab = 'users' | 'verifications' | 'listings';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('users');

    // --- Mock Data ---
    const pendingShops = [
        { id: 1, name: "Neon Electronics", owner: "Zane_99", date: "2h ago", docs: "PDF_Verified" },
        { id: 2, name: "Thrift King", owner: "Sarah_J", date: "5h ago", docs: "Pending_Review" },
    ];

    return (
        <AdminLayout>
            <div className="min-h-screen bg-white p-4 md:p-8 space-y-8 text-black">

                {/* --- TOP ADMIN NAV --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-black pb-8">
                    <div>
                        <h1 className="text-6xl font-black uppercase italic tracking-tighter">
                            System <span className="text-yellow-400 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">Control</span>
                        </h1>
                        <p className="font-bold text-xs uppercase tracking-[0.2em] text-gray-400 mt-2 flex items-center gap-2">
                            <FiShield className="text-black" /> Superuser Authorization Active
                        </p>
                    </div>

                    <div className="flex bg-gray-100 border-4 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {(['users', 'verifications', 'listings'] as AdminTab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 font-black uppercase text-xs transition-all ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-yellow-400'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- SYSTEM HEALTH METRICS --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <MetricCard label="Total Users" value="12.4k" icon={<FiUsers />} color="bg-white" />
                    <MetricCard label="Pending Verifications" value="08" icon={<FiCheckSquare />} color="bg-yellow-400" />
                    <MetricCard label="Flagged Listings" value="03" icon={<FiAlertTriangle />} color="bg-red-500" text="text-white" />
                    <MetricCard label="New Shops/24h" value="+12" icon={<FiUserPlus />} color="bg-green-400" />
                </div>

                {/* --- DYNAMIC CONTENT AREA --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Management Table */}
                    <div className="lg:col-span-2 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        <div className="p-4 border-b-4 border-black flex justify-between items-center bg-black text-white">
                            <h2 className="font-black uppercase tracking-widest">{activeTab} Management</h2>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" placeholder="FILTER..." className="bg-white text-black text-[10px] p-1 pl-7 border-2 border-white focus:border-yellow-400 outline-none font-bold" />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b-2 border-black">
                                    <tr className="text-[10px] font-black uppercase">
                                        <th className="p-4">Entity</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Activity</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-black font-bold text-sm">
                                    {/* Map your users/listings here based on activeTab */}
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <tr key={i} className="hover:bg-yellow-50">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gray-200 border-2 border-black flex items-center justify-center font-black">?</div>
                                                    <div>
                                                        <p className="uppercase leading-none">Record_ID_{i}</p>
                                                        <p className="text-[10px] text-gray-400">meta_data_ref</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-green-400 px-2 py-0.5 border border-black text-[10px] uppercase font-black">Active</span>
                                            </td>
                                            <td className="p-4 font-mono text-xs text-gray-500">2026-03-10</td>
                                            <td className="p-4 text-right">
                                                <button className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"><FiMoreHorizontal /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Verification Sidebar */}
                    <div className="space-y-6">
                        <div className="border-4 border-black bg-yellow-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="font-black uppercase italic text-xl mb-4 flex items-center gap-2">
                                <FiCheckSquare /> Verification Queue
                            </h3>
                            <div className="space-y-4">
                                {pendingShops.map((shop) => (
                                    <div key={shop.id} className="bg-white border-2 border-black p-3 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <span className="font-black text-xs uppercase tracking-tighter">{shop.name}</span>
                                            <span className="text-[8px] font-bold text-gray-400 uppercase">{shop.date}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-500 italic">Owner: {shop.owner}</p>
                                        <div className="flex gap-2 pt-2">
                                            <button className="flex-1 bg-black text-white text-[10px] font-black uppercase py-2 border border-black hover:bg-white hover:text-black transition-all">Approve</button>
                                            <button className="p-2 border border-black hover:bg-red-500 hover:text-white transition-all"><FiStopCircle /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="font-black uppercase italic text-xl mb-4 flex items-center gap-2">
                                <FiShoppingBag /> Global Shops
                            </h3>
                            <button className="w-full border-2 border-black py-4 font-black uppercase text-sm hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                                View Registry <FiExternalLink />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

// --- Helper Component ---
const MetricCard = ({ label, value, icon, color, text = "text-black" }: any) => (
    <div className={`border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between ${color} ${text}`}>
        <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{label}</p>
            <p className="text-4xl font-black italic tracking-tighter">{value}</p>
        </div>
        <div className="text-3xl opacity-20">{icon}</div>
    </div>
);

export default AdminDashboard;