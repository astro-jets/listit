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
                    getAllListings(1), // Assuming page 1 for now
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
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <PublicHeader />

            <main className="max-w-7xl mx-auto px-6 py-4 space-y-12">
                {/* HERO SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter">
                        Find your <span className="text-yellow-400">Gear</span>
                    </h1>
                </motion.div>

                {/* CATEGORY NAV */}
                <div className="flex gap-4 overflow-x-auto scrollbar-hide sticky top-20 z-10 bg-[#0a0a0a]/80 backdrop-blur-md py-2">
                    <CategoryButton
                        label="All Loot"
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
                <motion.section layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredListings.map((item: any) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <ListingCard item={item} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.section>

                {/* EMPTY STATE */}
                {!loading && filteredListings.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl"
                    >
                        <span className="text-4xl mb-4">🌑</span>
                        <h3 className="font-black uppercase text-zinc-500">The vaults are empty here</h3>
                        <button onClick={() => setSelectedCatId(null)} className="mt-4 text-yellow-400 font-bold hover:underline">
                            RETURN TO ALL
                        </button>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

// Sub-component for clean code & Framer Layout Animations
const CategoryButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`relative px-8 py-3 font-black uppercase text-xs tracking-widest transition-colors ${active ? 'text-black' : 'text-zinc-500 hover:text-white'}`}
    >
        <span className="relative z-10">{label}</span>
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-yellow-400 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
        {!active && (
            <div className="absolute inset-0 border border-zinc-800 rounded-full" />
        )}
    </button>
);

export default Explore;