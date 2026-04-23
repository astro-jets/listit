// ~/components/layouts/DashboardLayout.tsx
import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { BsGlobe } from "react-icons/bs";
import { Link } from "react-router";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-black font-sans">

            {/* --- MOBILE TOP NAV --- */}
            <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b-4 border-black sticky top-0 z-50">
                <h1 className="font-black uppercase italic tracking-tighter text-xl">
                    Quest <span className="text-yellow-400">Finder</span>
                </h1>
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 border-2 border-black bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                    <FiMenu size={24} />
                </button>
            </header>

            {/* --- SIDEBAR / MOBILE DRAWER --- */}
            <aside className={`
                fixed inset-y-0 left-0 z-60 w-20 bg-white transform transition-transform duration-300 ease-in-out 
                border-r-4 border-black
                md:relative md:translate-x-0 md:flex
                ${isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full"}
            `}>
                <div className="flex relative h-full w-full">
                    {/* Mobile Close Button */}

                    <button onClick={() => setSidebarOpen(false)} className="p-2 z-999 border-2 absolute top-4 right-4 md:hidden border-white bg-amber-400 rounded-full active:translate-x-0.5 active:translate-y-0.5 transition-all">
                        <FiX size={24} />
                    </button>


                    <DashboardSidebar isSidebarOpen={isSidebarOpen} setIsCollapsed={setSidebarOpen} />
                </div>
            </aside>

            {/* --- BACKDROP (Mobile Only) --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col w-full min-w-0">
                {/* Desktop Header remains hidden or visible based on your DashboardHeader logic */}
                <div className="hidden md:block">
                    <DashboardHeader />
                </div>

                <div className="flex-1 overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;