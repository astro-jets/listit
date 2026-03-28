import React from "react";
import { FiTrendingUp, FiMapPin, FiStar } from "react-icons/fi";
import PublicHeader from "~/components/layouts/PublicLayout";
import ListingCard from "~/components/listings/ListingCard";

const categories = [
    "Electronics",
    "Fashion",
    "Furniture",
    "Gaming",
    "Tools",
    "Vehicles",
];

const Explore = () => {
    return (
        <>
            <PublicHeader />
            <div className="min-h-screen bg-black text-white px-6 py-10 space-y-12">
                {/* HEADER */}
                <div className="max-w-7xl mx-auto space-y-4">
                    <h1 className="text-3xl font-bold">
                        Explore <span className="text-yellow-400">Everything</span>
                    </h1>

                    {/* CATEGORY PILLS */}
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                className="px-4 py-2 rounded-full bg-zinc-900 border border-white/5 hover:border-yellow-400/40 hover:text-yellow-400 transition text-sm whitespace-nowrap"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TRENDING ROW */}
                <section className="max-w-7xl mx-auto space-y-4">
                    <div className="flex items-center gap-2 text-yellow-400">
                        <FiTrendingUp />
                        <h2 className="text-xl font-semibold">Trending Now</h2>
                    </div>

                    <div className="flex gap-4 overflow-x-auto">
                        {[1, 2, 3, 4].map((i) => (
                            <div className="min-w-62.5 bg-zinc-900 rounded-xl p-4 border border-white/5 hover:border-yellow-400/40 transition">
                                <div className="h-32 bg-zinc-800 rounded-lg mb-3" />
                                <h3 className="font-semibold">Item {i}</h3>
                                <p className="text-sm text-zinc-400">Hot deal</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* NEAR YOU */}
                <section className="max-w-7xl mx-auto space-y-4">
                    <div className="flex items-center gap-2 text-yellow-400">
                        <FiMapPin />
                        <h2 className="text-xl font-semibold">Near You</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div className="bg-zinc-900 p-4 rounded-xl border border-white/5 hover:border-yellow-400/40 transition">
                                <div className="h-32 bg-zinc-800 rounded-lg mb-3" />
                                <h3>Local Shop {i}</h3>
                                <p className="text-sm text-zinc-400">Blantyre</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* MAIN GRID */}
                <section className="max-w-7xl mx-auto space-y-4">
                    <h2 className="text-xl font-semibold">All Listings</h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(9)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-zinc-900 rounded-xl border border-white/5 hover:border-yellow-400/30 transition"
                            >
                                <ListingCard item={{
                                    id: i,
                                    title: "Sample Item",
                                    price: "120",
                                    category: "Tools",
                                    image: "",
                                    rarity: "common",
                                    shopName: "Demo Shop",
                                    location: "Blantyre"
                                }} />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};

export default Explore;
