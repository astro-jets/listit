import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PublicHeader from "~/components/layouts/PublicLayout";
import ListingCard from "~/components/listings/ListingCard";
import { getAllListings, getCategories } from "~/services/listing.service";

interface Category {
    id: number;
    name: string;
    slug: string;
}

const Explore = () => {
    const [loading, setLoading] = useState(true);
    const [allListings, setAllListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [dbCategories, setDbCategories] = useState<Category[]>([]);
    const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [listingsRes, categoriesRes] = await Promise.all([
                    getAllListings(1),
                    getCategories()
                ]);
                setAllListings(listingsRes.data.data);
                setFilteredListings(listingsRes.data.data);
                setDbCategories(categoriesRes);
            } catch (err) {
                console.error("Explore Load Error:", err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (selectedCatId === null) {
            setFilteredListings(allListings);
        } else {
            setFilteredListings(allListings.filter((item: any) => item.category_name === selectedCatId));
        }
    }, [selectedCatId, allListings]);

    return (
        <div className="min-h-screen bg-white text-black selection:bg-yellow-400">
            <PublicHeader />

            <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
                {/* HERO SECTION - Neo-Brutalist Banner */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="border-l-[12px] border-black pl-8 py-4 bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                    <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
                        Explore <br />
                        <span className="bg-white px-4 border-[4px] border-black">The Loot</span>
                    </h1>
                </motion.div>

                {/* CATEGORY NAV - Sharp & Blocky */}
                <div className="flex gap-4 overflow-x-auto scrollbar-hide sticky top-20 z-10 bg-white/90 backdrop-blur-sm py-6 border-b-[4px] border-black">
                    <CategoryButton
                        label="ALL GEAR"
                        active={selectedCatId === null}
                        onClick={() => setSelectedCatId(null)}
                    />
                    {dbCategories.map((cat) => (
                        <CategoryButton
                            key={cat.id}
                            label={cat.name}
                            active={selectedCatId === cat.name}
                            onClick={() => setSelectedCatId(cat.name)}
                        />
                    ))}
                </div>

                {/* LISTING GRID */}
                <motion.section layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredListings.map((item: any) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="hover:-translate-y-2 transition-transform"
                            >
                                <ListingCard item={item} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.section>

                {/* EMPTY STATE - High Contrast Block */}
                {!loading && filteredListings.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-96 flex flex-col items-center justify-center border-[4px] border-black bg-zinc-50 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <span className="text-6xl mb-6">🚫</span>
                        <h3 className="text-2xl font-black uppercase italic">Out of Stock</h3>
                        <p className="font-bold text-zinc-500 mt-2 uppercase">No items found in this sector</p>
                        <button
                            onClick={() => setSelectedCatId(null)}
                            className="mt-8 bg-black text-yellow-400 px-8 py-3 font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                        >
                            Reset Scanners
                        </button>
                    </motion.div>
                )}
            </main>

            <footer className="bg-black text-white py-12 mt-20 border-t-[8px] border-yellow-400 text-center">
                <p className="font-black uppercase tracking-[0.2em] italic">
                    Studio X Marketplace — Est. 2026
                </p>
            </footer>
        </div>
    );
};

// Nebutalist Category Button
const CategoryButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`relative px-6 py-3 font-black uppercase text-sm tracking-tight border-[3px] border-black transition-all ${active
            ? 'bg-yellow-400 text-black translate-x-1 translate-y-1 shadow-none'
            : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            }`}
    >
        {label}
    </button>
);

export default Explore;