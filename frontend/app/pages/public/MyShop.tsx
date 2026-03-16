import ShopForm from '~/components/forrms/ShopForm';
import ShopDashboard from '~/components/shop/ShopDashboard';
import DashboardLayout from '~/components/layouts/DashboardLayout';

const MyShop = () => {

    return (
        <DashboardLayout>
            <ShopForm onComplete={function (): void {
                throw new Error('Function not implemented.');
            }} />
            {/* <ShopDashboard /> */}
        </DashboardLayout>
    );
};
export default MyShop;