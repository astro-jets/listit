import React, { useEffect, useState } from 'react';
import { FiUser, FiSearch, FiStar, FiFilter, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import { useAuth } from '~/context/AuthContext';
import { getMyShop, getShopReviews, replyToReview } from '~/services/shop.service';

interface Review {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    productName: string;
    replied: boolean;
}

const ReviewsPage = () => {
    const [filter, setFilter] = useState<number | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Assuming your auth provides the user object
    const { user } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Get the shop details first
                const shop = await getMyShop();


                const data = await getShopReviews(shop.id);
                setReviews(data);
            } catch (err) {
                console.error(err);
            }
        };
        loadData();
    }, []);

    const handleReply = async (reviewId: number) => {
        const text = prompt("Enter your response:");
        if (!text) return;

        try {
            await replyToReview(reviewId, text);
            setReviews(prev => prev.map(r =>
                r.id === reviewId ? { ...r, replied: true } : r
            ));
        } catch (err) {
            alert("Reply failed to send.");
        }
    };

    const filteredReviews = reviews.filter(rev => {
        const matchesRating = filter === 'all' || rev.rating === filter;
        const matchesSearch = rev.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rev.productName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRating && matchesSearch;
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1)
        : "0.0";

    // Helper to render stars based on the average
    const renderStars = (rating: string) => {
        const num = parseFloat(rating);
        return [...Array(5)].map((_, i) => (
            <FiStar
                key={i}
                fill={i < Math.round(num) ? "currentColor" : "none"}
                className={i < Math.round(num) ? "text-yellow-500" : "text-gray-300"}
            />
        ));
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-80px)] bg-white p-2 overflow-hidden gap-2">

                {/* --- SIDEBAR: Analytics & Filters --- */}
                <aside className="w-full md:w-80 border-4 border-black flex flex-col bg-gray-50">
                    <div className="p-4 border-b-4 border-black bg-yellow-400">
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter">Business Reputation</h1>

                        {/* Global Rating Stats */}
                        <div className="mt-4 p-3 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-center justify-between">
                                {/* Dynamic Average Rating */}
                                <span className="text-4xl font-black">{averageRating}</span>

                                {/* Dynamic Star Display */}
                                <div className="flex">
                                    {renderStars(averageRating)}
                                </div>
                            </div>

                            {/* Dynamic Total Count */}
                            <p className="text-[10px] font-black uppercase text-gray-400 mt-1">
                                Total {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
                            </p>
                        </div>
                    </div>

                    <div className="p-4 space-y-4 max-h-screen overflow-hidden">
                        {/* <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="SEARCH REVIEWS..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border-2 border-black p-2 pl-10 font-bold text-xs focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            />
                        </div> */}

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1">
                                <FiFilter /> Filter by Rating
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                                {['all', 5, 4, 3, 2, 1].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setFilter(r as any)}
                                        className={`p-2 border-2 border-black font-black text-xs uppercase transition-all flex justify-between items-center
                                            ${filter === r ? 'bg-black text-white translate-x-1 shadow-none' : 'bg-white hover:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}
                                        `}
                                    >
                                        <span>{r === 'all' ? 'All Reviews' : `${r} Stars`}</span>
                                        {r !== 'all' && <FiStar className={filter === r ? 'text-yellow-400' : 'text-black'} fill="currentColor" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- MAIN FEED AREA --- */}
                <main className="flex-1 border-4 border-black bg-white overflow-y-auto">
                    {/* Feed Header */}
                    <div className="p-4 border-b-4 border-black flex items-center justify-between sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 border-2 border-black bg-yellow-400 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <FiTrendingUp strokeWidth={3} />
                            </div>
                            <div>
                                <h2 className="font-black uppercase text-sm tracking-tight leading-none">Customer Feed</h2>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Showing {filteredReviews.length} Results</span>
                            </div>
                        </div>
                    </div>

                    {/* Review Cards List */}
                    <div className="p-4 space-y-6">
                        {filteredReviews.length > 0 ? filteredReviews.map((rev) => (
                            <div key={rev.id} className="border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white group hover:bg-yellow-50 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 border-2 border-black bg-gray-200 flex items-center justify-center">
                                            <FiUser size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-black uppercase text-sm">{rev.userName}</h3>
                                            <div className="flex text-yellow-500 text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar key={i} fill={i < rev.rating ? "currentColor" : "none"} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-gray-400">{rev.date}</p>
                                        <p className="text-xs font-bold text-black border-b-2 border-yellow-400 inline-block">{rev.productName}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 border-2 border-black p-4 font-bold text-sm mb-4 italic">
                                    "{rev.comment}"
                                </div>

                                {/* <div className="flex justify-end gap-2">
                                    {rev.replied ? (
                                        <span className="text-[10px] font-black uppercase bg-green-400 px-2 py-1 border-2 border-black flex items-center gap-1">
                                            <FiMessageSquare /> Replied
                                        </span>
                                    ) : (
                                        <button className="text-[10px] font-black uppercase bg-black text-white px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(250,204,21,1)] hover:bg-yellow-400 hover:text-black transition-all active:shadow-none active:translate-x-1 active:translate-y-1">
                                            Write Response
                                        </button>
                                    )}
                                </div> */}
                            </div>
                        )) : (
                            <div className="py-20 text-center">
                                <div className="w-20 h-20 border-4 border-black bg-gray-100 flex items-center justify-center mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4">
                                    <FiSearch size={40} className="text-gray-300" />
                                </div>
                                <h2 className="text-xl font-black uppercase">No Reviews Found</h2>
                                <p className="text-gray-400 font-bold uppercase text-xs">Try changing your filters.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
};

export default ReviewsPage;