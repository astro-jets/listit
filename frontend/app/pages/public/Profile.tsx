import React, { useState } from 'react';
import {
    FiUser, FiSettings, FiMapPin, FiCalendar,
    FiStar, FiCheckCircle, FiEdit2, FiGrid,
    FiList, FiAward, FiMessageSquare, FiExternalLink
} from 'react-icons/fi';
import DashboardLayout from '~/components/layouts/DashboardLayout';

// --- Types ---
type ProfileTab = 'listings' | 'active-quests' | 'reviews';

const UserProfilePage = () => {
    const [activeTab, setActiveTab] = useState<ProfileTab>('listings');

    // Mock Data for the Profile
    const userData = {
        name: "Alex River",
        username: "@ariver_collector",
        bio: "Full-time vintage hunter and part-time tech explorer. Always looking for rare 90s electronics and modular synths.",
        location: "Brooklyn, NY",
        joined: "January 2024",
        stats: [
            { label: "Reputation", value: "4.9", icon: <FiStar className="text-yellow-500" /> },
            { label: "Quests Done", value: "24", icon: <FiCheckCircle className="text-green-500" /> },
            { label: "Total Sales", value: "142", icon: <FiAward className="text-blue-500" /> },
        ]
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white pb-20">

                {/* --- HEADER SECTION --- */}
                <div className="bg-yellow-400 border-b-4 border-black px-6 py-12">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-8">

                        {/* Avatar Box */}
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-48 md:h-48 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden">
                                <FiUser size={80} className="text-black opacity-20" />
                                {/* Overlay for Edit */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <span className="text-white font-black uppercase text-xs">Change Photo</span>
                                </div>
                            </div>
                            <button className="absolute -bottom-2 -right-2 bg-black text-white p-3 border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                <FiEdit2 size={18} />
                            </button>
                        </div>

                        {/* Title & Bio */}
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none text-black">
                                    {userData.name}
                                </h1>
                                <p className="text-xl font-black uppercase tracking-widest text-black/60">{userData.username}</p>
                            </div>

                            <p className="max-w-2xl text-lg font-bold text-black leading-tight bg-white/30 p-2 border-l-4 border-black">
                                "{userData.bio}"
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-black uppercase">
                                <span className="flex items-center gap-2 bg-black text-white px-3 py-1"><FiMapPin /> {userData.location}</span>
                                <span className="flex items-center gap-2 border-2 border-black px-3 py-1"><FiCalendar /> Joined {userData.joined}</span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <button className="bg-black text-white px-8 py-4 font-black uppercase tracking-widest border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:bg-white hover:text-black transition-all active:shadow-none active:translate-x-1">
                                Edit Profile
                            </button>
                            <button className="bg-white text-black px-8 py-4 font-black uppercase tracking-widest border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-100 transition-all active:shadow-none active:translate-x-1">
                                <FiSettings className="inline mr-2" /> Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- STATS BAR --- */}
                <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {userData.stats.map((stat, i) => (
                            <div key={i} className="bg-white border-4 border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between group hover:bg-yellow-50 transition-colors">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                                    <p className="text-4xl font-black italic tracking-tighter">{stat.value}</p>
                                </div>
                                <div className="text-4xl p-3 border-2 border-black bg-gray-50 group-hover:bg-white transition-colors">
                                    {stat.icon}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- CONTENT TABS --- */}
                <div className="max-w-6xl mx-auto px-6 mt-16 space-y-8">
                    <div className="flex border-b-4 border-black overflow-x-auto">
                        {(['listings', 'active-quests', 'reviews'] as ProfileTab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-10 py-5 font-black uppercase tracking-widest text-sm transition-all whitespace-nowrap
                                    ${activeTab === tab
                                        ? 'bg-black text-white border-t-4 border-x-4 border-black'
                                        : 'bg-transparent text-black hover:bg-yellow-400'
                                    }
                                `}
                            >
                                {tab.replace('-', ' ')}
                            </button>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Placeholder Content Cards */}
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="border-4 border-black bg-white group hover:-translate-y-2 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <div className="h-56 bg-gray-100 border-b-4 border-black relative">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                        <FiGrid size={100} />
                                    </div>
                                    <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-black text-xs uppercase tracking-widest">
                                        {activeTab === 'listings' ? 'For Sale' : 'In Progress'}
                                    </div>
                                </div>
                                <div className="p-6 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-black uppercase leading-none">Vintage Item #{item}</h3>
                                        <FiExternalLink className="text-gray-400" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-tighter">
                                        Item description snippet goes here to show detail...
                                    </p>
                                    <div className="pt-4 flex justify-between items-center border-t-2 border-black">
                                        <span className="font-mono font-black text-2xl">$45.00</span>
                                        <button className="bg-yellow-400 px-4 py-2 border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:bg-black hover:text-white transition-all">
                                            View Detail
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserProfilePage;