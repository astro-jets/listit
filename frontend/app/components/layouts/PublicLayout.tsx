import { useState } from "react";
import {
    FiMenu,
    FiX,
    FiSearch,
    FiUser,
    FiShoppingBag,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";

const PublicHeader = () => {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/search?q=${encodeURIComponent(query)}`);
    };

    return (
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* LOGO */}
                    <Link to="/" className="text-xl font-bold text-white">
                        <span className="text-yellow-400">LIST</span>.IT
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
                        <Link to="/explore" className="hover:text-yellow-400 transition">
                            Explore
                        </Link>
                        <Link to="/shops" className="hover:text-yellow-400 transition">
                            Shops
                        </Link>

                        {/* --- AUTH PROTECTED LINKS --- */}
                        {user && user.role === 2 && (
                            <>
                                <Link to="/myshop" className="hover:text-yellow-400 transition">
                                    My Shop
                                </Link>
                                <Link to="/favorites" className="hover:text-yellow-400 transition">
                                    Favorites
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* SEARCH - (Keep as is) */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center group relative">
                        <button type="submit" className="bg-yellow-500 rounded-full z-999 absolute right-4 top-1/2 -translate-y-1/2 p-1 cursor-pointer group-focus-within:bg-yellow-400 transition">
                            <FiSearch className=" text-zinc-500 " color="black" />
                        </button>
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-2 pr-12 pl-4 outline-none focus:border-yellow-400/50 focus:ring-4 focus:ring-yellow-400/10 transition-all"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to={user.role === 2 ? "/dashboard" : "/admin/dashboard"} className="hidden md:flex items-center gap-3 cursor-pointer text-white">
                                    <FiUser size={18} />
                                    {user.username}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="hidden md:block text-xs text-zinc-400 hover:text-white transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden md:block text-sm bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                            >
                                Login
                            </Link>
                        )}

                        {/* MOBILE MENU BUTTON */}
                        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
                            {open ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {open && (
                <div className="md:hidden bg-black border-t border-white/10 px-4 py-4 space-y-4">
                    {/* ... mobile search code ... */}

                    {/* LINKS */}
                    <Link to="/explore" className="block text-zinc-300">Explore</Link>
                    <Link to="/shops" className="block text-zinc-300">Shops</Link>

                    {/* --- AUTH PROTECTED MOBILE LINKS --- */}
                    {user && (
                        <>
                            <Link to="/myshop" className="block text-zinc-300">My Shop</Link>
                            <Link to="/favorites" className="block text-zinc-300">Favorites</Link>
                        </>
                    )}

                    {/* AUTH BUTTON */}
                    {!user ? (
                        <Link to="/login" className="block bg-white text-black text-center py-2 rounded-lg font-semibold">
                            Login
                        </Link>
                    ) : (
                        <div className="space-y-2">
                            <Link to="/dashboard" className="flex space-x-2 px-4 items-center bg-white text-black text-center py-2 rounded-lg font-semibold">
                                <FiUser size={18} />
                                <span>Dashboard</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="w-full text-center py-2 text-zinc-400 text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default PublicHeader;
