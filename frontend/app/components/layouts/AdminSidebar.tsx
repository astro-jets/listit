import React from 'react';
import { FiShoppingBag, FiMessageCircle, FiPackage, FiGlobe } from "react-icons/fi";
import { useLocation, Link } from "react-router";

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsCollapsed: (val: boolean) => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
    const location = useLocation();

    return (
        <aside
            className={`
        ${isSidebarOpen ? 'w-72' : 'w-20'} 
        bg-black text-white transition-all duration-300 ease-in-out 
        flex flex-col border-r border-yellow-500/20 sticky top-0 h-screen
      `}
        >
            {/* Logo Section */}
            <div className="p-6 flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 bg-yellow-400 rounded-full shrink-0 flex items-center justify-center text-black font-black">
                    L
                </div>
                {isSidebarOpen && (
                    <span className="font-black text-xl tracking-tighter text-yellow-400 animate-in fade-in duration-500">
                        LISTIT.
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-10 px-3 space-y-2">
                <SidebarItem
                    icon={DashboardIcon}
                    label="Dashboard"
                    url="/admin/dashboard"
                    isOpen={isSidebarOpen}
                    currentPath={location.pathname}
                />
                <SidebarItem
                    icon={FiShoppingBag}
                    label="Shops"
                    url="/admin/shops"
                    isOpen={isSidebarOpen}
                    currentPath={location.pathname}
                />
                <SidebarItem
                    icon={FiPackage}
                    label="Listings"
                    url="/admin/listings"
                    isOpen={isSidebarOpen}
                    currentPath={location.pathname}
                />
                <SidebarItem
                    icon={FiMessageCircle}
                    label="Reviews"
                    url="/admin/reviews"
                    isOpen={isSidebarOpen}
                    currentPath={location.pathname}
                />
                <SidebarItem
                    icon={ChartIcon}
                    label="Analytics"
                    url="/admin/analytics"
                    isOpen={isSidebarOpen}
                    currentPath={location.pathname}
                />
            </nav>

            {/* Footer Action */}
            <div className="p-4">
                <Link
                    to={'/'}
                    className={`
            w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold 
            py-3 rounded-lg flex items-center justify-center gap-2 
            transition-all active:scale-95 shadow-[0_0_15px_rgba(250,204,21,0.2)]
          `}
                >
                    <FiGlobe size={30} />
                    {isSidebarOpen && <span className="whitespace-nowrap">Public View</span>}
                </Link>
            </div>
        </aside>
    );
};

// --- Single Consolidated Sidebar Item ---
const SidebarItem = ({ icon: Icon, label, url, isOpen, currentPath }: any) => {
    // Check if active (exact match for home, startsWith for sub-pages)
    const isActive = currentPath === url || (url !== '/' && currentPath.startsWith(url));

    return (
        <Link
            to={url}
            title={!isOpen ? label : ""}
            className={`
        relative flex items-center p-3 rounded-lg transition-all duration-200 group
        ${isActive
                    ? 'bg-yellow-400 text-black font-bold'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }
        ${!isOpen ? 'justify-center' : 'gap-4'}
      `}
        >

            <div className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                <Icon size={20} />
            </div>

            {isOpen && (
                <span className="text-sm tracking-tight whitespace-nowrap animate-in slide-in-from-left-2">
                    {label}
                </span>
            )}
        </Link>
    );
};

// --- Raw SVG Icons ---
const DashboardIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
);
const ListIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
);
const ChartIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
);
const UserIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const PlusIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

export default AdminSidebar;