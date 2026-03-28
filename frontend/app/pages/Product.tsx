import React, { useEffect, useState } from "react";
import { FiStar, FiMapPin, FiHeart, FiAlertCircle, FiLoader } from "react-icons/fi";
import { Link, useParams } from "react-router";
import PublicHeader from "~/components/layouts/PublicLayout";
import ListingCard from "~/components/listings/ListingCard";
import { getListingById } from "~/services/listing.service";

const PRODUCT = {
    id: 1,
    title: "Vanguard's Crimson Blade",
    price: "1,250",
    category: "Legendary Gear",
    images: [
        "https://images.unsplash.com/photo-1599140849279-1014532882fe?w=800",
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800",
        "https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?w=800",
    ],
    description:
        "A legendary blade forged in ancient fire. Known for its unmatched durability and power in battle.",
    shop: {
        name: "The Rusty Anvil",
        rating: 4.8,
        location: "Blantyre",
    },
};

const RELATED = [...Array(4)].map((_, i) => ({
    id: i,
    title: "Related Item",
    price: "200",
    category: "Tools",
    image: "",
    rarity: "rare",
    shopName: "Demo Shop",
    location: "Blantyre",
}));

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [listing, setListing] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState<string>("");

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const data = await getListingById(id);
                setListing(data);
                // Set initial active image if images exist
                if (data.images && data.images.length > 0) {
                    setActiveImage(data.images[0]);
                }
            } catch (err) {
                console.error(err);
                setError("Quest Data Corrupted: Item not found in the archives.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-yellow-400 font-mono">
                <FiLoader className="animate-spin mb-4" size={48} />
                <p className="animate-pulse">SCANNING DATABASE...</p>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 font-mono p-4 text-center">
                <FiAlertCircle size={64} className="mb-4" />
                <h1 className="text-2xl font-black uppercase mb-2">404: Item Not Found</h1>
                <p className="text-zinc-500">{error}</p>
                <button
                    onClick={() => window.history.back()}
                    className="mt-6 border-2 border-red-500 px-6 py-2 hover:bg-red-500 hover:text-white transition-all"
                >
                    RETURN TO SAFETY
                </button>
            </div>
        );
    }
    console.log("Fetched Listings:", listing);
    return (
        <div className="bg-black text-white min-h-screen">
            <PublicHeader />
            {/* CONTAINER */}
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

                {/* TOP SECTION */}
                <div className="grid lg:grid-cols-2 gap-10">

                    {/* IMAGE GALLERY */}
                    <div className="space-y-4">
                        <div className="bg-zinc-900 rounded-xl overflow-hidden">
                            <img
                                src={activeImage}
                                className="w-full h-100 object-cover"
                            />
                        </div>

                        <div className="flex gap-3">
                            {listing.images.map((img: string, i: number) => (
                                <img
                                    key={i}
                                    src={img}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${activeImage === img
                                        ? "border-yellow-400"
                                        : "border-transparent"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="space-y-6">

                        {/* TITLE */}
                        <div>
                            <h1 className="text-3xl font-bold">{listing.title}</h1>
                            <p className="text-zinc-400">{listing.category}</p>
                        </div>

                        {/* PRICE */}
                        <div className="text-3xl font-bold text-yellow-400">
                            MWK {listing.price}
                        </div>

                        {/* SHOP */}
                        <div className="bg-zinc-900 p-4 rounded-xl border border-white/5 flex gap-4 items-center hover:border-white/10 transition">

                            {/* Image */}
                            <div className="w-24 h-24 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                                <img
                                    src={listing.shop_logo}
                                    alt={listing.shop_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col justify-between flex-1 h-full">
                                <h3 className="font-semibold text-white text-lg">
                                    {listing.shop_name}
                                </h3>

                                <div className="flex items-center gap-4 text-sm text-zinc-400 mt-2">

                                    <span className="flex items-center gap-1 text-yellow-400">
                                        <FiStar />
                                        {listing.rating}
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <FiMapPin />
                                        {listing.location}
                                    </span>

                                </div>
                            </div>

                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-4">
                            <Link to={`/shop/${listing.shop_id}`} className="flex-1 text-center bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:scale-105 transition">
                                Contact Seller
                            </Link>

                            <button className="p-3 border border-white/10 rounded-lg hover:border-yellow-400 transition">
                                <FiHeart />
                            </button>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="space-y-2">
                            <h3 className="font-semibold">Description</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {listing.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RELATED ITEMS */}
                <section className="space-y-6">
                    <h2 className="text-xl font-semibold">You may also like</h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {RELATED.map((item) => (
                            <div
                                key={item.id}
                                className="bg-zinc-900 rounded-xl border border-white/5 hover:border-yellow-400/30 transition"
                            >
                                <ListingCard item={item} />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductDetail;
