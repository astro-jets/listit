import { useState } from "react";
import {
    FiMenu,
    FiX,
    FiSearch,
    FiUser,
} from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "~/context/AuthContext";

const PublicHeader = ({ showSearchOnHome = true }: { showSearchOnHome?: boolean }) => {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/search?q=${encodeURIComponent(query)}`);
    };

    // Check if we are on the root path
    const isHomePage = location.pathname === "/";

    // Logic to determine if search should be visible
    const shouldShowSearch = !isHomePage || showSearchOnHome;

    return (
        <header className="sticky top-0 z-50 bg-white border-b-[4px] border-black">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-20">

                    {/* LOGO - Brutalist Style */}
                    <Link to="/" className="text-2xl font-black italic tracking-tighter uppercase border-[3px] border-black px-3 py-1 bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                        LIST<span className="text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">.IT</span>
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-8 font-black uppercase text-xs tracking-widest">
                        <Link to="/explore" className="hover:underline decoration-[3px] decoration-yellow-400 underline-offset-4">
                            Explore
                        </Link>
                        <Link to="/shops" className="hover:underline decoration-[3px] decoration-yellow-400 underline-offset-4">
                            Shops
                        </Link>

                        {user && user.role === 2 && (
                            <>
                                <Link to="/myshop" className="hover:underline decoration-[3px] decoration-yellow-400 underline-offset-4">
                                    My Shop
                                </Link>
                                <Link to="/favorites" className="hover:underline decoration-[3px] decoration-yellow-400 underline-offset-4">
                                    Favorites
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* UPDATED SEARCH FORM */}
                    <form
                        onSubmit={handleSearch}
                        className={`hidden md:flex items-center relative w-64 transition-all duration-300 ${shouldShowSearch ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                            }`}
                    >
                        <input
                            type="text"
                            placeholder="SEARCH INTEL..."
                            className="w-full bg-white border-[3px] border-black py-2 pr-10 pl-4 font-bold uppercase text-sm focus:bg-yellow-50 outline-none transition-all placeholder:text-zinc-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px]"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:scale-110 transition-transform">
                            <FiSearch size={20} strokeWidth={3} />
                        </button>
                    </form>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to={user.role === 2 ? "/dashboard" : "/admin/dashboard"} className="hidden md:flex items-center gap-2 font-black uppercase text-xs border-b-2 border-black pb-1 hover:text-yellow-600 transition-colors">
                                    <FiUser size={16} strokeWidth={3} />
                                    {user.username}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="hidden md:block text-[10px] font-black uppercase bg-black text-white px-3 py-1 hover:bg-red-500 transition-colors"
                                >
                                    Log_Out
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden md:block text-xs font-black uppercase bg-yellow-400 border-[3px] border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                Log In
                            </Link>
                        )}

                        {/* MOBILE MENU BUTTON */}
                        <button onClick={() => setOpen(!open)} className="md:hidden p-2 border-[3px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            {open ? <FiX size={24} strokeWidth={3} /> : <FiMenu size={24} strokeWidth={3} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU - Hard Box */}
            {open && (
                <div className="md:hidden bg-white text-black border-t-[4px] border-black p-6 space-y-6 font-black uppercase tracking-tighter">
                    <Link to="/explore" className="block text-xl border-b-2 border-zinc-100 pb-2">Explore</Link>
                    <Link to="/shops" className="block text-xl border-b-2 border-zinc-100 pb-2">Shops</Link>

                    {user && (
                        <>
                            <Link to="/myshop" className="block text-xl border-b-2 border-zinc-100 pb-2">My Shop</Link>
                            <Link to="/favorites" className="block text-xl border-b-2 border-zinc-100 pb-2">Favorites</Link>
                        </>
                    )}

                    {!user ? (
                        <Link to="/login" className="block bg-yellow-400 border-[3px] border-black text-center py-4 text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            Log In
                        </Link>
                    ) : (
                        <div className="space-y-4">
                            <Link to="/dashboard" className="flex justify-center items-center gap-3 bg-black text-white py-4 text-xl">
                                <FiUser size={20} />
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="w-full text-center py-2 text-red-600 underline text-sm"
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default PublicHeader;