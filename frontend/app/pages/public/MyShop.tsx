import ShopForm from '~/components/forrms/ShopForm';
import ShopDashboard from '~/components/shop/ShopDashboard';
import DashboardLayout from '~/components/layouts/DashboardLayout';

const MyShop = () => {

    return (
        <DashboardLayout>
            {/* <ShopForm /> */}
            <ShopDashboard />
        </DashboardLayout>
    );
};
export default MyShop;