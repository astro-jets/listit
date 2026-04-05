import React, { useState, type ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
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

