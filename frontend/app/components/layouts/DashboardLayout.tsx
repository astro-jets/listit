import React, { useEffect, useState, type ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { useAuth } from '~/context/AuthContext';
import { useNavigate } from 'react-router';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        // Only redirect once we are sure the auth check is finished
        if (!loading && !user) {
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

    // If no user, return null while the useEffect handles the redirect
    if (!user) return null;
    return (
        <div className="flex min-h-screen bg-gray-50 text-black font-sans">
            <div className="hidden md:block">
                <DashboardSidebar isSidebarOpen={isSidebarOpen} setIsCollapsed={setSidebarOpen} />
            </div>
            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col">
                <DashboardHeader />
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;

