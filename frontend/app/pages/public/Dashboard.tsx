import DashboardLayout from "~/components/layouts/DashboardLayout";


// --- Types ---
interface Listing {
    id: number;
    title: string;
    category: string;
    price: string;
    status: 'Active' | 'Under Review' | 'Sold';
    views: number;
}

// --- Mock Data ---
const USER_LISTINGS: Listing[] = [
    { id: 1, title: "Modern 2-Bedroom Condo", category: "Real Estate", price: "$2,500/mo", status: "Active", views: 1240 },
    { id: 2, title: "2023 Electric Sedan", category: "Vehicles", price: "$45,000", status: "Under Review", views: 89 },
    { id: 3, title: "Vintage Leather Sofa", category: "Furniture", price: "$1,200", status: "Sold", views: 560 },
];

const Dashboard = () => {
    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto w-full">

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard label="Live Listings" value="12" color="bg-black" textColor="text-yellow-400" />
                    <StatCard label="Total Views" value="48.2k" color="bg-white" />
                    <StatCard label="Messages" value="5" color="bg-yellow-400" />
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h3 className="font-black text-lg uppercase tracking-tight">Active Inventory</h3>
                        <button className="text-xs font-bold px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded">Export CSV</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-xs uppercase text-gray-400 font-bold">
                                    <th className="px-6 py-4">Item Details</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Views</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {USER_LISTINGS.map((item) => (
                                    <tr key={item.id} className="group hover:bg-yellow-50/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-gray-900">{item.title}</p>
                                            <p className="text-xs text-gray-400">{item.category}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${item.status === 'Active' ? 'border-green-500 text-green-600 bg-green-50' :
                                                item.status === 'Sold' ? 'border-gray-500 text-gray-600 bg-gray-50' :
                                                    'border-yellow-600 text-yellow-700 bg-yellow-50'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 font-mono font-bold text-sm">{item.price}</td>
                                        <td className="px-6 py-5 text-sm text-gray-600">{item.views.toLocaleString()}</td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 hover:bg-black hover:text-white rounded-md transition-all">
                                                <EditIcon />
                                            </button>
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

// --- Sub-components ---


const StatCard = ({ label, value, color = "bg-white", textColor = "text-black" }: any) => (
    <div className={`${color} ${textColor} p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
        <p className={`text-xs font-bold uppercase tracking-wider opacity-70 mb-2`}>{label}</p>
        <p className="text-4xl font-black italic tracking-tighter">{value}</p>
    </div>
);


const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);

export default Dashboard;