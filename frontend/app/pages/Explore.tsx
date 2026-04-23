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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [listingsRes, categoriesRes] = await Promise.all([
                    getAllListings(page),
                    getCategories()
                ]);

                const listingData = listingsRes.data || [];
                setAllListings(listingData);
                setFilteredListings(listingData);
                setDbCategories(categoriesRes || []);
                setTotalPages(listingsRes.pagination?.totalPages || 1);
            } catch (err) {
                console.error("Explore Load Error:", err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [page]);

    useEffect(() => {
        if (selectedCatId === null) {
            setFilteredListings(allListings);
        } else {
            setFilteredListings(
                allListings.filter((item: any) => item.category_name === selectedCatId)
            );
        }
    }, [selectedCatId, allListings]);

    return (
        <div className="min-h-screen bg-white text-black selection:bg-yellow-400">
            <PublicHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 md:space-y-16">

                {/* HERO SECTION - Adjusted padding and font sizes for mobile */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="border-l-[8px] md:border-l-[12px] border-black pl-4 md:pl-8 py-4 bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]">
                        Explore <br />
                        <span className="bg-white px-2 md:px-4 border-[3px] md:border-[4px] border-black inline-block mt-2">
                            The Loot
                        </span>
                    </h1>
                </motion.div>

                {/* CATEGORY NAV - Optimized sticky positioning and scroll padding */}
                <div className="sticky top-[70px] z-20 bg-white/95 backdrop-blur-sm -mx-4 px-4 py-4 md:py-6 border-b-[4px] border-black overflow-hidden">
                    <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-2 md:pb-0 px-2">
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
                </div>

                {/* LISTING GRID - Fluid column scaling */}
                {loading ? (
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-64 md:h-80 bg-zinc-100 border-4 border-black animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" />
                        ))}
                    </div>
                ) : (
                    <motion.section layout className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
                        <AnimatePresence mode="popLayout">
                            {filteredListings.map((item: any) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="w-full"
                                >
                                    <ListingCard item={item} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.section>
                )}

                {/* PAGINATION - Responsive sizing */}
                {!loading && selectedCatId === null && totalPages > 1 && (
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 pt-6 md:pt-10">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setPage(i + 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
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

                {/* EMPTY STATE - Mobile scaled */}
                {!loading && filteredListings.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 px-6 flex flex-col items-center justify-center border-[4px] border-black bg-zinc-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center"
                    >
                        <span className="text-5xl md:text-6xl mb-6">🚫</span>
                        <h3 className="text-xl md:text-2xl font-black uppercase italic">Out of Stock</h3>
                        <p className="font-bold text-zinc-500 mt-2 uppercase text-sm md:text-base">No items found in this sector</p>
                        <button
                            onClick={() => setSelectedCatId(null)}
                            className="mt-8 bg-black text-yellow-400 px-6 md:px-8 py-3 font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                        >
                            Reset Scanners
                        </button>
                    </motion.div>
                )}
            </main>

            <footer className="bg-black text-white py-10 md:py-16 mt-20 border-t-[8px] border-yellow-400 text-center px-4">
                <p className="font-black uppercase tracking-[0.1em] md:tracking-[0.2em] italic text-sm md:text-base">
                    Studio X Marketplace — Est. 2026
                </p>
            </footer>
        </div>
    );
};

const CategoryButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`whitespace-nowrap px-4 md:px-6 py-2 md:py-3 font-black uppercase text-xs md:text-sm tracking-tight border-[3px] border-black transition-all ${active
            ? 'bg-yellow-400 text-black translate-x-1 translate-y-1 shadow-none'
            : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-50 active:translate-x-[2px] active:translate-y-[2px]'
            }`}
    >
        {label}
    </button>
);

export default Explore;