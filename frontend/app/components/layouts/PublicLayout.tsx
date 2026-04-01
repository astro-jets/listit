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

        // Redirect to the listings page with the search query in the URL
        navigate(`/search?q=${encodeURIComponent(query)}`);
    };
    return (
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4">

                <div className="flex items-center justify-between h-16">

                    {/* LOGO */}
                    <Link to="/" className="text-xl font-bold text-white">
                        <span className="text-yellow-400">Studio</span> X
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
                        <Link to="/explore" className="hover:text-yellow-400 transition">
                            Explore
                        </Link>
                        <Link to="/shops" className="hover:text-yellow-400 transition">
                            Shops
                        </Link>
                        <Link to="/myshop" className="hover:text-yellow-400 transition">
                            My Shop
                        </Link>
                        <Link to="/favorites" className="hover:text-yellow-400 transition">
                            Favorites
                        </Link>
                    </nav>

                    {/* SEARCH */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center">
                        <div className="flex items-center pr-2 w-full max-w-xl bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
                            <input
                                type="text"
                                placeholder="Search items..."
                                className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder:text-zinc-400"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />

                            <button className="cursor-pointer bg-yellow-400 text-black p-2 hover:bg-yellow-300 transition rounded-full  border border-white/5 ">
                                <FiSearch />
                            </button>
                        </div>
                    </form>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-4">

                        {/* AUTH */}
                        {user ? (
                            <Link to="/dashboard" className="hidden md:flex items-center gap-3 cursor-pointer">
                                <FiUser size={18} />
                                {user.username}

                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden md:block text-sm bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                            >
                                Login
                            </Link>
                        )}

                        {/* MOBILE MENU BUTTON */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="md:hidden text-white"
                        >
                            {open ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {open && (
                <div className="md:hidden bg-black border-t border-white/10 px-4 py-4 space-y-4">

                    {/* SEARCH */}
                    <form onSubmit={handleSearch} className="items-center">
                        <div className="flex items-center pr-2 w-full max-w-xl bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
                            <input
                                type="text"
                                placeholder="Search items..."
                                className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder:text-zinc-400"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />

                            <button className="cursor-pointer bg-yellow-400 text-black p-2 hover:bg-yellow-300 transition rounded-full  border-3 border-white/5 ">
                                <FiSearch />
                            </button>
                        </div>
                    </form>


                    {/* LINKS */}
                    <Link to="/explore" className="block text-zinc-300">
                        Explore
                    </Link>
                    <Link to="/shops" className="block text-zinc-300">
                        Shops
                    </Link>
                    <Link to="/sell" className="block text-zinc-300">
                        Sell
                    </Link>

                    {/* AUTH */}
                    {!user ? (
                        <Link
                            to="/login"
                            className="block bg-white text-black text-center py-2 rounded-lg font-semibold"
                        >
                            Login
                        </Link>
                    ) : (
                        <Link to="/dashboard" className="flex space-x-2 px-4 items-center bg-white text-black text-center py-2 rounded-lg font-semibold">
                            <FiUser size={18} />
                            <p>Dashboard</p>
                        </Link>
                    )}
                </div>
            )}
        </header>

    );
};

export default PublicHeader;
