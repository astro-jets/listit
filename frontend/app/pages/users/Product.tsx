import { useEffect, useState } from "react";
import {
    FiStar, FiMapPin, FiAlertCircle,
    FiLoader, FiArrowLeft,
    FiMessageSquare
} from "react-icons/fi";
import { Link, useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { getListingById } from "~/services/listing.service";
import { ReviewApiService } from "~/services/reviews.service";
import { useAuth } from "~/context/AuthContext";
import DashboardLayout from "~/components/layouts/DashboardLayout";

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [listing, setListing] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState<string>("");

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



    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black font-black px-4">
                <div className="p-6 md:p-8 border-4 border-black bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                    <FiLoader className="animate-spin mb-4" size={40} />
                    <p className="uppercase tracking-widest text-lg italic">Initializing Stream...</p>
                </div>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="border-4 border-black p-8 md:p-12 bg-zinc-50 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] max-w-lg">
                    <FiAlertCircle size={56} className="mb-4 mx-auto text-red-500" />
                    <h1 className="text-3xl md:text-4xl font-black uppercase mb-4 italic">404: Archive Lost</h1>
                    <p className="font-bold uppercase text-zinc-600 text-sm">{error}</p>
                    <Link to={'/inventory'}
                        className="mt-8 w-full md:w-auto bg-black text-white px-8 py-3 font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                        Return to Inventory
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="bg-white text-black min-h-screen selection:bg-yellow-400 overflow-x-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-10 md:space-y-16">
                    {/* BREADCRUMB */}
                    <Link to="/inventory" className="inline-flex items-center gap-2 font-black uppercase text-xs md:text-sm group">
                        <div className="bg-black text-white p-1.5 md:p-2 border-2 border-black group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                            <FiArrowLeft size={16} />
                        </div>
                        <span>Back to Inentory</span>
                    </Link>

                    {/* PRODUCT SECTION */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                        {/* GALLERY */}
                        <div className="space-y-4 md:space-y-6">
                            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden aspect-square relative">
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

                            <div className="border-[3px] border-black p-6 md:p-8 bg-zinc-50 relative">
                                <div className="absolute -top-3.5 md:-top-4 left-4 bg-black text-white px-3 py-1 font-black uppercase text-[10px] md:text-xs">Technical Manual</div>
                                <p className="text-lg md:text-xl font-bold leading-tight uppercase italic">{listing.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8 md:space-y-10">
                        {reviews.length > 0 ? reviews.map((r) => (
                            <div key={r.id} className="border-b-[3px] md:border-b-4 border-black pb-8 group">
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
                                    </div>
                                </div>
                                <div className="bg-zinc-50 border-l-[6px] md:border-l-8 border-black p-4 md:p-6">
                                    <p className="text-lg md:text-xl font-bold uppercase italic leading-tight text-zinc-800">
                                        "{r.comment}"
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="h-64 flex flex-col items-center justify-center border-4 border-dashed border-zinc-300 text-zinc-400 px-6 text-center">
                                <FiMessageSquare size={40} className="mb-4 opacity-20" />
                                <p className="font-black uppercase italic text-lg md:text-xl tracking-tighter">No signals detected.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProductDetail;