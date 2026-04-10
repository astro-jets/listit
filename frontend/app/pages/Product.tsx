import React, { useEffect, useState } from "react";
import { FiStar, FiMapPin, FiHeart, FiAlertCircle, FiLoader, FiMessageSquare, FiSend, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { Link, useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import PublicHeader from "~/components/layouts/PublicLayout";
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
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black font-black">
                <div className="p-8 border-[4px] border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                    <FiLoader className="animate-spin mb-4" size={48} />
                    <p className="uppercase tracking-widest text-xl italic">Initializing Stream...</p>
                </div>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
                <div className="border-[4px] border-black p-12 bg-zinc-50 shadow-[12px_12px_0px_0px_rgba(239,68,68,1)]">
                    <FiAlertCircle size={64} className="mb-4 mx-auto text-red-500" />
                    <h1 className="text-4xl font-black uppercase mb-4 italic">404: Archive Lost</h1>
                    <p className="font-bold uppercase text-zinc-600">{error}</p>
                    <button onClick={() => window.history.back()} className="mt-8 bg-black text-white px-8 py-3 font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                        Return to Hub
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white text-black min-h-screen selection:bg-yellow-400">
            <PublicHeader />

            <div className="max-w-7xl mx-auto px-6 py-10 space-y-16">

                {/* BREADCRUMB / BACK */}
                <Link to="/explore" className="inline-flex items-center gap-2 font-black uppercase text-sm group">
                    <div className="bg-black text-white p-2 border-2 border-black group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                        <FiArrowLeft />
                    </div>
                    <span>Back to Explore</span>
                </Link>

                {/* PRODUCT SECTION */}
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* GALLERY - Blocky & Stark */}
                    <div className="space-y-6">
                        <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden aspect-square relative">
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
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {listing.images?.map((img: string, i: number) => (
                                <img
                                    key={i}
                                    src={img}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-24 h-24 object-cover border-[3px] cursor-pointer transition-all ${activeImage === img
                                        ? "border-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                                        : "border-black grayscale opacity-60 hover:opacity-100 hover:grayscale-0"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* DETAILS - Bold Typography */}
                    <div className="flex flex-col space-y-10">
                        <div className="space-y-4">
                            <span className="inline-block bg-black text-yellow-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-1 border-2 border-black">
                                {listing.category || "Standard Issue"}
                            </span>
                            <h1 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                                {listing.title}
                            </h1>
                        </div>

                        <div className="text-6xl font-black bg-yellow-400 border-[4px] border-black p-6 inline-block w-fit shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] italic">
                            <span className="text-lg font-bold mr-2 not-italic">MWK</span>
                            {listing.price.toLocaleString()}
                        </div>

                        {/* SHOP CARD - Neo-Brutalist Block */}
                        <Link to={`/shop/${listing.shop_id}`}>
                            <div className="bg-white border-[3px] border-black p-6 flex gap-5 items-center hover:bg-zinc-50 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group active:translate-x-1 active:translate-y-1 active:shadow-none">
                                <img src={listing.shop_logo || "/img.png"} className="w-16 h-16 border-2 border-black object-cover" />
                                <div className="flex-1">
                                    <h3 className="text-xl font-black uppercase italic group-hover:text-yellow-600 transition-colors underline decoration-4 underline-offset-4">{listing.shop_name}</h3>
                                    <div className="flex items-center gap-4 text-xs font-bold uppercase mt-2">
                                        <span className="flex items-center gap-1 bg-black text-white px-2 py-0.5"><FiStar fill="currentColor" /> {listing.rating || "5.0"}</span>
                                        <span className="flex items-center gap-1"><FiMapPin /> {listing.location}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className="flex gap-4">
                            <Link to={`/shop/${listing.shop_id}`} className="flex-[4] bg-black text-white text-center py-5 font-black uppercase text-xl border-[3px] border-black hover:bg-yellow-400 hover:text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                                Establish Contact
                            </Link>
                            <button className="flex-1 flex items-center justify-center border-[3px] border-black hover:bg-red-50 hover:text-red-500 transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
                                <FiHeart size={28} />
                            </button>
                        </div>

                        <div className="border-[3px] border-black p-8 bg-zinc-50 relative">
                            <div className="absolute -top-4 left-4 bg-black text-white px-3 py-1 font-black uppercase text-xs">Technical Manual</div>
                            <p className="text-xl font-bold leading-tight uppercase italic">{listing.description}</p>
                        </div>
                    </div>
                </div>

                {/* REVIEWS SECTION - Heavy Grids */}
                <div className="grid lg:grid-cols-3 gap-16 border-t-[8px] border-black pt-16">
                    <div className="lg:col-span-1 space-y-8">
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase">
                            User <span className="bg-yellow-400 px-2">Feedback</span>
                        </h2>

                        <form onSubmit={handleSubmitReview} className="bg-white border-[4px] border-black p-8 shadow-[10px_10px_0px_0px_rgba(250,204,21,1)] space-y-6">
                            <div className="flex gap-2 bg-black p-3 w-fit border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="text-2xl transition-transform hover:scale-125"
                                    >
                                        <FiStar
                                            fill={(hover || rating) >= star ? "#facc15" : "transparent"}
                                            className={(hover || rating) >= star ? "text-yellow-400" : "text-white"}
                                        />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="TRANSMIT REVIEW..."
                                className="w-full bg-zinc-50 border-[3px] border-black p-4 text-lg font-bold focus:bg-yellow-50 outline-none h-40 resize-none placeholder:text-zinc-400 uppercase italic"
                            />
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full bg-black text-white font-black py-5 border-[3px] border-black flex items-center justify-center gap-3 hover:bg-yellow-400 hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? "TRANSMITTING..." : <><FiSend /> POST DATA</>}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-10">
                        {reviews.length > 0 ? reviews.map((r) => (
                            <div key={r.id} className="border-b-[4px] border-black pb-8 group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={r.avatar_url || `https://ui-avatars.com/api/?name=${r.username}&background=000&color=fff`}
                                            className="w-14 h-14 border-[3px] border-black"
                                        />
                                        <div>
                                            <h4 className="font-black uppercase text-lg italic underline decoration-yellow-400 decoration-4">{r.username}</h4>
                                            <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mt-1">
                                                {new Date(r.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex bg-black text-yellow-400 px-3 py-1 border-2 border-black font-black text-sm">
                                            {[...Array(r.rating)].map((_, i) => <FiStar key={i} fill="currentColor" />)}
                                        </div>
                                        {r.user_id === user?.id && (
                                            <button onClick={() => handleDeleteReview(r.id)} className="bg-red-500 text-white p-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all active:translate-x-1 active:translate-y-1">
                                                <FiTrash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-zinc-50 border-l-[8px] border-black p-6">
                                    <p className="text-xl font-bold uppercase italic leading-tight text-zinc-800">
                                        "{r.comment}"
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="h-64 flex flex-col items-center justify-center border-[4px] border-dashed border-zinc-300 text-zinc-400">
                                <FiMessageSquare size={48} className="mb-4 opacity-20" />
                                <p className="font-black uppercase italic text-xl tracking-tighter">No signals detected in this sector.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* STARK FOOTER SECTION */}
            <footer className="bg-black text-white mt-24 py-16 border-t-[10px] border-yellow-400">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Studio X Hub</h2>
                    <p className="uppercase font-bold text-zinc-500 tracking-[0.3em]">Authorized Trading Floor</p>
                </div>
            </footer>
        </div>
    );
};

export default ProductDetail;