import React, { useEffect, useState, type ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useNavigate } from 'react-router';
import { useAuth } from '~/context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    useEffect(() => {
        // Only redirect once we are sure the auth check is finished
        if (!loading && !user) {
            navigate('/');
        }
        if (user && user.role !== 1) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    // Show a loading state or nothing while checking auth 
    // to prevent content "flashing" for unauthorized users
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <p className="font-black uppercase tracking-widest animate-pulse">
                    Authenticating_Access...
                </p>
            </div>
        );
    }
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-black font-sans">
            {/* --- MOBILE TOP NAV --- */}
            <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b-4 border-black sticky top-0 z-50">
                <h1 className="font-black uppercase italic tracking-tighter text-xl">
                    List <span className="text-yellow-400">IT</span>
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


                    <AdminSidebar isSidebarOpen={isSidebarOpen} setIsCollapsed={setSidebarOpen} />
                </div>
            </aside>

            {/* --- BACKDROP (Mobile Only) --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-55 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col w-full min-w-0">
                <div className="hidden md:block">
                    <AdminHeader />
                </div>

                <div className="flex-1 overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;

