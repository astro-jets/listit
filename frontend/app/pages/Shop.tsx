import ListingCard from "~/components/listings/ListingCard";
import { FiStar, FiMapPin, FiAlertCircle, FiLoader, FiCheckCircle, FiMessageSquare, FiSend, FiTrash2, FiClock } from "react-icons/fi";
import PublicHeader from "~/components/layouts/PublicLayout";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getShopListings } from "~/services/listing.service";
import { getShopById } from "~/services/shop.service";
import { ReviewApiService } from "~/services/reviews.service";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { FaDirections } from "react-icons/fa";
import { useAuth } from "~/context/AuthContext";
import AuthRequiredModal from "~/components/modals/AuthModel";
import ErrorModal from "~/components/modals/ErrorModal";

const LocationViewer = React.lazy(() => import("../components/maps/LocationViewr"));

const ShopProfile = () => {
    const { id } = useParams<{ id: string }>();
    const [shop, setShop] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMap, setShowMap] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Review State
    const [reviews, setReviews] = useState<any[]>([]);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [ShowErrorModal, setShowErrorModal] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchShopData = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const [shopData, productsData, reviewsData] = await Promise.all([
                    getShopById(id),
                    getShopListings(id),
                    ReviewApiService.getShopReviews(id)
                ]);
                setShop(shopData);
                setProducts(productsData);
                setReviews(reviewsData)
            } catch (err) {
                setError("Merchant record not found in this sector.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchShopData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center font-black italic">
                <div className="w-16 h-16 border-[6px] border-black border-t-yellow-400 rounded-full animate-spin mb-6" />
                <p className="tracking-tighter text-2xl uppercase">Synchronizing Merchant Data...</p>
            </div>
        );
    }

    if (error || !shop) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="bg-red-500 border-[4px] border-black p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-center">
                    <FiAlertCircle size={64} className="mx-auto mb-4 text-white" />
                    <h1 className="text-4xl font-black uppercase text-white mb-2">Error: 404</h1>
                    <p className="text-black font-bold uppercase">{error}</p>
                </div>
            </div>
        );
    }

    const coords = shop.location || { lat: 0, lng: 0 };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setShowErrorModal(true);
            setErrorMsg("Please set a rating")
            setErrorTitle("Rating not set!")
            return
        }

        setIsSubmitting(true);
        try {
            const response = await ReviewApiService.postShopReview({
                shop_id: Number(shop.id),
                rating,
                comment
            });
            if (response?.error === "No token provided") {
                setShowAuthModal(true);
                return;
            }
            setRating(5);
            setComment("");
            // Refresh reviews logic here
        } catch (err) {
            setShowAuthModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#F8F8F8] text-black min-h-screen selection:bg-yellow-400 font-sans pb-20">
            <PublicHeader />
            <AuthRequiredModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
            <ErrorModal
                title={errorTitle}
                msg={errorMsg}
                isOpen={ShowErrorModal}
                onClose={() => setShowErrorModal(false)}
            />
            {/* HERO BANNER - Stark Contrast */}
            <div className="relative h-80 w-full border-b-[4px] border-black bg-zinc-200 overflow-hidden">
                <img
                    src={shop.banner_url || "/placeholder-banner.png"}
                    className="w-full h-full object-cover"
                    alt="Banner"
                />
                <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />
            </div>

            {/* SHOP IDENTITY SECTION */}
            <div className="max-w-7xl mx-auto px-6 relative z-20 -mt-32">
                <div className="flex flex-col md:flex-row items-start gap-8">

                    {/* BRUTALIST LOGO */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="w-48 h-48 md:w-56 md:h-56 bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden shrink-0"
                    >
                        <img
                            src={shop.logo_url || "/img.png"}
                            className="w-full h-full object-cover"
                            alt={shop.name}
                        />
                    </motion.div>

                    {/* DESCRIPTION BOX */}
                    <div className="flex-1 bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(250,204,21,1)]">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic italic-bold leading-none">
                                {shop.name}
                            </h1>
                            <FiCheckCircle className="text-blue-500" size={30} strokeWidth={3} />
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-xs font-black uppercase mb-6">
                            <div className="bg-yellow-400 border-[2px] border-black px-3 py-1 flex items-center gap-2">
                                <FiStar fill="black" /> {shop.rating || "5.0"} [120+ FEEDBACKS]
                            </div>
                            <div className="flex items-center gap-2 border-[2px] border-black px-3 py-1 bg-white">
                                <FiMapPin /> {typeof shop.location === 'string' ? shop.location : "Blantyre, Malawi"}
                            </div>
                            <div className="flex items-center gap-2 text-zinc-500">
                                <FiClock /> EST. MARCH 2026
                            </div>
                        </div>

                        <p className="text-xl font-bold leading-tight text-zinc-800 uppercase max-w-3xl">
                            {shop.description}
                        </p>

                        <div className="mt-8">
                            <button
                                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-black uppercase italic border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                                onClick={() => setShowMap(!showMap)}
                            >
                                <FaDirections /> {!showMap ? "Locate Establishment" : "Collapse Intel"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* INTERACTIVE MAP */}
                <AnimatePresence>
                    {showMap && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: "auto", opacity: 1, marginTop: 40 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white"
                        >
                            <div className="h-[400px]">
                                <LocationViewer coords={coords} shop={shop} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* MAIN CONTENT GRID */}
                <div className="grid lg:grid-cols-3 gap-16 mt-20">

                    {/* LEFT: PRODUCTS */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-end justify-between border-b-[6px] border-black pb-4">
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Current Inventory</h2>
                            <span className="bg-black text-white px-3 py-1 text-xs font-black">{products.length} UNITS</span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            {products.map((item, i) => (
                                <div key={item.id} className="h-full">
                                    <ListingCard item={item} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: REVIEWS */}
                    <div className="space-y-10">
                        <div className="border-[4px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                                <FiMessageSquare size={28} className="text-yellow-400" /> Submit Intel
                            </h2>

                            <form onSubmit={handleSubmitReview} className="space-y-6">
                                <div className="flex gap-2 bg-zinc-100 p-3 border-[2px] border-black w-fit">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                            className="text-2xl transition-transform active:scale-90"
                                        >
                                            <FiStar
                                                fill={(hover || rating) >= star ? "black" : "transparent"}
                                                className="text-black"
                                            />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="TYPE REPORT HERE..."
                                    className="w-full bg-white border-[3px] border-black p-4 font-bold uppercase text-sm focus:bg-yellow-50 outline-none h-32 resize-none transition-all placeholder:text-zinc-300"
                                />
                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full bg-yellow-400 text-black border-[3px] border-black font-black py-4 uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "TRANSMITTING..." : "POST FEEDBACK"}
                                </button>
                            </form>
                        </div>

                        {/* FEEDBACK FEED */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-black uppercase tracking-widest border-l-[10px] border-black pl-4">Verified Reports</h3>
                            {reviews.length > 0 ? reviews.map((r) => (
                                <div key={r.id} className="bg-white border-[3px] border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 border-[2px] border-black overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                                <img src={r.avatar_url || `https://ui-avatars.com/api/?name=${r.username}`} alt="User" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-xs uppercase underline">{r.username}</h4>
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase">{new Date(r.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex text-black text-[10px] font-black bg-yellow-400 px-2 border-[1.5px] border-black">
                                            {r.rating}/5
                                        </div>
                                    </div>
                                    <p className="font-bold text-sm uppercase leading-tight text-zinc-700">
                                        "{r.comment}"
                                    </p>
                                    {r.user_id === user?.id && (
                                        <button className="mt-4 text-red-600 font-black text-[10px] uppercase hover:underline">
                                            [ Redact Review ]
                                        </button>
                                    )}
                                </div>
                            )) : (
                                <div className="border-[3px] border-dashed border-black p-10 text-center font-black uppercase text-zinc-400">
                                    No data recorded in this sector.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopProfile;