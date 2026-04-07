import React, { useEffect, useState, type ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useNavigate } from 'react-router';
import { useAuth } from '~/context/AuthContext';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
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
        <div className="flex min-h-screen bg-gray-50 text-black font-sans">

            <div className="hidden md:block">
                <AdminSidebar isSidebarOpen={isSidebarOpen} setIsCollapsed={setSidebarOpen} />
            </div>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col">
                <AdminHeader />
                {children}
            </main>
        </div>
    );
}

export default AdminLayout;

