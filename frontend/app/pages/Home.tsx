import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiMapPin } from "react-icons/fi";
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
    const [scrolledPastHero, setScrolledPastHero] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const res = await getAllListings(page);
                setListings(res.data || []);
                setTotalPages(res.pagination?.totalPages || 1);
            } catch (err) {
                console.error("Error loading listings", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [page]);

    useEffect(() => {
        const handleScroll = () => {
            // Adjust '500' to the height where you want the search bar to snap in
            if (window.scrollY > 500) {
                setScrolledPastHero(true);
            } else {
                setScrolledPastHero(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const loadShops = async () => {
            setShopsLoading(true);
            try {
                const res = await getFeaturedShops();
                setShops(res);
            } catch (err) {
                console.error("Error loading shops", err);
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
        <div className="min-h-screen bg-white text-black selection:bg-yellow-400">
            <PublicHeader showSearchOnHome={scrolledPastHero} />

            {/* IMAGE HERO SECTION */}
            <section className="relative h-[60vh] md:h-[75vh] flex items-center justify-center border-b-4 border-black overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/banner.jpg"
                        alt="Marketplace Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                </div>

                <div className="relative text-center space-y-6 md:space-y-8 px-4 z-10 w-full max-w-5xl">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter italic text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                    >
                        Find <span className="bg-yellow-400 text-black px-2 md:px-4 border-2 md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">Rare Gear</span> <br />
                        Fast & Local
                    </motion.h2>

                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group px-2">
                        <input
                            type="text"
                            placeholder="SEARCH THE MARKET..."
                            className="w-full bg-white border-[3px] border-black px-4 md:px-6 py-4 md:py-5 outline-none font-bold placeholder:text-zinc-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all"
                            value={query}
                            onChange={(e) => setquery(e.target.value)}
                        />
                        <button className="absolute right-5 top-1/2 -translate-y-1/2 bg-black text-yellow-400 p-2 md:p-3 border-2 border-black hover:bg-yellow-400 hover:text-black transition-colors">
                            <FiSearch size={20} className="md:w-6 md:h-6" />
                        </button>
                    </form>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 space-y-24 md:space-y-32">

                {/* EXPLORE SECTION */}
                <section className="space-y-8 md:space-y-12">
                    <div className="flex justify-between items-center border-b-4 border-black pb-4">
                        <h2 className="text-3xl md:text-4xl font-black uppercase italic leading-none">New Arrivals</h2>
                        <button className="p-2 md:p-3 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                            <FiFilter className="text-xl md:text-2xl" />
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

                            {/* PAGINATION */}
                            {totalPages > 1 && (
                                <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`w-10 h-10 md:w-12 md:h-12 border-[3px] border-black font-black transition-all ${page === i + 1
                                                ? "bg-yellow-400 translate-x-1 translate-y-1 shadow-none"
                                                : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-100"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* LOCAL MERCHANTS */}
                <section className="space-y-12">
                    <h2 className="text-3xl md:text-4xl font-black uppercase italic border-l-[8px] md:border-l-[12px] border-yellow-400 pl-4 md:pl-6">Local Merchants</h2>

                    {shopsLoading ? <div className="font-black animate-pulse uppercase">Scanning Local Area...</div> : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                            {shops.map((shop) => (
                                <Link to={`/shop/${shop.id}`}>
                                    <motion.div
                                        key={shop.id}
                                        whileHover={{ x: -4, y: -4 }}
                                        className="bg-white border-[3px] border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col"
                                    >
                                        <div className="h-48 md:h-56 border-[3px] border-black overflow-hidden relative bg-zinc-100">
                                            <img
                                                src={shop.logo_url || "https://via.placeholder.com/400?text=NO+LOGO"}
                                                className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                                alt={shop.name}
                                            />
                                            <div className="absolute top-2 right-2 bg-yellow-400 border-2 border-black px-2 py-1 font-black text-[10px] uppercase">
                                                Verified
                                            </div>
                                        </div>
                                        <div className="mt-6 flex flex-col flex-grow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">{shop.name}</h3>
                                                    <div className="flex items-center gap-2 font-bold text-zinc-500 text-[10px] mt-1 uppercase">
                                                        <FiMapPin className="text-black" />
                                                        {shop.address_text || "Region Unknown"}
                                                    </div>
                                                </div>
                                            </div>
                                            <Link
                                                to={`/shop/${shop.id}`}
                                                className="mt-auto w-full text-center bg-black text-white py-3 font-black uppercase hover:bg-yellow-400 hover:text-black border-2 border-black transition-colors"
                                            >
                                                Enter Shop
                                            </Link>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* CTA SECTION */}
                <section className="bg-white border-4 border-black p-6 md:p-12 shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] md:shadow-[12px_12px_0px_0px_rgba(250,204,21,1)] relative overflow-hidden">
                    <div className="relative z-10 space-y-6 md:space-y-8">
                        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                            Start <span className="text-yellow-500">Selling</span> <br className="hidden md:block" />Your Loot
                        </h2>
                        <p className="max-w-xl text-lg md:text-xl font-bold leading-tight uppercase">
                            Build your shop in seconds. No fees, no nonsense. Just pure commerce.
                        </p>
                        <Link to="/signup" className="inline-block w-full md:w-auto text-center bg-black text-yellow-400 px-10 py-4 md:py-5 border-[3px] border-black font-black text-xl md:text-2xl uppercase shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                            Open Store
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="bg-black py-12 md:py-16 text-center border-t-4 border-yellow-400 px-4">
                <p className="text-white text-sm md:text-lg font-black tracking-widest uppercase italic">
                    © 2026 QUEST FINDER — ALL RIGHTS RESERVED.
                </p>
            </footer>
        </div>
    );
};

export default PublicDiscovery;