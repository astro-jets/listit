import ListingCard from "~/components/listings/ListingCard";
import { FiStar, FiMapPin, FiAlertCircle, FiLoader } from "react-icons/fi";
import PublicHeader from "~/components/layouts/PublicLayout";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getShopListings } from "~/services/listing.service";
import { getShopById } from "~/services/shop.service";
import React from "react";
import { FaDirections } from "react-icons/fa";

const LocationViewer = React.lazy(() => import("../components/maps/LocationViewr"));
const SHOP = {
    name: "The Rusty Anvil",
    banner: "/img.png",
    logo: "/img.png",
    rating: 4.8,
    location: "Blantyre",
    description:
        "Specialists in rare tools, legendary gear, and hard-to-find items.",
};

const PRODUCTS = [...Array(8)].map((_, i) => ({
    id: i,
    title: "Item " + i,
    price: "200",
    category: "Tools",
    image: "",
    rarity: "rare",
    shopName: SHOP.name,
    location: "Blantyre",
}));

const ShopProfile = () => {
    const { id } = useParams<{ id: string }>();
    const [shop, setShop] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMap, setShowMap] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchShopData = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                // Fetch both Shop and Listings in parallel
                const [shopData, productsData] = await Promise.all([
                    getShopById(id),
                    getShopListings(id)
                ]);

                setShop(shopData);
                setProducts(productsData);
            } catch (err) {
                console.error(err);
                setError("Merchant record not found in this sector.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchShopData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-yellow-400 font-mono">
                <FiLoader className="animate-spin mb-4" size={48} />
                <p className="animate-pulse tracking-widest">LOADING MERCHANT DATA...</p>
            </div>
        );
    }

    if (error || !shop) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 font-mono p-4">
                <FiAlertCircle size={64} className="mb-4" />
                <h1 className="text-xl font-black uppercase mb-2">Error: 404</h1>
                <p className="text-zinc-500">{error}</p>
            </div>
        );
    }
    const coords = shop.location || { lat: 0, lng: 0 };
    console.log("Shop Data:", shop);
    console.log("Shop Products:", products);
    return (
        <>
            <PublicHeader />
            <div className="bg-black text-white min-h-screen">

                {/* BANNER */}
                <div className="relative h-64">
                    <img
                        src={shop.logo_url || "/img.png"}
                        className="w-full h-full object-cover opacity-40"
                    />

                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-black" />
                </div>

                {/* SHOP INFO */}
                <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
                    <div className="bg-zinc-900 rounded-2xl p-6 border border-white/5 shadow-xl">

                        <div className="flex flex-col md:flex-row md:items-center gap-6">

                            {/* LOGO */}
                            <div className="w-24 h-24 bg-zinc-800 rounded-xl overflow-hidden" >
                                <img
                                    src={shop.logo_url || "/img.png"}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* INFO */}
                            <div className="flex-1 space-y-2">
                                <h1 className="text-2xl font-bold">{shop.name}</h1>

                                <div className="flex items-center gap-4 text-sm text-zinc-400">
                                    <span className="flex items-center gap-1 text-yellow-400">
                                        <FiStar /> {SHOP.rating}
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <FiMapPin /> {SHOP.location}
                                    </span>
                                </div>

                                <p className="text-zinc-400">{shop.description}</p>
                            </div>

                            {/* ACTION */}
                            <button className="bg-yellow-400 cursor-pointer text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
                                onClick={() => { setShowMap(!showMap) }}>
                                <FaDirections className="inline-block mr-2" />
                                {!showMap ? "Get Directions" : "Hide Map"}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    {showMap && <LocationViewer coords={coords} shop={shop} />}
                </div>

                {/* PRODUCTS */}
                <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
                    <h2 className="text-xl font-semibold">Products</h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((item) => (
                            <div
                                key={item.id}
                                className="bg-zinc-900 rounded-xl border border-white/5 hover:border-yellow-400/30 transition"
                            >
                                <ListingCard item={item} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShopProfile;
