import { useState } from "react";
import { BsShopWindow } from "react-icons/bs";
import { FiMapPin, FiHeart, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router";
import { toggleFavorite } from "~/services/listing.service";

const ListingCard = ({ item }: any) => {
    console.log("Rendering ListingCard for item:", item);
    const [favorited, setFavorited] = useState(item.is_favorited || false);

    const toggleFavoriteListing = async () => {
        setFavorited(!favorited); // Optimistic UI update
        const res = await toggleFavorite(item.id);
        setFavorited(res.favorited);
    }
    return (
        <div className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-white/5 hover:border-yellow-400/30 transition-all duration-300 hover:scale-[1.02] shadow-lg">

            {/* IMAGE */}
            <div className="relative h-56 overflow-hidden">
                {
                    item.images && item.images.length > 0 ? (
                        <img
                            src={item.images[0]} // Show the first image as the thumbnail
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                    ) : (
                        <img
                            src={item.image || "https://via.placeholder.com/400"}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                    )
                }

                {/* overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent opacity-80" />

                {/* CATEGORY BADGE */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-3 py-1 text-xs rounded-full border border-white/10">
                    {item.category}
                </div>

                {/* FAVORITE */}
                <button className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur border border-white/10 hover:border-yellow-400 transition"
                    onClick={() => { toggleFavoriteListing() }}>
                    <FiHeart
                        className={`${favorited ? 'fill-yellow-500 stroke-yellow-500' : 'fill-none stroke-current'}`}
                        size={14}
                    />
                </button>
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-3">

                {/* TITLE */}
                <h3 className="text-sm font-semibold leading-tight group-hover:text-yellow-400 transition">
                    {item.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-xs text-zinc-400 line-clamp-2">
                    {item.description || "High quality item available now."}
                </p>

                {/* FOOTER */}
                <div className="flex items-center justify-between pt-2">

                    {/* PRICE */}
                    <div className="text-lg font-bold text-yellow-400">
                        MWK {item.price}
                    </div>

                    {/* LOCATION */}
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <FiMapPin size={12} />
                        {item.location || "Blantyre"}
                    </div>
                </div>

                {/* ACTION */}
                <Link to={`/shop/${item.id}`} className="w-full mt-2 flex items-center justify-center gap-2 text-sm bg-white text-black py-2 rounded-lg font-semibold hover:bg-yellow-400 transition">
                    <BsShopWindow size={14} />
                    View Shop
                </Link>

                <Link to={`/product/${item.id}`} className="w-full mt-2 flex items-center justify-center gap-2 text-sm bg-white text-black py-2 rounded-lg font-semibold hover:bg-yellow-400 transition">
                    <FiShoppingBag size={14} />
                    View Product
                </Link>
            </div>
        </div>
    );
};

export default ListingCard;
