import DashboardLayout from "~/components/layouts/DashboardLayout";

const AdminListings = () => {
    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <div className="bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(250,204,21,1)]">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Global Moderation</h1>
                    <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest">Reviewing all active marketplace items</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="border-4 border-black group bg-white">
                            <div className="h-40 bg-gray-200 border-b-4 border-black relative">
                                <div className="absolute top-2 left-2 bg-white border-2 border-black px-2 py-1 text-[8px] font-black uppercase">
                                    Shop: Tech_Gizmo
                                </div>
                            </div>
                            <div className="p-4 space-y-2">
                                <h3 className="font-black uppercase text-sm truncate">Restored Vintage Camera</h3>
                                <p className="font-mono text-lg font-black">$450.00</p>
                                <div className="flex gap-2 pt-2">
                                    <button className="flex-1 bg-red-500 text-white border-2 border-black py-1 font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">Flag</button>
                                    <button className="flex-1 border-2 border-black py-1 font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminListings;