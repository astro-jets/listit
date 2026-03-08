import React from 'react';
import {
    FiTrendingUp, FiUsers, FiDollarSign, FiShoppingBag,
    FiArrowUpRight, FiArrowDownRight, FiActivity, FiZap
} from 'react-icons/fi';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import DashboardLayout from '~/components/layouts/DashboardLayout';

// --- Mock Data ---
const revenueData = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 700 },
    { name: 'Wed', sales: 500 },
    { name: 'Thu', sales: 900 },
    { name: 'Fri', sales: 1100 },
    { name: 'Sat', sales: 800 },
    { name: 'Sun', sales: 1300 },
];

const categoryData = [
    { name: 'Tech', value: 45, color: '#facc15' }, // Yellow
    { name: 'Vintage', value: 30, color: '#000000' }, // Black
    { name: 'Services', value: 25, color: '#e5e7eb' }, // Gray
];

const AnalyticsPage = () => {
    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 space-y-8 bg-white min-h-screen">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-black pb-6">
                    <div>
                        <h1 className="text-6xl font-black uppercase italic tracking-tighter">Market <span className="text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Intelligence</span></h1>
                        <p className="font-bold text-gray-500 uppercase tracking-widest text-xs mt-2 flex items-center gap-2">
                            <FiActivity className="text-black" /> Real-time Performance Tracking
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <select className="border-2 border-black p-2 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                        <button className="bg-black text-white px-4 py-2 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] hover:bg-yellow-400 hover:text-black transition-all">
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* --- TOP METRICS --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Revenue', value: '$12,450', change: '+12.5%', up: true, icon: <FiDollarSign /> },
                        { label: 'Active Quests', value: '48', change: '+4', up: true, icon: <FiZap /> },
                        { label: 'Store Visits', value: '2,840', change: '-2.1%', up: false, icon: <FiUsers /> },
                        { label: 'Conversion', value: '3.2%', change: '+0.8%', up: true, icon: <FiTrendingUp /> },
                    ].map((stat, i) => (
                        <div key={i} className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
                            <div className="flex justify-between items-start relative z-10">
                                <div className="p-2 bg-black text-yellow-400 border-2 border-black">
                                    {stat.icon}
                                </div>
                                <div className={`flex items-center text-xs font-black ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.change} {stat.up ? <FiArrowUpRight /> : <FiArrowDownRight />}
                                </div>
                            </div>
                            <div className="mt-4 relative z-10">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black italic tracking-tighter">{stat.value}</p>
                            </div>
                            {/* Decorative background element */}
                            <div className="absolute -right-4 -bottom-4 text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiShoppingBag size={100} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- MAIN CHARTS GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Revenue Growth Line Chart */}
                    <div className="lg:col-span-2 border-4 border-black bg-white p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black uppercase italic">Revenue Stream</h2>
                            <span className="bg-yellow-400 px-2 py-1 border-2 border-black text-[10px] font-black uppercase">Live Updates</span>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={{ stroke: '#000', strokeWidth: 2 }}
                                        tick={{ fontWeight: 'bold', fill: '#000', fontSize: 10 }}
                                    />
                                    <YAxis
                                        axisLine={{ stroke: '#000', strokeWidth: 2 }}
                                        tick={{ fontWeight: 'bold', fill: '#000', fontSize: 10 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#facc15' }}
                                    />
                                    <Line
                                        type="stepAfter"
                                        dataKey="sales"
                                        stroke="#000"
                                        strokeWidth={4}
                                        dot={{ r: 6, fill: '#facc15', stroke: '#000', strokeWidth: 2 }}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Breakdown Bar Chart */}
                    <div className="border-4 border-black bg-white p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black uppercase italic mb-8">Niche Distribution</h2>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontWeight: 'bold', fill: '#000', fontSize: 12 }}
                                    />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#000" strokeWidth={2} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {categoryData.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-xs font-black uppercase">
                                    <span className="flex items-center gap-2">
                                        <div className="w-3 h-3 border border-black" style={{ backgroundColor: item.color }} />
                                        {item.name}
                                    </span>
                                    <span>{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- RECENT ACTIVITY TABLE --- */}
                <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(250,204,21,1)]">
                    <div className="p-4 border-b-4 border-black bg-black text-white">
                        <h2 className="text-lg font-black uppercase tracking-widest">Recent Transactions</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-black bg-gray-50">
                                    <th className="p-4 text-[10px] font-black uppercase">Customer</th>
                                    <th className="p-4 text-[10px] font-black uppercase">Status</th>
                                    <th className="p-4 text-[10px] font-black uppercase">Amount</th>
                                    <th className="p-4 text-[10px] font-black uppercase">Quest ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-black">
                                {[
                                    { user: "User_882", status: "Completed", price: "$450.00", id: "Q-9921" },
                                    { user: "Retro_Fan", status: "Pending", price: "$120.00", id: "Q-9922" },
                                    { user: "Cyber_Hunter", status: "Disputed", price: "$89.00", id: "Q-9923" },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-yellow-50 font-bold text-sm">
                                        <td className="p-4 font-black">{row.user}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 border-2 border-black text-[10px] uppercase
                                                ${row.status === 'Completed' ? 'bg-green-400' : row.status === 'Pending' ? 'bg-yellow-400' : 'bg-red-400'}
                                            `}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono">{row.price}</td>
                                        <td className="p-4 text-xs opacity-50">{row.id}</td>
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

export default AnalyticsPage;