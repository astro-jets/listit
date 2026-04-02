import { motion } from "framer-motion";
import ListingCard from "./ListingCard";

const LisingGrid = ({ items }: { items: any[] }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((listing) => (
                <motion.div
                    key={listing.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-zinc-900 rounded-xl overflow-hidden border border-white/5 hover:border-yellow-400/40 hover:shadow-[0_0_20px_rgba(250,204,21,0.05)] transition-all duration-300"
                >
                    <ListingCard item={listing} />
                </motion.div>
            ))}
        </div>
    );
}

export default LisingGrid;