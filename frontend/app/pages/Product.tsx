import React, { useEffect, useState } from "react";
import { FiStar, FiMapPin, FiHeart, FiAlertCircle, FiLoader, FiMessageSquare, FiSend, FiTrash2 } from "react-icons/fi";
import { Link, useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import PublicHeader from "~/components/layouts/PublicLayout";
import ListingCard from "~/components/listings/ListingCard";
import { getListingById } from "~/services/listing.service";
import { ReviewApiService } from "~/services/reviews.service";
import { useAuth } from "~/context/AuthContext";


const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [listing, setListing] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState<string>("");

    // Review Form State
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();

    const fetchData = async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            const [listingData, reviewsData] = await Promise.all([
                getListingById(id),
                ReviewApiService.getReviews(id)
            ]);

            setListing(listingData);
            setReviews(reviewsData);

            if (listingData.images && listingData.images.length > 0) {
                setActiveImage(listingData.images[0]);
            }
        } catch (err) {
            setError("Data Corrupted: Item not found in the archives.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return alert("Please select a rating.");

        setIsSubmitting(true);
        try {
            await ReviewApiService.postReview({
                listing_id: Number(id),
                rating,
                comment
            });
            // Reset form and refresh reviews
            setRating(0);
            setComment("");
            const updatedReviews = await ReviewApiService.getReviews(id!);
            setReviews(updatedReviews);
        } catch (err) {
            alert("Unauthorized: Please log in to leave a review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            await ReviewApiService.deleteReview(reviewId);
            setReviews(reviews.filter(r => r.id !== reviewId));
        } catch (err) {
            alert("Failed to delete review.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-yellow-400 font-mono">
                <FiLoader className="animate-spin mb-4" size={48} />
                <p className="animate-pulse">Loading ...</p>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 font-mono p-4 text-center">
                <FiAlertCircle size={64} className="mb-4" />
                <h1 className="text-2xl font-black uppercase mb-2">404: Listing not found</h1>
                <p>{error}</p>
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
                {/* PRODUCT SECTION */}
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* GALLERY */}
                    <div className="space-y-4">
                        <div className="bg-zinc-900 rounded-3xl overflow-hidden aspect-square relative border border-white/5 shadow-2xl">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    src={activeImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {listing.images?.map((img: string, i: number) => (
                                <img
                                    key={i}
                                    src={img}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all ${activeImage === img ? "border-yellow-400 scale-105" : "border-transparent opacity-50"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* DETAILS */}
                    <div className="flex flex-col justify-center space-y-8">
                        <div>
                            <span className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                                {listing.category || "General"}
                            </span>
                            <h1 className="text-5xl font-black mt-4 tracking-tighter leading-none">{listing.title}</h1>
                        </div>

                        <div className="text-5xl font-black text-white tracking-tight">
                            <span className="text-sm font-normal text-zinc-500 mr-2 uppercase">MWK</span>
                            {listing.price.toLocaleString()}
                        </div>

                        <Link to={`/shop/${listing.shop_id}`}>
                            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 flex gap-4 items-center hover:border-yellow-400/40 transition-all group">
                                <img src={listing.shop_logo || "/img.png"} className="w-14 h-14 rounded-lg object-cover" />
                                <div>
                                    <h3 className="font-bold group-hover:text-yellow-400 transition-colors">{listing.shop_name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                                        <span className="flex items-center gap-1 text-yellow-400"><FiStar fill="currentColor" /> {listing.rating || "5.0"}</span>
                                        <span className="flex items-center gap-1"><FiMapPin /> {listing.location}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className="flex gap-4">
                            <Link to={`/shop/${listing.shop_id}`} className="flex-4 p-4 bg-yellow-400 text-black py-4 rounded-xl font-black hover:bg-yellow-300 transition-transform active:scale-95 shadow-xl shadow-yellow-400/10">
                                CONTACT SELLER
                            </Link>
                            <button className="flex-1 flex items-center justify-center border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                                <FiHeart size={24} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xs font-black uppercase text-zinc-600 tracking-widest">Specifications</h3>
                            <p className="text-zinc-400 leading-relaxed text-lg">{listing.description}</p>
                        </div>
                    </div>
                </div>

                {/* REVIEWS SECTION */}
                <div className="grid lg:grid-cols-3 gap-16 border-t border-white/5 pt-16">
                    <div className="lg:col-span-1 space-y-6">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <FiMessageSquare className="text-yellow-400" /> REVIEWS
                        </h2>

                        <form onSubmit={handleSubmitReview} className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5 space-y-4">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="text-2xl transition-all"
                                    >
                                        <FiStar fill={(hover || rating) >= star ? "#facc15" : "transparent"}
                                            className={(hover || rating) >= star ? "text-yellow-400" : "text-zinc-800"} />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write your review..."
                                className="w-full bg-black border border-white/5 rounded-2xl p-4 text-sm focus:border-yellow-400 outline-none h-32 resize-none transition-all"
                            />
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? "UPLOADING..." : <><FiSend /> POST REVIEW</>}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-10">
                        {reviews.length > 0 ? reviews.map((r) => (
                            <div key={r.id} className="group space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <img src={r.avatar_url || `https://ui-avatars.com/api/?name=${r.username}`} className="w-10 h-10 rounded-full border border-white/10" />
                                        <div>
                                            <h4 className="font-bold text-sm">{r.username}</h4>
                                            <p className="text-[10px] text-zinc-600 font-mono uppercase">
                                                {new Date(r.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex text-yellow-400 text-xs">
                                            {[...Array(r.rating)].map((_, i) => <FiStar key={i} fill="currentColor" />)}
                                        </div>
                                        {r.user_id === user?.id && (
                                            <button onClick={() => handleDeleteReview(r.id)} className="text-zinc-700 hover:text-red-500 transition-colors">
                                                <FiTrash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-zinc-400 text-sm leading-relaxed border-l-2 border-yellow-400/20 pl-4">
                                    {r.comment}
                                </p>
                            </div>
                        )) : (
                            <div className="h-full flex items-center justify-center text-zinc-700 font-mono italic">
                                NO REVIEWS RECORDED IN THIS SECTOR.
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductDetail;