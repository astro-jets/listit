import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiArrowRight, FiInfo, FiExternalLink } from "react-icons/fi";
import PublicHeader from "~/components/layouts/PublicLayout";
import { getFeaturedShops } from "~/services/listing.service";
import type { Shop } from "~/services/types/Shop";
import { Link } from "react-router";

const ShopsPage = () => {
    const [shops, setShops] = useState<Shop[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const res = await getFeaturedShops();
                setShops(res);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    const filteredShops = shops.filter(shop =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-black selection:bg-yellow-400 font-sans">
            <PublicHeader />

            {/* HEADER SECTION - Aggressive Brutalist Layout */}
            <div className="pt-20 pb-12 px-6 max-w-7xl mx-auto border-b-[6px] border-black mb-12">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                    <div className="space-y-4">
                        <div className="inline-block bg-black text-white px-4 py-1 mb-2 shadow-[4px_4px_0px_0px_rgba(250,204,21,1)]">
                            <span className="text-xs font-black uppercase tracking-widest italic">Live Database v.04</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
                            Guild <span className="underline decoration-[12px] decoration-yellow-400 underline-offset-8">Registry</span>
                        </h1>
                        <p className="text-xl font-bold text-zinc-800 uppercase max-w-xl leading-tight">
                            Scanning verified local smiths, alchemists, and master traders currently active in the sector.
                        </p>
                    </div>

                    {/* BRUTALIST SEARCH BAR */}
                    <div className="relative w-full lg:w-[400px]">
                        <div className="absolute inset-0 bg-black translate-x-2 translate-y-2" />
                        <div className="relative flex items-center bg-white border-[4px] border-black p-1">
                            <FiSearch className="ml-4 text-black" size={24} />
                            <input
                                type="text"
                                placeholder="FILTER BY NAME..."
                                className="w-full bg-transparent py-4 px-4 font-black uppercase text-lg focus:outline-none placeholder:text-zinc-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SHOPS GRID */}
            <main className="max-w-7xl mx-auto px-6 pb-24">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[400px] bg-zinc-100 border-[4px] border-black animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredShops.map((shop, i) => (
                            <ShopCard key={shop.id} shop={shop} index={i} />
                        ))}
                    </div>
                )}

                {!loading && filteredShops.length === 0 && (
                    <div className="text-center py-32 border-[4px] border-dashed border-black bg-zinc-50">
                        <FiInfo size={64} className="mx-auto text-black mb-6" />
                        <h2 className="text-3xl font-black uppercase italic italic-bold">Signal Lost</h2>
                        <p className="text-zinc-600 font-bold uppercase mt-2">No shopkeepers found matching that designation.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

// SUB-COMPONENT: ShopCard (Nebutalist Overhaul)
const ShopCard = ({ shop, index }: { shop: Shop, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative"
        >
            {/* The "Hard Shadow" Background */}
            <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 transition-transform group-hover:translate-x-5 group-hover:translate-y-5" />

            <div className="relative flex flex-col bg-white border-[4px] border-black h-full overflow-hidden transition-transform active:translate-x-1 active:translate-y-1">

                {/* Banner / Logo Area */}
                <div className="relative h-48 w-full border-b-[4px] border-black overflow-hidden bg-zinc-200">
                    <img
                        src={shop.logo_url || "https://via.placeholder.com/600x400"}
                        className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
                        alt={shop.name}
                    />

                    {/* Status Badge - Sticker Style */}
                    <div className="absolute top-4 left-4 bg-yellow-400 border-[2px] border-black px-3 py-1 text-[10px] font-black uppercase tracking-tighter -rotate-2">
                        {shop.status || "ACTIVE"}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none group-hover:underline decoration-yellow-400 decoration-4 underline-offset-2">
                            {shop.name}
                        </h3>
                        <div className="inline-flex items-center gap-2 bg-zinc-100 border border-black/10 px-2 py-0.5 text-[10px] font-black uppercase text-zinc-600">
                            <FiMapPin className="text-black" />
                            <span>{shop.address_text}</span>
                        </div>
                    </div>

                    <p className="text-sm font-bold text-zinc-700 uppercase leading-snug line-clamp-3">
                        {shop.description}
                    </p>

                    <div className="pt-6 mt-auto flex items-center justify-between border-t-[3px] border-black border-dashed">

                        <Link
                            to={`/shop/${shop.id}`}
                            className="bg-black text-white px-4 py-2 font-black uppercase text-xs flex items-center gap-2 hover:bg-yellow-400 hover:text-black transition-colors"
                        >
                            Enter Shop <FiExternalLink />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ShopsPage;