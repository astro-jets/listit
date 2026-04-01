import ListingCard from "~/components/listings/ListingCard";
import { FiStar, FiMapPin, FiAlertCircle, FiLoader, FiCheckCircle, FiMessageSquare, FiSend } from "react-icons/fi";
import PublicHeader from "~/components/layouts/PublicLayout";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getShopListings } from "~/services/listing.service";
import { getShopById } from "~/services/shop.service";
import { motion } from "framer-motion";
import React from "react";
import { FaDirections } from "react-icons/fa";

const LocationViewer = React.lazy(() => import("../components/maps/LocationViewr"));

const ShopProfile = () => {
    const { id } = useParams<{ id: string }>();
    const [shop, setShop] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMap, setShowMap] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Review State
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);

    useEffect(() => {
        const fetchShopData = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const [shopData, productsData] = await Promise.all([
                    getShopById(id),
                    getShopListings(id)
                ]);
                setShop(shopData);
                setProducts(productsData);
            } catch (err) {
                setError("Merchant record not found in this sector.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchShopData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-yellow-400 font-mono">
                <FiLoader className="animate-spin mb-4" size={48} />
                <p className="animate-pulse tracking-widest text-sm">SYNCHRONIZING MERCHANT DATA...</p>
            </div>
        );
    }

    if (error || !shop) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 font-mono p-4">
                <FiAlertCircle size={64} className="mb-4" />
                <h1 className="text-xl font-black uppercase mb-2">Error: 404</h1>
                <p className="text-zinc-500">{error}</p>
            </div>
        );
    }

    const coords = shop.location || { lat: 0, lng: 0 };

    return (
        <div className="bg-black text-white min-h-screen selection:bg-yellow-400/30">
            <PublicHeader />

            {/* HERO BANNER */}
            <div className="relative h-[300px] w-full overflow-hidden">
                <img
                    src={shop.logo_url || "/placeholder-banner.png"}
                    className="w-full h-full object-cover object-bottom opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            {/* SHOP IDENTITY SECTION */}
            <div className="max-w-7xl mx-auto px-6 relative z-20 -mt-24">
                <div className="flex flex-col md:flex-row items-end gap-8 pb-8 border-b border-white/5">

                    {/* MAXIMIZED LOGO */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-40 h-40 md:w-48 md:h-48 bg-zinc-900 rounded-3xl overflow-hidden border-4 border-black shadow-2xl shadow-yellow-400/10 flex-shrink-0"
                    >
                        <img
                            src={shop.logo_url || "/img.png"}
                            className="w-full h-full object-cover"
                            alt={shop.name}
                        />
                    </motion.div>

                    {/* SHOP DESCRIPTION & STATS */}
                    <div className="flex-1 space-y-4 mb-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{shop.name}</h1>
                            <FiCheckCircle className="text-blue-400 text-2xl" title="Verified Merchant" />
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full border border-yellow-400/20">
                                <FiStar fill="currentColor" /> {shop.rating || "5.0"} (120+ Reviews)
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400">
                                <FiMapPin /> {typeof shop.location === 'string' ? shop.location : "Blantyre, Malawi"}
                            </div>
                            <div className="text-zinc-500">
                                Joined March 2026
                            </div>
                        </div>

                        <p className="text-zinc-400 max-w-2xl text-lg leading-relaxed">{shop.description}</p>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <button
                            className="w-full md:w-48 bg-yellow-400 text-black px-6 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/10"
                            onClick={() => setShowMap(!showMap)}
                        >
                            <FaDirections /> {!showMap ? "Locate Shop" : "Hide Map"}
                        </button>
                    </div>
                </div>

                {/* INTERACTIVE MAP DROP */}
                <div className="mt-8 transition-all duration-500 overflow-hidden">
                    {showMap && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="rounded-3xl border border-white/5 overflow-hidden shadow-2xl"
                        >
                            <LocationViewer coords={coords} shop={shop} />
                        </motion.div>
                    )}
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="grid lg:grid-cols-3 gap-16 py-16">

                    {/* LEFT: PRODUCTS (2 Columns) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black tracking-tight">Available Inventory</h2>
                            <span className="text-zinc-500 text-sm font-mono">{products.length} ITEMS FOUND</span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {products.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-zinc-900/40 rounded-2xl border border-white/5 p-2 hover:border-yellow-400/20 transition-all group"
                                >
                                    <ListingCard item={item} />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: REVIEWS & FEEDBACK */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <FiMessageSquare className="text-yellow-400" /> Merchant Feedback
                            </h2>

                            {/* REVIEW FORM */}
                            <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 space-y-4">
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Rate your experience</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <FiStar
                                            key={s}
                                            className={`text-2xl cursor-pointer ${s <= rating ? 'text-yellow-400' : 'text-zinc-700'}`}
                                            fill={s <= rating ? 'currentColor' : 'none'}
                                            onClick={() => setRating(s)}
                                        />
                                    ))}
                                </div>
                                <textarea
                                    className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm focus:border-yellow-400 outline-none transition-all h-28 resize-none"
                                    placeholder="Write your review..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <button className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
                                    <FiSend /> Post Review
                                </button>
                            </div>

                            {/* MINI REVIEW FEED */}
                            <div className="space-y-6 pt-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="space-y-2 border-l-2 border-yellow-400/20 pl-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-white">Verified Buyer</span>
                                            <div className="flex text-[10px] text-yellow-400"><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /></div>
                                        </div>
                                        <p className="text-zinc-400 text-sm italic">"Solid merchant. The items were exactly as described and the pickup was smooth."</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopProfile;