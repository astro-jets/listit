import React, { useEffect, useState } from "react";
import {
    FiStar, FiMapPin, FiHeart, FiAlertCircle,
    FiLoader, FiMessageSquare, FiTrash2, FiArrowLeft
} from "react-icons/fi";
import { Link, useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import PublicHeader from "~/components/layouts/PublicLayout";
import { getListingById, toggleFavorite } from "~/services/listing.service";
import { ReviewApiService } from "~/services/reviews.service";
import { useAuth } from "~/context/AuthContext";
import AuthRequiredModal from "~/components/modals/AuthModel";
import ErrorModal from "~/components/modals/ErrorModal";
import QuestionModal from "~/components/modals/QuestionModal";

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
    const [isFavoriting, setIsFavoriting] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [ShowErrorModal, setShowErrorModal] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [reviewToDelete, setReviewToDelete] = useState<any>();

    const [ShowQuestionModal, setShowQuestionModal] = useState(false);
    const [questionTitle, setQuestionTitle] = useState('');
    const [questionMsg, setQuestionMsg] = useState('');

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

    const handleFavoriteToggle = async () => {
        if (isFavoriting || !listing) return;
        setIsFavoriting(true);
        try {
            const response = await toggleFavorite(listing.id);
            if (response?.error === "No token provided") {
                setShowAuthModal(true);
                return;
            }
            setListing((prev: any) => ({
                ...prev,
                is_favorited: !prev.is_favorited
            }));
        } catch (err: any) {
            if (err.response?.status === 401) {
                setShowAuthModal(true);
            }
        } finally {
            setIsFavoriting(false);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setShowErrorModal(true);
            setErrorMsg("Please set a rating");
            setErrorTitle("Rating not set!");
            return;
        }
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
            setShowAuthModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteReviewPrehandler = async (reviewId: string) => {
        setShowQuestionModal(true);
        setQuestionMsg("Do you want to remove your rating?");
        setQuestionTitle("Are you sure?");
        setReviewToDelete(reviewId);
    };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            await ReviewApiService.deleteReview(reviewId);
            setReviews(reviews.filter(r => r.id !== reviewId));
        } catch (err) {
            alert("Failed to delete review.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black font-black px-4">
                <div className="p-6 md:p-8 border-[4px] border-black bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                    <FiLoader className="animate-spin mb-4" size={40} />
                    <p className="uppercase tracking-widest text-lg italic">Initializing Stream...</p>
                </div>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="border-[4px] border-black p-8 md:p-12 bg-zinc-50 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] max-w-lg">
                    <FiAlertCircle size={56} className="mb-4 mx-auto text-red-500" />
                    <h1 className="text-3xl md:text-4xl font-black uppercase mb-4 italic">404: Archive Lost</h1>
                    <p className="font-bold uppercase text-zinc-600 text-sm">{error}</p>
                    <button onClick={() => window.history.back()} className="mt-8 w-full md:w-auto bg-black text-white px-8 py-3 font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                        Return to Hub
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white text-black min-h-screen selection:bg-yellow-400 overflow-x-hidden">
            <PublicHeader />

            <QuestionModal
                title={questionTitle}
                msg={questionMsg}
                isOpen={ShowQuestionModal}
                onClose={() => { setShowQuestionModal(false); setReviewToDelete(null) }}
                onContinue={() => { setShowQuestionModal(false); handleDeleteReview(reviewToDelete) }}
            />
            <ErrorModal
                title={errorTitle}
                msg={errorMsg}
                isOpen={ShowErrorModal}
                onClose={() => setShowErrorModal(false)}
            />
            <AuthRequiredModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-10 md:space-y-16">
                {/* BREADCRUMB */}
                <Link to="/explore" className="inline-flex items-center gap-2 font-black uppercase text-xs md:text-sm group">
                    <div className="bg-black text-white p-1.5 md:p-2 border-2 border-black group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                        <FiArrowLeft size={16} />
                    </div>
                    <span>Back to Explore</span>
                </Link>

                {/* PRODUCT SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                    {/* GALLERY */}
                    <div className="space-y-4 md:space-y-6">
                        <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden aspect-square relative">
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
                        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {listing.images?.map((img: string, i: number) => (
                                <img
                                    key={i}
                                    src={img}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-20 h-20 md:w-24 md:h-24 object-cover border-[3px] cursor-pointer transition-all flex-shrink-0 ${activeImage === img
                                        ? "border-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                                        : "border-black grayscale opacity-60 hover:opacity-100 hover:grayscale-0"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* DETAILS */}
                    <div className="flex flex-col space-y-6 md:space-y-10">
                        <div className="space-y-3 md:space-y-4 text-left">
                            <span className="inline-block bg-black text-yellow-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] px-3 py-1 border-2 border-black">
                                {listing.category_name || "Standard Issue"}
                            </span>
                            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                                {listing.title}
                            </h1>
                        </div>

                        <div className="text-4xl md:text-6xl font-black bg-yellow-400 border-[3px] md:border-[4px] border-black p-4 md:p-6 inline-block w-fit shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] italic">
                            <span className="text-base md:text-lg font-bold mr-2 not-italic">MWK</span>
                            {listing.price.toLocaleString()}
                        </div>

                        <Link to={`/shop/${listing.shop_id}`}>
                            <div className="bg-white border-[3px] border-black p-4 md:p-6 flex gap-4 md:gap-5 items-center hover:bg-zinc-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group active:translate-x-1 active:translate-y-1 active:shadow-none">
                                <img src={listing.shop_logo || "/img.png"} className="w-12 h-12 md:w-16 md:h-16 border-2 border-black object-cover" />
                                <div className="flex-1">
                                    <h3 className="text-lg md:text-xl font-black uppercase italic group-hover:text-yellow-600 transition-colors underline decoration-4 underline-offset-4">{listing.shop_name}</h3>
                                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold uppercase mt-2">
                                        <span className="flex items-center gap-1 bg-black text-white px-2 py-0.5"><FiStar fill="currentColor" /> {listing.rating || "5.0"}</span>
                                        <span className="flex items-center gap-1 whitespace-nowrap"><FiMapPin /> {listing.location}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to={`/shop/${listing.shop_id}`} className="flex-[4] bg-black text-white text-center py-4 md:py-5 font-black uppercase text-lg md:text-xl border-[3px] border-black hover:bg-yellow-400 hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                                Establish Contact
                            </Link>
                            <button
                                onClick={handleFavoriteToggle}
                                disabled={isFavoriting}
                                className={`flex-1 flex items-center justify-center py-4 sm:py-0 border-[3px] border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${listing.is_favorited
                                    ? "bg-red-500 text-white"
                                    : "bg-white text-black hover:bg-red-50"
                                    }`}
                            >
                                <FiHeart
                                    size={24}
                                    fill={listing.is_favorited ? "currentColor" : "none"}
                                    className={isFavoriting ? "animate-pulse" : ""}
                                />
                            </button>
                        </div>

                        <div className="border-[3px] border-black p-6 md:p-8 bg-zinc-50 relative">
                            <div className="absolute -top-3.5 md:-top-4 left-4 bg-black text-white px-3 py-1 font-black uppercase text-[10px] md:text-xs">Technical Manual</div>
                            <p className="text-lg md:text-xl font-bold leading-tight uppercase italic">{listing.description}</p>
                        </div>
                    </div>
                </div>

                {/* REVIEWS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16 border-t-[6px] md:border-t-[8px] border-black pt-10 md:pt-16">
                    <div className="lg:col-span-1 space-y-6 md:space-y-8">
                        <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase">
                            User <span className="bg-yellow-400 px-2">Feedback</span>
                        </h2>

                        <form onSubmit={handleSubmitReview} className="bg-white border-[4px] border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] md:shadow-[10px_10px_0px_0px_rgba(250,204,21,1)] space-y-6">
                            <div className="flex gap-2 bg-black p-2 md:p-3 w-fit border-2 border-black">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="text-xl md:text-2xl transition-transform hover:scale-125"
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
                                className="w-full bg-zinc-50 border-[3px] border-black p-4 text-base md:text-lg font-bold focus:bg-yellow-50 outline-none h-32 md:h-40 resize-none placeholder:text-zinc-400 uppercase italic"
                            />
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full bg-black text-white font-black py-4 md:py-5 border-[3px] border-black hover:bg-yellow-400 hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase"
                            >
                                {isSubmitting ? "TRANSMITTING..." : "POST DATA"}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-8 md:space-y-10">
                        {reviews.length > 0 ? reviews.map((r) => (
                            <div key={r.id} className="border-b-[3px] md:border-b-[4px] border-black pb-8 group">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <img
                                            src={r.avatar_url || `https://ui-avatars.com/api/?name=${r.username}&background=000&color=fff`}
                                            className="w-12 h-12 md:w-14 md:h-14 border-[3px] border-black object-cover"
                                        />
                                        <div>
                                            <h4 className="font-black uppercase text-base md:text-lg italic underline decoration-yellow-400 decoration-2 md:decoration-4">{r.username}</h4>
                                            <p className="text-[10px] md:text-xs font-black text-zinc-500 uppercase mt-0.5">
                                                {new Date(r.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="flex bg-black text-yellow-400 px-2 md:px-3 py-1 border-2 border-black font-black text-xs md:text-sm">
                                            {[...Array(r.rating)].map((_, i) => <FiStar key={i} fill="currentColor" />)}
                                        </div>
                                        {r.user_id === user?.id && (
                                            <button onClick={() => deleteReviewPrehandler(r.id)} className="bg-red-500 text-white p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all active:translate-x-1 active:translate-y-1">
                                                <FiTrash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-zinc-50 border-l-[6px] md:border-l-[8px] border-black p-4 md:p-6">
                                    <p className="text-lg md:text-xl font-bold uppercase italic leading-tight text-zinc-800">
                                        "{r.comment}"
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="h-64 flex flex-col items-center justify-center border-[4px] border-dashed border-zinc-300 text-zinc-400 px-6 text-center">
                                <FiMessageSquare size={40} className="mb-4 opacity-20" />
                                <p className="font-black uppercase italic text-lg md:text-xl tracking-tighter">No signals detected.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer className="bg-black text-white mt-20 md:mt-24 py-12 md:py-16 border-t-[8px] md:border-t-[10px] border-yellow-400 text-center px-4">
                <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-4">Studio X Hub</h2>
                <p className="uppercase font-bold text-zinc-500 tracking-[0.15em] md:tracking-[0.3em] text-xs md:text-sm">Authorized Trading Floor</p>
            </footer>
        </div>
    );
};

export default ProductDetail;