import DashboardLayout from "~/components/layouts/DashboardLayout";
import ListingsManager from "~/components/listings/ListingManager";

const InventoryPage = () => {
    return (
        <DashboardLayout>
            <ListingsManager />
        </DashboardLayout>
    );
}

export default InventoryPage;