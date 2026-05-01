import React, { useState, useMemo } from 'react';
import {
    FiShoppingBag, FiArrowRight, FiLoader, FiImage, FiMapPin, FiNavigation, FiX
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createShop } from '~/services/shop.service';
import ClientOnly from '~/utils/ClientOnly';

const LocationSelector = React.lazy(() => import('~/components/maps/LocationSelector'));

const shopSchema = z.object({
    name: z.string().min(3, "Shop name must be at least 3 characters").max(30, "Shop name too long"),
    bio: z.string().min(30, "Bio must be at least 30 characters").max(100, "Bio is too long"),
    address_text: z.string().min(5, "Physical address or landmark required").max(100, "Address too long"),
    location: z.any().refine((val) => val !== null, "Please select your shop location on the map")
});

type ShopFormData = z.infer<typeof shopSchema>;

const CreateShopOnboarding = ({ onComplete }: { onComplete: () => void }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logo, setLogo] = useState<File | null>(null);
    const [banner, setBanner] = useState<File | null>(null);
    const [showPCModal, setShowPCModal] = useState(false); // Modal state
    const [coords, setCoords] = useState<{ lat: number; lng: number }>(); // Store coordinates
    const [isLocating, setIsLocating] = useState(false); // New state for geolocation loading

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<ShopFormData>({
        resolver: zodResolver(shopSchema),
        defaultValues: { name: '', bio: '', address_text: '', location: null }
    });

    const locationData = watch('location');

    // --- Geolocation Logic ---
    const handleLocateMe = () => {
        if (window.innerWidth >= 1024) {
            setShowPCModal(true);
            return;
        }

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        // Start loading
        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ lat: latitude, lng: longitude });
                setValue('location', { lat: latitude, lng: longitude }, { shouldValidate: true });
                setIsLocating(false); // Stop loading on success
            },
            () => {
                alert("Unable to retrieve your location. Please ensure GPS is on.");
                setIsLocating(false); // Stop loading on error
            },
            { timeout: 10000 } // Optional: add a timeout
        );
    };

    const MemoizedMap = useMemo(() => (
        <ClientOnly>
            <React.Suspense
                fallback={<div className="flex items-center justify-center w-full h-[300px] font-black animate-pulse bg-gray-50 uppercase">LOADING MAP...</div>}>
                <div className="h-[300px] w-full">
                    <LocationSelector
                        initialCoords={coords}
                        onComplete={(data) => setValue('location', data, { shouldValidate: true })}
                    />
                </div>
            </React.Suspense>
        </ClientOnly>
    ), [setValue, coords]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'logo') setLogo(e.target.files[0]);
            else setBanner(e.target.files[0]);
        }
    };

    const onFormSubmit = async (data: ShopFormData) => {
        if (!logo || !banner) {
            alert("Both Logo and Banner images are required.");
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("bio", data.bio);
            formData.append("address_text", data.address_text);
            formData.append("location", JSON.stringify(data.location));
            formData.append("logo", logo);
            formData.append("banner", banner);

            await createShop(formData);
            onComplete();
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to establish shop");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[70vh] w-full flex items-center justify-center py-12 px-4 relative">

            {/* PC WARNING MODAL */}
            {showPCModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white border-4 border-black p-8 max-w-sm w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
                        <div className="flex justify-end">
                            <button onClick={() => setShowPCModal(false)}><FiX size={24} className="hover:rotate-90 transition-transform" /></button>
                        </div>
                        <FiNavigation size={50} className="mx-auto text-yellow-500" />
                        <h3 className="text-2xl font-black uppercase italic">Mobile Required</h3>
                        <p className="font-bold text-sm uppercase">Please use your phone to get precise GPS coordinates for your shop.</p>
                        <button
                            onClick={() => setShowPCModal(false)}
                            className="w-full bg-black text-white py-3 font-black uppercase hover:bg-yellow-400 hover:text-black transition-colors border-2 border-black"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-2xl w-full border-4 border-black p-8 bg-white shadow-[12px_12px_0px_0px_rgba(250,204,21,1)] text-center space-y-8">

                <div className="w-20 h-20 bg-yellow-400 border-4 border-black flex items-center justify-center mx-auto -mt-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <FiShoppingBag size={40} />
                </div>

                <div className="space-y-2">
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
                        Ready to <span className="bg-black text-yellow-400 px-2">Sell?</span>
                    </h1>
                    <p className="text-sm font-bold text-gray-500 uppercase italic">Initialize storefront and start listing.</p>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    {/* SHOP NAME */}
                    <div className="text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest ml-1">Proposed Shop Name</label>
                        <input
                            {...register('name')}
                            type="text"
                            placeholder="E.G. THE IRON FORGE"
                            className={`w-full border-4 border-black p-4 font-black text-xl focus:bg-yellow-50 outline-none uppercase ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && <p className="text-red-500 text-[10px] font-black uppercase mt-1">{errors.name.message}</p>}
                    </div>

                    {/* ADDRESS TEXT */}
                    <div className="text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest ml-1">Readable Address / Landmark</label>
                        <div className="relative">
                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
                            <input
                                {...register('address_text')}
                                type="text"
                                placeholder="E.G. Sector 7, Near the central hub"
                                className={`w-full border-4 border-black p-4 pl-12 font-black text-xl focus:bg-yellow-50 outline-none uppercase ${errors.address_text ? 'border-red-500' : ''}`}
                            />
                        </div>
                        {errors.address_text && <p className="text-red-500 text-[10px] font-black uppercase mt-1">{errors.address_text.message}</p>}
                    </div>

                    {/* BIO */}
                    <div className='text-left'>
                        <label className="text-[10px] font-black uppercase tracking-widest mb-1 block text-black">Bio / Tagline</label>
                        <textarea
                            {...register('bio')}
                            rows={3}
                            placeholder="Tell the world..."
                            className="w-full border-4 border-black p-4 font-bold focus:bg-yellow-50 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all uppercase text-sm"
                        />
                    </div>

                    {/* MAP SELECTOR + LOCATE ME BUTTON */}
                    <div className="text-left space-y-1">
                        <div className="flex justify-between items-end mb-1">
                            <label className="text-[10px] font-black uppercase tracking-widest block text-black">Coordinate Lock</label>

                            {/* NEW LOCATE ME BUTTON */}
                            <button
                                type="button"
                                onClick={handleLocateMe}
                                disabled={isLocating} // Prevent double-clicks
                                className={`flex items-center gap-2 border-2 border-black px-3 py-1 text-[10px] font-black uppercase transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] ${isLocating
                                    ? "bg-gray-200 cursor-not-allowed"
                                    : "bg-yellow-400 hover:bg-black hover:text-yellow-400"
                                    }`}
                            >
                                {isLocating ? (
                                    <>
                                        <FiLoader size={12} className="animate-spin" /> Finding your location...
                                    </>
                                ) : (
                                    <>
                                        <FiNavigation size={12} /> Locate Me
                                    </>
                                )}
                            </button>
                        </div>

                        <div className={`border-4 border-black overflow-hidden relative ${errors.location ? 'border-red-500' : ''}`}>
                            {MemoizedMap}
                            {locationData && (
                                <div className="absolute top-4 right-4 bg-green-400 border-2 border-black px-3 py-1 text-[10px] font-black uppercase z-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    Coordinates Set ✓
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group w-full bg-black text-white py-6 text-2xl font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-yellow-400 hover:text-black transition-all border-4 border-black shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] active:shadow-none active:translate-x-2 active:translate-y-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <><FiLoader className="animate-spin" /> ESTABLISHING...</>
                        ) : (
                            <>Initialize Shop <FiArrowRight className="group-hover:translate-x-2 transition-transform" /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateShopOnboarding;