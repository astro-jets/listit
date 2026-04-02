import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiFilter, FiChevronRight, FiMapPin } from "react-icons/fi";
import ListingCard from "~/components/listings/ListingCard";
import PublicHeader from "../components/layouts/PublicLayout";
import { getAllListings, getFeaturedShops } from "~/services/listing.service";
import { Link, useNavigate } from "react-router";
import GridLoader from "~/components/modals/GridLoader";
import type { Shop } from "~/services/types/Shop";
import ListingGrid from "~/components/listings/ListingGrid";


const PublicDiscovery = () => {
    const [query, setquery] = useState("");
    const [listings, setListings] = useState([]);
    const [shops, setShops] = useState<Shop[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [shopsLoading, setShopsLoading] = useState(true);

    const navigate = useNavigate();

    // Data Fetching
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const res = await getAllListings(page);
                setListings(res.data.data);
                setTotalPages(res.pagination.totalPages || 1);
            } catch (err) {
                console.error("Error loading listings", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [page]);

    useEffect(() => {
        const loadShops = async () => {
            setShopsLoading(true);
            try {
                const res = await getFeaturedShops();
                setShops(res);
            } finally {
                setShopsLoading(false);
            }
        };
        loadShops();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/search?q=${encodeURIComponent(query)}`);
    };

    // Reusable Grid Component to keep the JSX clean


    return (
        <>
            <PublicHeader />
            <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
                {/* HERO SECTION */}
                <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                    <motion.img
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.4 }}
                        transition={{ duration: 1.5 }}
                        src="/banner.jpg"
                        className="absolute w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />

                    <div className="relative text-center space-y-6 px-6 z-10">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl md:text-7xl font-bold tracking-tight"
                        >
                            Discover Rare Items <br />
                            <span className="text-yellow-400">Across the Market</span>
                        </motion.h2>

                        <form onSubmit={handleSearch} className="hidden md:block max-w-2xl mx-auto relative group">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search items..."
                                className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-yellow-400/50 focus:ring-4 focus:ring-yellow-400/10 transition-all"
                                value={query}
                                onChange={(e) => setquery(e.target.value)}
                            />
                        </form>
                    </div>
                </section>

                <main className="max-w-7xl mx-auto px-6 py-12 space-y-20">

                    {/* EXPLORE SECTION */}
                    <section className="space-y-8">
                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <div>
                                <h2 className="text-3xl font-bold">Latest Gear</h2>
                                <p className="text-zinc-500 text-sm mt-1">Hand-picked arrivals from local smiths and artisans.</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-lg bg-zinc-900 border border-white/5 hover:border-yellow-400/40 transition">
                                    <FiFilter className="text-yellow-400" />
                                </button>
                            </div>
                        </div>

                        {loading ? <GridLoader /> : (
                            <>
                                {listings.length > 0 ? (
                                    <ListingGrid items={listings} />
                                ) : (
                                    <div className="py-20 text-center bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                                        <p className="text-zinc-500">The market seems quiet... try another search.</p>
                                    </div>
                                )}

                                {/* PAGINATION */}
                                <div className="flex justify-center items-center gap-3 mt-12">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`w-10 h-10 rounded-xl font-medium transition-all ${page === i + 1
                                                ? "bg-yellow-400 text-black scale-110"
                                                : "bg-zinc-900 text-zinc-500 hover:text-white border border-white/5"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>

                    {/* SHOPS NEAR YOU */}
                    <section className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold">Shops Near You</h2>
                            <Link to="/shops" className="text-yellow-400 hover:underline text-sm font-medium">
                                All Shops
                            </Link>
                        </div>

                        {shopsLoading ? <div className="h-40 flex items-center justify-center text-zinc-600">Gathering shopkeepers...</div> : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {shops.map((shop, i) => (
                                    <motion.div
                                        key={shop.id}
                                        whileHover={{ y: -5 }}
                                        className="group cursor-pointer rounded-2xl border border-white/5 bg-zinc-900/40 p-4 hover:bg-zinc-900 transition-colors"
                                    >
                                        <div className="relative h-48 w-full overflow-hidden rounded-xl">
                                            <img
                                                src={shop.logo_url || "https://via.placeholder.com/400"}
                                                className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-medium text-white/90">
                                                <FiMapPin className="text-yellow-400" />
                                                {/* {shop.location} */}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-between items-center">
                                            <h3 className="text-xl font-bold group-hover:text-yellow-400 transition-colors">{shop.name}</h3>
                                            <Link to={`/shop/${shop.id}`} className="text-[10px] bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full border border-yellow-400/20">
                                                OPEN
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* CALL TO ACTION */}
                    <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-yellow-400 to-yellow-500 text-black p-12">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-[80px]" />
                        <div className="relative max-w-2xl space-y-6">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                                Own a Store? <br />Join the Hustle
                            </h2>
                            <p className="text-black/70 text-lg font-medium leading-relaxed">
                                List your store and products for free. Help customers in your city find
                                exactly what they need and walk through your door.
                            </p>
                            <Link to="/signup" className="bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20">
                                List Your Store For Free
                            </Link>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-white/5 py-12 text-center">
                    <p className="text-zinc-600 text-sm tracking-widest uppercase font-bold">
                        © 2026 QUEST FINDER — Built for the Bold
                    </p>
                </footer>
            </div>
        </>
    );
};

export default PublicDiscovery;