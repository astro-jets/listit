import { useEffect, useState } from "react";
import axios from "axios";
import { FiHeart } from "react-icons/fi";
import ListingCard from "~/components/listings/ListingCard";
import { getFavoriteListings } from "~/services/listing.service";
import PublicHeader from "~/components/layouts/PublicLayout";

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
            <div className="min-h-screen bg-black text-white px-4 md:px-10 py-8">

                {/* HEADER */}
                <div className="flex items-center gap-3 mb-8">
                    <FiHeart className="text-yellow-400" size={22} />
                    <h1 className="text-2xl font-bold">Your Favorites</h1>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="h-64 bg-zinc-900 animate-pulse rounded-xl"
                            />
                        ))}
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && favorites.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center py-20">
                        <FiHeart size={40} className="text-zinc-600 mb-4" />
                        <h2 className="text-lg font-semibold mb-2">
                            No favorites yet
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            Start exploring and save items you love ❤️
                        </p>
                    </div>
                )}

                {/* GRID */}
                {!loading && favorites.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {favorites.map((item) => (
                            <ListingCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default FavoritesPage;
