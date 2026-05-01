import { motion } from "framer-motion";
import ListingCard from "./ListingCard";

const LisingGrid = ({ items }: { items: any[] }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((listing) => (
                <ListingCard key={listing.id} item={listing} />
            ))}
        </div>
    );
}

export default LisingGrid;