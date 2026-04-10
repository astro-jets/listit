import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import PublicHeader from "~/components/layouts/PublicLayout";
import ListingCard from "~/components/listings/ListingCard";
import Loader from "~/components/modals/Loader";
import { searchListings } from "~/services/listing.service";
import { FiSearch, FiArrowLeft, FiAlertTriangle } from "react-icons/fi";

const Search = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("q") || "";

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await searchListings(searchQuery);
                setListings(data);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-white text-black selection:bg-yellow-400">
            <PublicHeader />

            <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">

                {/* SEARCH HEADER - Sticker Style */}
                <div className="relative">
                    <div className="inline-block bg-black text-white px-6 py-2 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] mb-6">
                        <p className="font-black uppercase tracking-tighter text-sm italic">Archive Search Results</p>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
                            Finding: <span className="underline decoration-[10px] decoration-yellow-400 underline-offset-[4px]">"{searchQuery}"</span>
                        </h1>

                        <div className="bg-white border-[3px] border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <p className="font-black uppercase text-xs text-zinc-500">Matches Found</p>
                            <p className="text-3xl font-black italic leading-none mt-1">{listings.length.toString().padStart(2, '0')}</p>
                        </div>
                    </div>
                </div>

                {/* RESULTS GRID */}
                <div className="min-h-[50vh]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 space-y-6">
                            <Loader />
                            <p className="font-black uppercase italic animate-pulse">Scanning database sectors...</p>
                        </div>
                    ) : listings.length ? (
                        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {listings.map((item, i) => (
                                <div key={i} className="h-full">
                                    <ListingCard item={item} />
                                </div>
                            ))}
                        </section>
                    ) : (
                        /* EMPTY STATE - Brutalist Error Box */
                        <div className="max-w-2xl mx-auto text-center py-20 border-[4px] border-black bg-zinc-50 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12">
                            <div className="bg-yellow-400 w-20 h-20 flex items-center justify-center border-[4px] border-black mx-auto mb-8 -rotate-3">
                                <FiSearch size={40} className="text-black" />
                            </div>
                            <h2 className="text-4xl font-black uppercase italic mb-4">Signal Lost</h2>
                            <p className="text-xl font-bold uppercase text-zinc-600 leading-tight mb-8">
                                We couldn't find any items matching <span className="text-black underline decoration-4 decoration-red-500">"{searchQuery}"</span> in the current sector.
                            </p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-black uppercase border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] hover:bg-yellow-400 hover:text-black hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                            >
                                <FiArrowLeft /> Return to Hub
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            {/* DECORATIVE BOTTOM BAR */}
            <div className="fixed bottom-0 left-0 w-full h-2 bg-black overflow-hidden flex">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="flex-1 h-full bg-yellow-400 even:bg-black" />
                ))}
            </div>
        </div>
    );
};

export default Search;