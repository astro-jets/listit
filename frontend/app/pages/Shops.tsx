import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiArrowRight, FiInfo } from "react-icons/fi";
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

    // Filter shops based on search
    const filteredShops = shops.filter(shop =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
            <PublicHeader />

            {/* HEADER SECTION */}
            <div className="md:pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            The <span className="text-yellow-400">Guild</span> Directory
                        </h1>
                        <p className="text-zinc-500 max-w-md">
                            Browse verified local smiths, alchemists, and traders across the realm.
                        </p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search shops..."
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-yellow-400/50 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* SHOPS GRID */}
            <main className="max-w-7xl mx-auto px-6 pb-24">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-zinc-900/50 animate-pulse rounded-2xl border border-white/5" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredShops.map((shop, i) => (
                            <ShopCard key={shop.id} shop={shop} index={i} />
                        ))}
                    </div>
                )}

                {!loading && filteredShops.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
                        <FiInfo size={48} className="mx-auto text-zinc-700 mb-4" />
                        <p className="text-zinc-500 text-lg">No shopkeepers found by that name.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

// SUB-COMPONENT: ShopCard
const ShopCard = ({ shop, index }: { shop: Shop, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8 }}
            className="group relative flex flex-col bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-yellow-400/30 transition-all duration-300"
        >
            {/* Banner / Logo Area */}
            <div className="relative h-40 w-full overflow-hidden">
                <img
                    src={shop.logo_url || "https://via.placeholder.com/600x400"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={shop.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                {/* Quick Badge */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-yellow-400 border border-yellow-400/20">
                    {shop.status}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold group-hover:text-yellow-400 transition-colors">
                        {shop.name}
                    </h3>
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                        <FiMapPin className="text-yellow-400/60" />
                        <span>{typeof shop.location === 'string' ? shop.location : "City Center"}</span>
                    </div>
                </div>

                <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">
                    {shop.description}
                </p>

                <div className="pt-4 mt-auto flex items-center justify-between border-t border-white/5">
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-tighter">
                        {60} Products
                    </span>
                    <Link to={`/shop/${shop.id}`} className="flex items-center gap-2 text-sm font-bold text-yellow-400 group-hover:gap-3 transition-all">
                        Enter Shop <FiArrowRight />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ShopsPage;