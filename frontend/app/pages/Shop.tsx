import ListingCard from "~/components/listings/ListingCard";
import { FiStar, FiMapPin } from "react-icons/fi";

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
    return (
        <div className="bg-black text-white min-h-screen">

            {/* BANNER */}
            <div className="relative h-64">
                <img
                    src={SHOP.banner}
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
                                src={SHOP.banner}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* INFO */}
                        <div className="flex-1 space-y-2">
                            <h1 className="text-2xl font-bold">{SHOP.name}</h1>

                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                                <span className="flex items-center gap-1 text-yellow-400">
                                    <FiStar /> {SHOP.rating}
                                </span>

                                <span className="flex items-center gap-1">
                                    <FiMapPin /> {SHOP.location}
                                </span>
                            </div>

                            <p className="text-zinc-400">{SHOP.description}</p>
                        </div>

                        {/* ACTION */}
                        <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition">
                            Visit Store
                        </button>
                    </div>
                </div>
            </div>

            {/* PRODUCTS */}
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
                <h2 className="text-xl font-semibold">Products</h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PRODUCTS.map((item) => (
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
    );
};

export default ShopProfile;
