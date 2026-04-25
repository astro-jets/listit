import React, { useState, useEffect } from 'react';
import { FiEye } from 'react-icons/fi';
import { Link } from 'react-router';
import DashboardLayout from "~/components/layouts/DashboardLayout";
import { getDashboardData } from '~/services/shop.service';

const Dashboard = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const result = await getDashboardData();
                setData(result);
            } catch (err) {
                console.error("Failed to load dashboard stats");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return (
        <DashboardLayout>
            <div className="p-4 md:p-8 font-black uppercase animate-pulse">Loading_Assets...</div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            {/* Added responsive padding */}
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">

                {/* Stats Row: 1 col on mobile, 3 on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    <StatCard
                        label="Live Inventory"
                        value={data?.stats?.live_listings || "0"}
                        color="bg-black"
                        textColor="text-yellow-400"
                    />
                    <StatCard
                        label="Items Favorited"
                        value={data?.stats?.total_favorites || "0"}
                        color="bg-white"
                    />
                    <StatCard
                        label="Avg. Rating"
                        value={data?.stats?.avg_rating ? `${data.stats.avg_rating}★` : "N/A"}
                        color="bg-yellow-400"
                        className="sm:col-span-2 md:col-span-1"
                    />
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                    <div className="p-5 md:p-6 border-b-2 border-black flex flex-wrap justify-between items-center gap-2 bg-white">
                        <h3 className="font-black text-lg uppercase tracking-tight italic">Active Inventory</h3>
                        <span className="text-[10px] font-mono font-bold bg-black text-white px-2 py-1 uppercase">Live_Feed</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-gray-50 text-[10px] md:text-xs uppercase text-gray-500 font-bold border-b border-gray-100">
                                    <th className="px-4 md:px-6 py-4">Item Details</th>
                                    <th className="px-4 md:px-6 py-4">Status</th>
                                    <th className="px-4 md:px-6 py-4">Price</th>
                                    <th className="px-4 md:px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data?.listings.map((item: any) => (
                                    <tr key={item.id} className="group hover:bg-yellow-50/50 transition-colors">
                                        <td className="px-4 md:px-6 py-4">
                                            <p className="font-bold text-gray-900 text-sm md:text-base">{item.title}</p>
                                            <p className="text-[10px] md:text-xs text-gray-400 uppercase font-medium">{item.category || 'Uncategorized'}</p>
                                        </td>
                                        <td className="px-4 md:px-6 py-4">
                                            <span className={`text-[9px] md:text-[10px] font-black uppercase px-2 py-0.5 rounded border-2 ${item.status === 'available'
                                                ? 'border-black text-black bg-green-400'
                                                : 'border-black text-black bg-yellow-200'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 font-mono font-black text-sm">${item.price}</td>
                                        <td className="px-4 md:px-6 py-4 text-right">
                                            <Link to={`/inventory/${item.id}`} className="p-2 border-2 border-transparent hover:border-black hover:bg-yellow-400 transition-all rounded-lg">
                                                <FiEye />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const StatCard = ({ label, value, color = "bg-white", textColor = "text-black", className = "" }: any) => (
    <div className={`${color} ${textColor} ${className} p-5 md:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between`}>
        <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-80 mb-2`}>{label}</p>
        <p className="text-3xl md:text-5xl font-black italic tracking-tighter leading-none">{value}</p>
    </div>
);

const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);

export default Dashboard;