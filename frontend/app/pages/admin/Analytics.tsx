import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { FiActivity, FiArrowUpRight, FiLoader } from 'react-icons/fi';
import AdminLayout from '~/components/layouts/AdminLayout';
import { getAdminStats, getGrowthMetrics } from '~/services/admin.service';

const AdminAnalytics = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getGrowthMetrics();
                const formattedData = data.map((item: any) => ({
                    ...item,
                    users: parseInt(item.users || 0, 10),
                    shops: parseInt(item.shops || 0, 10)
                }));

                setChartData(formattedData);
            } catch (err) {
                console.error("Metrics sync failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) return (
        <AdminLayout>
            <div className="h-screen flex items-center justify-center font-black uppercase italic">
                <FiLoader className="animate-spin mr-2" /> Initializing_Metrics...
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="p-8 space-y-10">
                {/* --- TITLE --- */}
                <div className="flex justify-between items-baseline border-b-8 border-black pb-4">
                    <h1 className="text-7xl font-black uppercase italic tracking-tighter">
                        System <span className="text-yellow-400 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">Metrics</span>
                    </h1>
                    <div className="bg-black text-white px-4 py-1 font-mono text-xs font-bold uppercase animate-pulse">
                        Live_Feed_Active
                    </div>
                </div>

                {/* --- CHARTS GRID --- */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

                    {/* User Growth */}
                    <div className="border-4 border-black p-8 bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-black uppercase flex items-center gap-3">
                                    <div className="w-4 h-4 bg-yellow-400 border-2 border-black" />
                                    User Acquisition
                                </h2>
                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Growth per month (Last 6 Months)</p>
                            </div>
                            <FiArrowUpRight className="text-3xl" />
                        </div>

                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#e5e7eb" strokeWidth={2} />
                                    <XAxis dataKey="name" axisLine={{ stroke: '#000', strokeWidth: 4 }} tick={{ fontWeight: '900', fill: '#000', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={{ stroke: '#000', strokeWidth: 4 }} tick={{ fontWeight: '900', fill: '#000' }} />
                                    <Tooltip
                                        cursor={{ stroke: '#000', strokeWidth: 2 }}
                                        contentStyle={{ border: '4px solid black', borderRadius: '0px', padding: '10px', fontWeight: '900' }}
                                    />
                                    <Line
                                        type="stepAfter"
                                        dataKey="users"
                                        stroke="#000"
                                        strokeWidth={6}
                                        dot={{ r: 10, fill: '#facc15', stroke: '#000', strokeWidth: 4 }}
                                        activeDot={{ r: 12, fill: '#000' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Shop Expansion (Area Chart) */}
                    <div className="border-4 border-black p-8 bg-white shadow-[16px_16px_0px_0px_rgba(34,211,238,1)]">
                        <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                            <div className="w-4 h-4 bg-cyan-400 border-2 border-black" />
                            Merchant Scale
                        </h2>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#000" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" axisLine={{ stroke: '#000', strokeWidth: 4 }} tick={{ fontWeight: '900', fill: '#000' }} dy={10} />
                                    <YAxis axisLine={{ stroke: '#000', strokeWidth: 4 }} tick={{ fontWeight: '900', fill: '#000' }} />
                                    <Tooltip contentStyle={{ border: '4px solid black', fontWeight: '900' }} />
                                    <Area
                                        type="monotone"
                                        dataKey="shops"
                                        stroke="#0891b2"
                                        strokeWidth={4}
                                        fill="#22d3ee"
                                        fillOpacity={1}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* System Log Footer */}
                    <div className="xl:col-span-2 border-4 border-black p-6 bg-black text-white">
                        <div className="flex gap-10 overflow-hidden whitespace-nowrap">
                            {/* Neobrutalist Scrolling Marquee Style */}
                            <div className="flex gap-10 animate-marquee uppercase font-black italic text-sm">
                                <span>SYSTEM_STATUS: OK</span>
                                {/* <span className="text-yellow-400">USERS_ONLINE: {chartData[chartData.length - 1]?.users || 0}</span> */}
                                <span>DB_LATENCY: 24MS</span>
                                <span className="text-cyan-400">ACTIVE_SESSIONS: 412</span>
                                <span>LOAD_BALANCER: STABLE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminAnalytics;