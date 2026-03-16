import React, { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiEye, FiSearch, FiAlertCircle } from 'react-icons/fi';
import AdminLayout from '~/components/layouts/AdminLayout';

const AdminShops = () => {
    const [shops, setShops] = useState([
        { id: 'SH-101', name: "Tech Haven", owner: "Alex_99", status: 'Pending', joined: "Oct 12", items: 0 },
        { id: 'SH-102', name: "Retro Threads", owner: "Sarah_V", status: 'Verified', joined: "Oct 10", items: 45 },
        { id: 'SH-103', name: "Quick Gizmos", owner: "Mike_R", status: 'Suspended', joined: "Sept 20", items: 12 },
    ]);

    return (
        <AdminLayout>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-end border-b-4 border-black pb-4">
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter">Shop <span className="text-yellow-400">Registry</span></h1>
                    <div className="relative w-64">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
                        <input className="w-full border-2 border-black p-2 pl-10 text-xs font-bold uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" placeholder="SEARCH SHOPS..." />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {shops.map(shop => (
                        <div key={shop.id} className="border-4 border-black p-4 bg-white flex flex-col md:flex-row items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-50 transition-colors">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-black text-xl border-2 border-black italic">
                                    {shop.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black uppercase text-lg leading-none">{shop.name}</h3>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Owner: {shop.owner} • ID: {shop.id}</p>
                                </div>
                            </div>

                            <div className="flex gap-8 items-center mt-4 md:mt-0">
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase text-gray-400">Inventory</p>
                                    <p className="font-black italic">{shop.items} Items</p>
                                </div>
                                <div className={`px-3 py-1 border-2 border-black font-black text-[10px] uppercase
                                    ${shop.status === 'Verified' ? 'bg-green-400' : shop.status === 'Pending' ? 'bg-yellow-400' : 'bg-red-500 text-white'}
                                `}>
                                    {shop.status}
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 border-2 border-black hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><FiCheckCircle /></button>
                                    <button className="p-2 border-2 border-black hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><FiXCircle /></button>
                                    <button className="p-2 border-2 border-black bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><FiEye /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminShops;