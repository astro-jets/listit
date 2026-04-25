import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import PublicHeader from "~/components/layouts/PublicLayout";
import ListingCard from "~/components/listings/ListingCard";
import Loader from "~/components/modals/Loader";
import { searchListings } from "~/services/listing.service";
import { FiSearch, FiArrowLeft, FiShoppingBag, FiPackage } from "react-icons/fi";

interface Shop {
    id: number;
    name: string;
    logo_url: string | null;
    description: string | null;
}

interface Listing {
    id: number;
    title: string;
    price: number;
    shop_name: string;
    image: string | null;
    is_favorited: boolean;
    // add other fields from your schema as needed
}

const Search = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("q") || "";

    const [listings, setListings] = useState<Listing[]>([]);
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await searchListings(searchQuery);
                // Data now contains { listings: [], shops: [] }
                setListings(data.listings || []);
                setShops(data.shops || []);
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

            <main className="max-w-7xl mx-auto px-6 py-12 space-y-16 pb-24">

                {/* SEARCH HEADER */}
                <div className="relative">
                    <div className="inline-block bg-black text-white px-6 py-2 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] mb-6">
                        <p className="font-black uppercase tracking-tighter text-sm italic">Archive Search Results</p>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
                            Finding: <span className="underline decoration-[6px] md:decoration-[10px] decoration-yellow-400 underline-offset-[4px]">"{searchQuery}"</span>
                        </h1>

                        <div className="flex gap-4">
                            <div className="bg-white border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <p className="font-black uppercase text-[10px] text-zinc-500">Items</p>
                                <p className="text-2xl font-black italic leading-none">{listings.length.toString().padStart(2, '0')}</p>
                            </div>
                            <div className="bg-white border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <p className="font-black uppercase text-[10px] text-zinc-500">Shops</p>
                                <p className="text-2xl font-black italic leading-none">{shops.length.toString().padStart(2, '0')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-6">
                        <Loader />
                        <p className="font-black uppercase italic animate-pulse">Scanning database sectors...</p>
                    </div>
                ) : (listings.length > 0 || shops.length > 0) ? (
                    <div className="space-y-16">
                        {/* LISTINGS SECTION */}
                        {listings.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <FiPackage size={24} className="text-yellow-500" />
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Identified_Listings</h2>
                                    <div className="flex-1 h-[4px] bg-black"></div>
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {listings.map((item, i) => (
                                        <div key={i} className="h-full">
                                            <ListingCard item={item} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {/* SHOPS SECTION */}
                        {shops.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <FiShoppingBag size={24} className="text-cyan-500" />
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Relevant Shops</h2>

                                </div>
                                {shops.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {shops.map((shop) => (
                                            <Link
                                                to={`/shop/${shop.id}`}
                                                key={shop.id}
                                                className="group relative border-4 border-black p-4 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-4"
                                            >
                                                <div className="w-14 h-14 bg-zinc-100 border-2 border-black overflow-hidden flex-shrink-0">
                                                    {shop.logo_url ? (
                                                        <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center font-black text-xl bg-yellow-400">?</div>
                                                    )}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h3 className="font-black uppercase italic truncate">{shop.name}</h3>
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase truncate">View Merchant Deck</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>)}
                            </section>
                        )}
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="max-w-2xl mx-auto text-center py-20 border-[4px] border-black bg-zinc-50 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12">
                        <div className="bg-yellow-400 w-20 h-20 flex items-center justify-center border-[4px] border-black mx-auto mb-8 -rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <FiSearch size={40} className="text-black" />
                        </div>
                        <h2 className="text-4xl font-black uppercase italic mb-4">Signal Lost</h2>
                        <p className="text-xl font-bold uppercase text-zinc-600 leading-tight mb-8">
                            Zero matches found for <span className="text-black underline decoration-4 decoration-red-500">"{searchQuery}"</span>.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-black uppercase border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] hover:bg-yellow-400 hover:text-black hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                        >
                            <FiArrowLeft /> Return to Hub
                        </Link>
                    </div>
                )}
            </main>

            {/* DECORATIVE BOTTOM BAR */}
            <div className="fixed bottom-0 left-0 w-full h-2 bg-black overflow-hidden flex z-50">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="flex-1 h-full bg-yellow-400 even:bg-black" />
                ))}
            </div>
        </div>
    );
};

export default Search;