import React, { useState } from "react";
import { FiStar, FiMapPin, FiHeart } from "react-icons/fi";
import ListingCard from "~/components/listings/ListingCard";

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
    const [activeImage, setActiveImage] = useState(PRODUCT.images[0]);

    return (
        <div className="bg-black text-white min-h-screen">

            {/* CONTAINER */}
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

                {/* TOP SECTION */}
                <div className="grid lg:grid-cols-2 gap-10">

                    {/* IMAGE GALLERY */}
                    <div className="space-y-4">
                        <div className="bg-zinc-900 rounded-xl overflow-hidden">
                            <img
                                src={activeImage}
                                className="w-full h-[400px] object-cover"
                            />
                        </div>

                        <div className="flex gap-3">
                            {PRODUCT.images.map((img, i) => (
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
                            <h1 className="text-3xl font-bold">{PRODUCT.title}</h1>
                            <p className="text-zinc-400">{PRODUCT.category}</p>
                        </div>

                        {/* PRICE */}
                        <div className="text-3xl font-bold text-yellow-400">
                            MWK {PRODUCT.price}
                        </div>

                        {/* SHOP */}
                        <div className="bg-zinc-900 p-4 rounded-xl border border-white/5 space-y-2">
                            <h3 className="font-semibold">{PRODUCT.shop.name}</h3>

                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                                <span className="flex items-center gap-1 text-yellow-400">
                                    <FiStar /> {PRODUCT.shop.rating}
                                </span>

                                <span className="flex items-center gap-1">
                                    <FiMapPin /> {PRODUCT.shop.location}
                                </span>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-4">
                            <button className="flex-1 bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:scale-105 transition">
                                Contact Seller
                            </button>

                            <button className="p-3 border border-white/10 rounded-lg hover:border-yellow-400 transition">
                                <FiHeart />
                            </button>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="space-y-2">
                            <h3 className="font-semibold">Description</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {PRODUCT.description}
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
