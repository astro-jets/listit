import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiMapPin } from "react-icons/fi";
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

    return (
        <>
            <PublicHeader />
            <div className="min-h-screen bg-white text-black selection:bg-yellow-400">

                {/* HERO SECTION - Neo-Brutalist Block */}
                <section className="relative h-[50vh] flex items-center justify-center bg-yellow-400 border-b-4 border-black">
                    <div className="relative text-center space-y-8 px-6 z-10">
                        <motion.h2
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic"
                        >
                            Find <span className="bg-white px-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">Rare Gear</span> <br />
                            Fast & Local
                        </motion.h2>

                        <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
                            <input
                                type="text"
                                placeholder="SEARCH THE MARKET..."
                                className="w-full bg-white border-[3px] border-black px-6 py-5 outline-none font-bold placeholder:text-zinc-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all"
                                value={query}
                                onChange={(e) => setquery(e.target.value)}
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-yellow-400 p-3 border-2 border-black hover:bg-zinc-800 transition-colors">
                                <FiSearch size={24} />
                            </button>
                        </form>
                    </div>
                </section>

                <main className="max-w-7xl mx-auto px-6 py-20 space-y-32">

                    {/* EXPLORE SECTION */}
                    <section className="space-y-12">
                        <div className="flex justify-between items-center border-b-4 border-black pb-4">
                            <div>
                                <h2 className="text-4xl font-black uppercase italic">New Arrivals</h2>
                            </div>
                            <button className="p-3 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                                <FiFilter className="text-2xl" />
                            </button>
                        </div>

                        {loading ? <GridLoader /> : (
                            <div className="space-y-12">
                                {listings.length > 0 ? (
                                    <ListingGrid items={listings} />
                                ) : (
                                    <div className="py-20 text-center border-4 border-black bg-zinc-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                        <p className="text-xl font-bold uppercase">The market is empty.</p>
                                    </div>
                                )}

                                {/* PAGINATION - Blocky Buttons */}
                                <div className="flex justify-center items-center gap-4">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`w-12 h-12 border-[3px] border-black font-black transition-all ${page === i + 1
                                                ? "bg-yellow-400 translate-x-1 translate-y-1 shadow-none"
                                                : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-100"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* SHOPS NEAR YOU - Card Overhaul */}
                    <section className="space-y-12">
                        <h2 className="text-4xl font-black uppercase italic border-l-12 border-yellow-400 pl-6">Local Merchants</h2>

                        {shopsLoading ? <div className="font-bold">SCANNING LOCAL AREA...</div> : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {shops.map((shop) => (
                                    <motion.div
                                        key={shop.id}
                                        whileHover={{ x: -4, y: -4 }}
                                        className="bg-white border-[3px] border-black p-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    >
                                        <div className="h-56 border-[3px] border-black overflow-hidden relative">
                                            <img
                                                src={shop.logo_url || "https://via.placeholder.com/400"}
                                                className="h-full w-full object-cover grayscale"
                                                alt={shop.name}
                                            />
                                            <div className="absolute top-2 right-2 bg-yellow-400 border-2 border-black px-2 py-1 font-black text-xs">
                                                LOCAL
                                            </div>
                                        </div>
                                        <div className="mt-6 flex justify-between items-start">
                                            <div>
                                                <h3 className="text-2xl font-black uppercase">{shop.name}</h3>
                                                <div className="flex items-center gap-2 font-bold text-zinc-500 text-sm mt-1 uppercase">
                                                    <FiMapPin /> {shop.name}
                                                </div>
                                            </div>
                                            <Link to={`/shop/${shop.id}`} className="bg-black text-white px-4 py-2 font-bold uppercase hover:bg-yellow-400 hover:text-black border-2 border-black transition-colors">
                                                Enter
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* CTA - High Contrast Yellow */}
                    <section className="bg-white border-4 border-black p-12 shadow-[12px_12px_0px_0px_rgba(250,204,21,1)] relative overflow-hidden">
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                                Start <span className="text-yellow-500">Selling</span> <br />Your Loot
                            </h2>
                            <p className="max-w-xl text-xl font-bold leading-tight uppercase">
                                Build your shop in seconds. No fees, no nonsense. Just pure commerce.
                            </p>
                            <Link to="/signup" className="inline-block bg-black text-yellow-400 px-10 py-5 border-[3px] border-black font-black text-2xl uppercase shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                                Open Store
                            </Link>
                        </div>
                    </section>
                </main>

                <footer className="bg-black py-16 text-center border-t-4 border-yellow-400">
                    <p className="text-white text-lg font-black tracking-widest uppercase italic">
                        © 2026 QUEST FINDER — ALL RIGHTS RESERVED.
                    </p>
                </footer>
            </div>
        </>
    );
};

export default PublicDiscovery;