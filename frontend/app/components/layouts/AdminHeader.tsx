import { useAuth } from "~/context/AuthContext";
import { FiLogOut } from "react-icons/fi";

const AdminHeader = () => {
    const { user, logout } = useAuth(); //

    return (
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <h2 className="text-xl font-bold uppercase tracking-tight">
                Administration <span className="text-yellow-500">Dashboard</span>
            </h2>

            <div className="flex items-center gap-6">
                {/* ADMIN DETAILS */}
                <div className="flex items-center gap-4 border-r border-gray-200 pr-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-black capitalize">
                            {user?.username || "Admin User"} {/* */}
                        </p>
                        <p className="text-[10px] uppercase font-black text-yellow-600 bg-yellow-100 px-1 rounded">
                            System Administrator
                        </p>
                    </div>

                    {/* AVATAR */}
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt="Admin"
                            className="w-10 h-10 rounded-full bg-black border-2 border-yellow-400 object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-black border-2 border-yellow-400 flex items-center justify-center text-white text-xs font-bold">
                            {user?.username?.charAt(0).toUpperCase() || "A"}
                        </div>
                    )}
                </div>

                {/* LOGOUT BUTTON */}
                <button
                    onClick={logout} //
                    className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors group"
                    title="Sign Out"
                >
                    <span className="text-xs font-bold hidden md:block">Logout</span>
                    <FiLogOut className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </header>
    );
}

export default AdminHeader;