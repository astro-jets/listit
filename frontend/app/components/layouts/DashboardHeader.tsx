// DashboardHeader.tsx
import { useNavigate } from "react-router"; // Import navigate
import { useAuth } from "~/context/AuthContext";
import { FiLogOut } from "react-icons/fi";

const DashboardHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    console.log("DashboardHeader Rendered - User:", user);
    const handleLogout = () => {
        logout();          // Clears context & localStorage
        navigate("/login"); // Clean SPA navigation
    };

    return (
        <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-8 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase italic">Dashboard</h2>

            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-black uppercase">{user?.username || "Questant"}</p>
                    <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">
                        {user?.role === 1 ? "Admin" : "Seller"}
                    </p>
                </div>

                {/* User Avatar */}
                <div className="w-10 h-10 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-yellow-400 overflow-hidden">
                    {user?.avatar_url ? (
                        <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full font-bold">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className="p-2 border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                >
                    <FiLogOut size={18} strokeWidth={3} />
                </button>
            </div>
        </header>
    );
}

export default DashboardHeader;