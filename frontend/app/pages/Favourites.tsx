import { useEffect, useState } from "react";
import { FiHeart, FiArrowLeft } from "react-icons/fi";
import ListingCard from "~/components/listings/ListingCard";
import { getFavoriteListings } from "~/services/listing.service";
import PublicHeader from "~/components/layouts/PublicLayout";
import { Link } from "react-router";

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        try {
            const res = await getFavoriteListings();
            setFavorites(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <>
            <PublicHeader />
            <div className="min-h-screen bg-white text-black selection:bg-yellow-400">

                {/* PAGE HEADER SECTION */}
                <div className="bg-yellow-400 border-b-4 border-black py-12 px-4 md:px-10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="bg-black p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                    <FiHeart className="text-yellow-400" size={24} />
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
                                    Your <span className="bg-white px-3 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">Vault</span>
                                </h1>
                            </div>
                            <p className="font-bold uppercase text-sm tracking-widest text-black/70">
                                Saved items and rare finds
                            </p>
                        </div>

                        <Link to="/explore" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 border-[3px] border-black font-bold uppercase hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 w-fit">
                            <FiArrowLeft /> Back to Market
                        </Link>
                    </div>
                </div>

                <main className="max-w-7xl mx-auto px-4 md:px-10 py-16">

                    {/* LOADING STATE - Blocky Skeletons */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-80 bg-zinc-100 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {/* EMPTY STATE - Neo-Brutalist Block */}
                    {!loading && favorites.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center py-24 border-4 border-black bg-zinc-50 shadow-[12px_12px_0px_0px_rgba(250,204,21,1)]">
                            <div className="bg-black p-6 mb-6 rotate-3">
                                <FiHeart size={50} className="text-zinc-500" />
                            </div>
                            <h2 className="text-3xl font-black uppercase italic mb-4">
                                The vault is empty
                            </h2>
                            <p className="text-lg font-bold text-zinc-600 mb-8 max-w-md uppercase">
                                You haven't marked any gear as favorites. Get back out there!
                            </p>
                            <Link to="/explore" className="bg-yellow-400 text-black px-10 py-4 border-[3px] border-black font-black text-xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                Scout Items
                            </Link>
                        </div>
                    )}

                    {/* GRID */}
                    {!loading && favorites.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {favorites.map((item) => (
                                <div key={item.id} className="hover:rotate-1 transition-transform">
                                    <ListingCard item={item} />
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                <footer className="border-t-4 border-black py-10 text-center bg-white mt-20">
                    <p className="font-black uppercase tracking-widest text-sm italic">
                        Vault Managed by List it — Secure & Local
                    </p>
                </footer>
            </div>
        </>
    );
};

export default FavoritesPage;