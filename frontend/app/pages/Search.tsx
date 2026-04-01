import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import PublicHeader from "~/components/layouts/PublicLayout";
import ListingCard from "~/components/listings/ListingCard";
import Loader from "~/components/modals/Loader";
import { searchListings } from "~/services/listing.service";


const Search = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("q") || ""; // Pull 'q' from /listings?q=...

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await searchListings(searchQuery);
                setListings(data);

            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [searchQuery]);

    console.log("Searched Listings", listings)
    return (
        <>
            <PublicHeader />
            <div className="min-h-screen bg-black text-white px-6 py-10 space-y-12">
                {/* HEADER */}
                <div className="max-w-7xl mx-auto space-y-4">
                    <h1 className="text-3xl font-bold">
                        Search <span className="text-yellow-400">Results</span>
                    </h1>
                </div>

                {/* MAIN GRID */}
                {
                    loading ?
                        <div className="w-full">
                            <Loader />
                        </div> :
                        listings.length ?
                            <section className="max-w-7xl mx-auto space-y-4">

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {listings.map((item, i) => (
                                        <div
                                            key={i}
                                            className="bg-zinc-900 rounded-xl border border-white/5 hover:border-yellow-400/30 transition"
                                        >
                                            <ListingCard key={i} item={item} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                            : <div className="text-white flex space-x-2">
                                <p>Couldnt fint the item</p>
                                <span className="text-yellow-500 font-bold">{searchQuery}</span>
                            </div>
                }
            </div>
        </>
    );
};

export default Search;
