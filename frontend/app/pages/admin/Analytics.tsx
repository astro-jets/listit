import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import DashboardLayout from '~/components/layouts/DashboardLayout';

const AdminAnalytics = () => {
    const data = [
        { name: 'Jan', users: 4000, shops: 240 },
        { name: 'Feb', users: 5500, shops: 290 },
        { name: 'Mar', users: 7200, shops: 400 },
    ];

    return (
        <DashboardLayout>
            <div className="p-6 space-y-8">
                <h1 className="text-6xl font-black uppercase italic tracking-tighter">System <span className="text-yellow-400">Metrics</span></h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* User Growth Chart */}
                    <div className="border-4 border-black p-6 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-400 border border-black" /> User Acquisition
                        </h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#000" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" axisLine={{ stroke: '#000', strokeWidth: 2 }} tick={{ fontStyle: 'bold', fill: '#000' }} />
                                    <YAxis hide />
                                    <Tooltip contentStyle={{ border: '4px solid black', fontWeight: '900', textTransform: 'uppercase' }} />
                                    <Line type="stepAfter" dataKey="users" stroke="#000" strokeWidth={5} dot={{ r: 8, fill: '#facc15', stroke: '#000', strokeWidth: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick System Log */}
                    <div className="border-4 border-black p-6 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black uppercase mb-6">Recent Events</h2>
                        <div className="space-y-4">
                            {[
                                { ev: "New Shop Verified", time: "2m ago", color: "bg-green-400" },
                                { ev: "Listing Flagged", time: "15m ago", color: "bg-red-500" },
                                { ev: "Server Load 80%", time: "1h ago", color: "bg-yellow-400" },
                            ].map((log, i) => (
                                <div key={i} className="flex justify-between items-center border-b-2 border-black pb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 border border-black ${log.color}`} />
                                        <span className="font-bold text-xs uppercase">{log.ev}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminAnalytics;