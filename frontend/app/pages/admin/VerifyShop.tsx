import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router'
import {
    FiArrowLeft, FiMail, FiPhone, FiCheckCircle,
    FiAlertTriangle, FiMapPin, FiCalendar, FiBox, FiLoader
} from 'react-icons/fi';
import axios from 'axios'; // Or your custom api client
import { getShopDetailsForAdmin } from '~/services/admin.service';
import AdminLayout from '~/components/layouts/AdminLayout';
const LocationViewer = React.lazy(() => import("~/components/maps/LocationViewr"));

interface ShopVerificationDetails {
    id: number;
    name: string;
    description: string;
    address_text: string;
    logo_url: string;
    banner_url: string;
    location: { lat: number; lng: number };
    is_approved: boolean;
    owner_name: string;
    owner_email: string;
    owner_phone: string;
    owner_account_verified: boolean;
    owner_joined_at: string;
    total_listings: number;
}

const ShopVerifyPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [shop, setShop] = useState<ShopVerificationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Replace with your actual admin endpoint
                const res = await getShopDetailsForAdmin(Number(id));
                setShop(res);
            } catch (err) {
                setError("Could not retrieve shop intelligence.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleApproval = async (status: boolean) => {
        setActionLoading(true);
        try {
            await axios.patch(`/api/admin/shops/${id}/approve`, { approve: status });
            // Update local state or redirect
            setShop(prev => prev ? { ...prev, is_approved: status } : null);
            alert(status ? "Shop is now live!" : "Shop has been restricted.");
        } catch (err) {
            alert("Approval action failed.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <FiLoader className="animate-spin mb-4" size={48} />
            <h2 className="font-black uppercase tracking-widest">Scanning Database...</h2>
        </div>
    );

    if (error || !shop) return (
        <div className="p-12 text-center space-y-4">
            <h1 className="text-4xl font-black text-red-500 uppercase">ACCESS ERROR</h1>
            <p className="font-bold">{error || "Shop intelligence not found."}</p>
            <button onClick={() => navigate(-1)} className="border-4 border-black p-4 font-black uppercase flex items-center gap-2 mx-auto hover:bg-yellow-400">
                <FiArrowLeft /> Return to Dashboard
            </button>
        </div>
    );

    const coords = { lat: shop.location.lat, lng: shop.location.lng }
    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-12">
                {/* TOP NAVIGATION BAR */}
                <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 font-black uppercase text-sm border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                    >
                        <FiArrowLeft /> Back
                    </button>

                    <div className="flex gap-4">
                        {!shop.is_approved ? (
                            <button
                                disabled={actionLoading}
                                onClick={() => handleApproval(true)}
                                className="bg-green-400 border-4 border-black px-8 py-3 font-black uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-500 disabled:opacity-50"
                            >
                                Approve Shop
                            </button>
                        ) : (
                            <button
                                disabled={actionLoading}
                                onClick={() => handleApproval(false)}
                                className="bg-red-400 border-4 border-black px-8 py-3 font-black uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 disabled:opacity-50"
                            >
                                Revoke Approval
                            </button>
                        )}
                    </div>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: SHOP PROFILE */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="border-4 border-black bg-white p-0 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="h-48 bg-gray-200 relative border-b-4 border-black">
                                <img src={shop.banner_url} alt="banner" className="w-full h-full object-cover" />
                                <div className="absolute -bottom-12 left-8 w-24 h-24 border-4 border-black bg-white">
                                    <img src={shop.logo_url} alt="logo" className="w-full h-full object-contain" />
                                </div>
                            </div>

                            <div className="pt-16 p-8 space-y-4">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-5xl font-black uppercase tracking-tighter">{shop.name}</h1>
                                    {shop.is_approved && <FiCheckCircle className="text-green-500" size={32} />}
                                </div>
                                <p className="text-lg font-bold text-gray-600 italic">"{shop.description}"</p>

                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="border-2 border-black p-4 bg-yellow-50">
                                        <label className="text-[10px] font-black uppercase text-gray-400 block">Inventory</label>
                                        <div className="flex items-center gap-2">
                                            <FiBox size={20} />
                                            <span className="text-xl font-black">{shop.total_listings} ACTIVE ITEMS</span>
                                        </div>
                                    </div>
                                    <div className="border-2 border-black p-4 bg-blue-50">
                                        <label className="text-[10px] font-black uppercase text-gray-400 block">Location</label>
                                        <div className="flex items-center gap-2">
                                            <FiMapPin size={20} />
                                            <span className="text-sm font-black uppercase">{shop.address_text}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LOCATION PREVIEW */}

                        <div className="w-full">
                            <LocationViewer coords={coords} shop={shop} />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: OWNER ROBUST CHECK */}
                    <div className="space-y-8">
                        <div className="border-4 border-black bg-black text-white p-8 shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]">
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-white pb-2">
                                Owner Intelligence
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-blue-400 uppercase">Legal Name</label>
                                    <p className="text-2xl font-black">{shop.owner_name}</p>
                                </div>

                                <div className="group">
                                    <label className="text-[10px] font-black text-blue-400 uppercase">Primary Contact</label>
                                    <p className="text-lg font-bold break-all">{shop.owner_email}</p>
                                    <a
                                        href={`mailto:${shop.owner_email}`}
                                        className="inline-flex items-center gap-2 mt-2 bg-blue-500 text-white px-4 py-2 border-2 border-white font-black uppercase text-xs hover:bg-white hover:text-black transition-colors"
                                    >
                                        <FiMail /> Send Verification Email
                                    </a>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-blue-400 uppercase">Verification Phone</label>
                                    <p className="text-2xl font-black tracking-widest">{shop.owner_phone}</p>
                                    <a
                                        href={`tel:${shop.owner_phone}`}
                                        className="inline-flex items-center gap-2 mt-2 bg-green-500 text-white px-4 py-2 border-2 border-white font-black uppercase text-xs hover:bg-white hover:text-black transition-colors"
                                    >
                                        <FiPhone /> Call For Check
                                    </a>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <FiCalendar className="text-blue-400" />
                                        <span className="text-xs font-bold uppercase text-gray-300">Joined: {new Date(shop.owner_joined_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {shop.owner_account_verified ? (
                                            <div className="flex items-center gap-2 text-green-400 font-black uppercase text-xs">
                                                <FiCheckCircle /> KYC Verified
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-400 font-black uppercase text-xs">
                                                <FiAlertTriangle /> Identity Not Verified
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-4 border-black bg-yellow-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black uppercase">
                            <h4 className="text-xs mb-2">Admin Note:</h4>
                            <p className="text-sm leading-tight">
                                Ensure you have checked the owner's verification status before approving high-value shops.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default ShopVerifyPage;