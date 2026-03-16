import React, { useState, type ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    return (
        <div className="flex min-h-screen bg-gray-50 text-black font-sans">

            <AdminSidebar isSidebarOpen={isSidebarOpen} setIsCollapsed={setSidebarOpen} />

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col">
                <AdminHeader />
                {children}
            </main>
        </div>
    );
}

export default AdminLayout;

