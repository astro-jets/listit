import React, { useEffect, useState } from "react";
import { FiStar, FiMapPin, FiHeart, FiAlertCircle, FiLoader, FiMessageSquare, FiSend } from "react-icons/fi";
import { Link, useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion"; // Added Framer Motion
import PublicHeader from "~/components/layouts/PublicLayout";
import ListingCard from "~/components/listings/ListingCard";
import { getListingById } from "~/services/listing.service";

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

    // Review Form State
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hover, setHover] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const data = await getListingById(id);
                setListing(data);
                if (data.images && data.images.length > 0) {
                    setActiveImage(data.images[0]);
                }
            } catch (err) {
                setError("Data Corrupted: Item not found in the archives.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ rating, comment });
        alert("Review submitted for moderation!");
        setRating(0);
        setComment("");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-yellow-400 font-mono">
                <FiLoader className="animate-spin mb-4" size={48} />
                <p className="animate-pulse">LOADING MARKETPLACE DATA...</p>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 font-mono p-4 text-center">
                <FiAlertCircle size={64} className="mb-4" />
                <h1 className="text-2xl font-black uppercase mb-2">404: Item Not Found</h1>
                <button onClick={() => window.history.back()} className="mt-6 border-2 border-red-500 px-6 py-2 hover:bg-red-500 hover:text-white transition-all">
                    GO BACK
                </button>
            </div>
        );
    }

    return (
        <div className="bg-black text-white min-h-screen selection:bg-yellow-400/30">
            <PublicHeader />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto px-6 py-10 space-y-16"
            >
                {/* TOP SECTION */}
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* IMAGE GALLERY */}
                    <div className="space-y-4">
                        <div className="bg-zinc-900 rounded-2xl overflow-hidden aspect-square relative border border-white/5">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    src={activeImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {listing.images.map((img: string, i: number) => (
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    key={i}
                                    src={img}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-colors ${activeImage === img ? "border-yellow-400" : "border-transparent"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="flex flex-col justify-center space-y-8">
                        <div>
                            <motion.span
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-yellow-400 text-xs font-bold uppercase tracking-widest bg-yellow-400/10 px-3 py-1 rounded-full"
                            >
                                {listing.category}
                            </motion.span>
                            <h1 className="text-4xl font-black mt-4 tracking-tight">{listing.title}</h1>
                        </div>

                        <div className="text-4xl font-black text-white">
                            MWK {listing.price}
                        </div>

                        {/* SHOP CARD */}
                        <Link to={`/shop/${listing.shop_id}`}>
                            <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/5 flex gap-4 items-center hover:bg-zinc-900 hover:border-yellow-400/20 transition-all group">
                                <img src={listing.shop_logo} alt="" className="w-16 h-16 rounded-xl object-cover" />
                                <div>
                                    <h3 className="font-bold text-lg group-hover:text-yellow-400 transition-colors">{listing.shop_name}</h3>
                                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                                        <span className="flex items-center gap-1 text-yellow-400"><FiStar fill="currentColor" size={14} /> {listing.rating}</span>
                                        <span className="flex items-center gap-1"><FiMapPin size={14} /> {listing.location}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className="flex gap-4">
                            <Link to={`/shop/${listing.shop_id}`} className="flex-[3] p-4 bg-yellow-400 text-black py-4 rounded-xl font-bold hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/10">
                                Contact Seller
                            </Link>
                            <button className="flex-1 flex items-center justify-center border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                                <FiHeart size={24} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-bold uppercase text-zinc-500 tracking-wider">Description</h3>
                            <p className="text-zinc-300 leading-relaxed">{listing.description}</p>
                        </div>
                    </div>
                </div>

                {/* REVIEWS SECTION */}
                <div className="grid lg:grid-cols-3 gap-12 border-t border-white/5 pt-16">
                    <div className="lg:col-span-1 space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <FiMessageSquare className="text-yellow-400" /> Customer Reviews
                        </h2>

                        {/* REVIEW FORM */}
                        <form onSubmit={handleSubmitReview} className="bg-zinc-900/30 p-6 rounded-2xl border border-white/5 space-y-4">
                            <h4 className="font-bold text-sm uppercase text-zinc-400">Leave a Review</h4>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="text-2xl transition-colors"
                                    >
                                        <FiStar fill={(hover || rating) >= star ? "#facc15" : "transparent"} className={(hover || rating) >= star ? "text-yellow-400" : "text-zinc-700"} />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience with this seller..."
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-yellow-400 outline-none h-32 resize-none transition-colors"
                            />
                            <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors">
                                <FiSend /> Post Review
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        {/* MOCK REVIEWS */}
                        {[1, 2].map((r) => (
                            <div key={r} className="border-b border-white/5 pb-8 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-500">JD</div>
                                        <div>
                                            <h4 className="font-bold">John Doe</h4>
                                            <p className="text-xs text-zinc-500">2 days ago</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400 text-sm">
                                        <FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" />
                                    </div>
                                </div>
                                <p className="text-zinc-400 text-sm italic">"Exactly as described. Fast response from the shop owner and the item quality is top notch."</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RELATED ITEMS */}
                <section className="space-y-8 pt-8">
                    <h2 className="text-2xl font-black tracking-tight">You may also like</h2>

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
            </motion.div>
        </div>
    );
};

export default ProductDetail;