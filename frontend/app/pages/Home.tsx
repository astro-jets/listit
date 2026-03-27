import React, { useState } from "react";
import { FiSearch, FiFilter, FiChevronRight } from "react-icons/fi";
import ListingCard from "~/components/listings/ListingCard";

// --- MOCK DATA FOR UI DESIGN ---
const SAMPLE_QUESTS = [
    {
        id: 1,
        title: "Vanguard's Crimson Blade",
        price: "1,250",
        category: "Legendary Gear",
        image: "https://images.unsplash.com/photo-1599140849279-1014532882fe?w=400&q=80",
        rarity: "legendary",
        shopName: "The Rusty Anvil",
        location: "Ironforge District, Aisle 4"
    },
    {
        id: 2,
        title: "Greater Mana Tincture",
        price: "45",
        category: "Consumable",
        image: "https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?w=400&q=80",
        rarity: "common",
        shopName: "Alchemist's Hut",
        location: "Mage Quarter, Shelf B"
    },
    {
        id: 3,
        title: "Map to Sunken Temple",
        price: "300",
        category: "Quest Item",
        image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&q=80",
        rarity: "rare",
        shopName: "The Dusty Scroll",
        location: "Trade Winds Harbor"
    },
    {
        id: 4,
        title: "Gnome-Engineered Compass",
        price: "150",
        category: "Tools",
        image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&q=80",
        rarity: "uncommon",
        shopName: "Gizmo Garage",
        location: "Gearspring City, Unit 7"
    },
    {
        id: 5,
        title: "Shadow-Stitched Cloak",
        price: "850",
        category: "Armor",
        image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=400&q=80",
        rarity: "rare",
        shopName: "Midnight Threads",
        location: "Shadow Realm Market"
    },
    {
        id: 6,
        title: "Broken Hero Sword",
        price: "10",
        category: "Materials",
        image: "https://images.unsplash.com/photo-1589703364910-65e3d8d0bb3c?w=400&q=80",
        rarity: "common",
        shopName: "Junk & Stuff",
        location: "The Dumps, Box 3"
    }
];

const SHOPS = [
    {
        name: "The Rusty Anvil",
        location: "Blantyre",
        image: "/shop1.jpg",
        items: 120,
    },
    {
        name: "Gizmo Garage",
        location: "Lilongwe",
        image: "/shop2.jpg",
        items: 80,
    },
];

const TRENDING = SAMPLE_QUESTS.slice(0, 3);

const CITIES = [
    { name: "Blantyre", shops: 120 },
    { name: "Lilongwe", shops: 95 },
    { name: "Zomba", shops: 60 },
    { name: "Mzuzu", shops: 40 },
];


const PublicDiscovery = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="min-h-screen bg-black text-white font-sans">

            {/* NAV */}
            <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-wide">
                    <span className="text-yellow-400">LIST</span>.IT
                </h1>

                <div className="flex items-center gap-4">
                    <button className="text-sm text-zinc-400 hover:text-white transition">
                        Explore
                    </button>

                    <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:scale-105 transition">
                        Log In
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
                <img
                    src="/img.png"
                    className="absolute w-full h-full object-cover opacity-40"
                />

                {/* gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black" />

                <div className="relative text-center space-y-6 px-6">
                    <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                        Discover Rare Items <br />
                        <span className="text-yellow-400">Across the Market</span>
                    </h2>

                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Find anything — from rare gear to everyday essentials.
                    </p>

                    {/* SEARCH */}
                    <div className="flex justify-center">
                        <div className="flex items-center w-full max-w-xl bg-white/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg">
                            <input
                                type="text"
                                placeholder="Search items..."
                                className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder:text-zinc-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <button className="bg-yellow-400 text-black px-4 py-3 hover:bg-yellow-300 transition">
                                <FiSearch />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

                {/* FILTER */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-sm text-yellow-400">
                            <FiFilter /> Filters
                        </button>

                        <div className="hidden md:flex gap-4 text-sm text-zinc-400">
                            <span className="text-white">All</span>
                            <span className="hover:text-white cursor-pointer">Shoes</span>
                            <span className="hover:text-white cursor-pointer">Clothes</span>
                            <span className="hover:text-white cursor-pointer">Watches</span>
                        </div>
                    </div>

                    <p className="text-sm text-zinc-400">
                        {SAMPLE_QUESTS.length} results found
                    </p>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {SAMPLE_QUESTS.map((quest) => (
                        <div
                            key={quest.id}
                            className="bg-zinc-900 rounded-xl overflow-hidden border border-white/5 hover:border-yellow-400/40 hover:scale-[1.02] transition-all duration-300 shadow-lg"
                        >
                            <ListingCard item={quest} />
                        </div>
                    ))}

                    {/* LOAD MORE */}
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 p-8 text-zinc-400 hover:text-yellow-400 hover:border-yellow-400 transition cursor-pointer">
                        <FiChevronRight size={28} />
                        <span className="mt-2 text-sm">Load More</span>
                    </div>
                </div>
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold">🔥 Trending Now</h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TRENDING.map((item) => (
                            <div
                                key={item.id}
                                className="bg-zinc-900 rounded-xl border border-white/5 hover:border-yellow-400/30 transition overflow-hidden"
                            >
                                <ListingCard item={item} />
                            </div>
                        ))}
                    </div>
                </section>


                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Shops Near You</h2>
                        <button className="text-yellow-400 text-sm">View All</button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SHOPS.map((shop, i) => (
                            <div
                                key={i}
                                className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-white/5 hover:border-yellow-400/30 transition"
                            >
                                <img
                                    src={shop.image}
                                    className="h-40 w-full object-cover group-hover:scale-105 transition"
                                />

                                <div className="p-4 space-y-2">
                                    <h3 className="font-semibold">{shop.name}</h3>
                                    <p className="text-sm text-zinc-400">{shop.location}</p>

                                    <div className="text-xs text-yellow-400">
                                        {shop.items} items available
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold">Cities With Active Shops</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {CITIES.map((city, i) => (
                            <div
                                key={i}
                                className="bg-zinc-900 p-6 rounded-xl border border-white/5 hover:border-yellow-400/30 hover:scale-105 transition text-center"
                            >
                                <h3 className="font-semibold text-lg">{city.name}</h3>
                                <p className="text-sm text-zinc-400">
                                    {city.shops} shops
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-300 text-black p-10 mt-10">

                    {/* glow effect */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-black/20 rounded-full blur-3xl" />

                    <div className="relative max-w-3xl space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Own a Store? Join the Guild
                        </h2>

                        <p className="text-black/80">
                            List your store and products for free. Help customers in your city find
                            exactly what they need — and walk through your door.
                        </p>

                        <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition">
                            List Your Store — Free
                        </button>
                    </div>
                </section>


            </main>

            {/* FOOTER */}
            <footer className="border-t border-zinc-800 py-10 text-center text-zinc-500 text-sm">
                © 2026 LIST.IT — All rights reserved
            </footer>
        </div>
    );
};

export default PublicDiscovery;
