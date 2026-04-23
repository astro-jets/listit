import { useState } from "react";
import { BsShopWindow } from "react-icons/bs";
import { FiMapPin, FiHeart, FiShoppingBag } from "react-icons/fi";
import { Link, useLocation } from "react-router";
import { toggleFavorite } from "~/services/listing.service";
import AuthRequiredModal from "../modals/AuthModel";
import { set } from "zod";

const ListingCard = ({ item }: any) => {
    const [favorited, setFavorited] = useState(item.is_favorited || false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const location = useLocation();

    // Check if we are currently viewing a shop page to hide the "View Shop" button
    const isShopPage = location.pathname.startsWith("/shop/");

    const toggleFavoriteListing = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to product if card is wrapped in a link
        setFavorited(!favorited);
        try {
            const res = await toggleFavorite(item.id);
            console.log("Toggle Favorite Response:", res);
            // If the backend response matches your error string
            if (!res) {
                setFavorited(false); // Revert UI change
                setShowAuthModal(true);
                return;
            }
            setFavorited(res.favorited);
        } catch (error) {
            setFavorited(false); // Revert UI change
            setShowAuthModal(true);

        }
    }

    return (
        <div className="group relative bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 overflow-hidden">

            {/* IMAGE CONTAINER */}
            <div className="relative h-60 border-b-[3px] border-black overflow-hidden bg-zinc-100">
                <img
                    src={item.images && item.images.length > 0 ? item.images[0] : (item.image || "https://via.placeholder.com/400")}
                    className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    alt={item.title}
                />

                {/* CATEGORY BADGE - Brutalist Style */}
                <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest border-r-[3px] border-b-[3px] border-black">
                    {item.category_name || "General"}
                </div>

                {/* FAVORITE BUTTON */}
                <button
                    className={`absolute top-3 right-3 p-2 border-[2px] border-black transition-all active:scale-90 ${favorited ? 'bg-yellow-400' : 'bg-white hover:bg-yellow-100'
                        }`}
                    onClick={toggleFavoriteListing}
                >
                    <FiHeart
                        className={`${favorited ? 'fill-black' : 'fill-none'}`}
                        size={18}
                    />
                </button>
                <AuthRequiredModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            </div>

            {/* CONTENT AREA */}
            <div className="p-5 space-y-4">
                <div>
                    <h3 className="text-xl font-black leading-none uppercase italic tracking-tighter group-hover:underline decoration-yellow-400 decoration-4">
                        {item.title}
                    </h3>
                    <p className="text-sm font-bold text-zinc-500 mt-2 line-clamp-2 uppercase leading-tight">
                        {item.description || "High quality item available now."}
                    </p>
                </div>

                {/* INFO ROW */}
                <div className="flex items-center justify-between border-t-2 border-black pt-4">
                    <div className="bg-yellow-400 border-[2px] border-black px-3 py-1 font-black text-lg italic shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        MWK {item.price.toLocaleString()}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-black uppercase text-zinc-400">
                        <FiMapPin size={12} className="text-black" />
                        {item.location || "Central"}
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-2 pt-2">
                    {/* Only show View Shop if NOT on a shop page */}
                    {!isShopPage && (
                        <Link
                            to={`/shop/${item.shop_id}`}
                            className="flex items-center justify-center gap-2 py-3 bg-white text-black border-[3px] border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:bg-zinc-50 active:translate-x-1 active:translate-y-1 transition-all"
                        >
                            <BsShopWindow size={14} />
                            Establishment Profile
                        </Link>
                    )}

                    <Link
                        to={`/product/${item.id}`}
                        className="flex items-center justify-center gap-2 py-3 bg-black text-white border-[3px] border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] hover:bg-yellow-400 hover:text-black hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                    >
                        <FiShoppingBag size={14} />
                        View Archive
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;