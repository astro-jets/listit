import React, { useState, useMemo } from 'react';
import {
    FiShoppingBag, FiArrowRight, FiLoader, FiImage
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createShop } from '~/services/shop.service';
import ClientOnly from '~/utils/ClientOnly';

// Lazy load to prevent SSR issues
const LocationSelector = React.lazy(() => import('~/components/maps/LocationSelector'));

// --- Zod Schema ---
const shopSchema = z.object({

    name: z.string()
        .min(3, "Shop name must be at least 3 characters")
        .max(30, "Shop name too long"),

    bio: z.string()
        .min(30, "Bio must be at least 30 characters")
        .max(100, "Bio is too long"),

    location: z.any().refine((val) => val !== null, "Please select your shop location on the map")
});

type ShopFormData = z.infer<typeof shopSchema>;

const CreateShopOnboarding = ({ onComplete }: { onComplete: () => void }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logo, setLogo] = useState<File | null>(null);
    const [shopBio, setShopBio] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<ShopFormData>({
        resolver: zodResolver(shopSchema),
        defaultValues: { name: '', bio: '', location: null }
    });

    const locationData = watch('location');

    // FIX: Memoize the map component to prevent "container reused" error
    // It will only render once, regardless of text field re-renders.
    const MemoizedMap = useMemo(() => (
        <ClientOnly>
            <React.Suspense
                fallback={<div className="flex items-center justify-center h-full font-black animate-pulse bg-gray-50">LOADING MAP...</div>}>
                <LocationSelector
                    onComplete={(data) => setValue('location', data, { shouldValidate: true })}
                />
            </React.Suspense>
        </ClientOnly>
    ), [setValue]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogo(e.target.files[0]);
        }
    };

    const onFormSubmit = async (data: ShopFormData) => {
        setIsSubmitting(true);
        if (!logo) return alert("Please upload a logo");
        try {
            // Use FormData for multipart/form-data (required for file uploads)
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('bio', shopBio);
            formData.append('location', JSON.stringify(data.location));
            if (logo) formData.append('logo', logo);

            await createShop(formData);
            alert("Shop created successfully!");
            onComplete();
        } catch (error) {
            console.error(error);
            alert("Error creating shop. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-8">
            <div className="max-w-2xl w-full border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] text-center space-y-8">

                <div className="w-20 h-20 bg-yellow-400 border-4 border-black flex items-center justify-center mx-auto -mt-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <FiShoppingBag size={40} />
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
                        Ready to <span className="bg-black text-yellow-400 px-2">Sell?</span>
                    </h1>
                    <p className="text-lg font-bold text-gray-500">
                        Create your shop in seconds and start reaching buyers.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    <div className="text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest ml-1">Proposed Shop Name</label>
                        <input
                            {...register('name')}
                            type="text"
                            placeholder="e.g. Vintage Vault"
                            className={`w-full border-4 border-black p-4 font-black text-xl focus:bg-yellow-50 outline-none ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && <p className="text-red-500 text-[10px] font-black uppercase mt-1">{errors.name.message}</p>}
                    </div>

                    <div className='text-left'>
                        <label className="text-[10px] font-black uppercase tracking-widest mb-1 block text-black">Bio / Tagline</label>
                        <textarea
                            {...register('bio')}
                            rows={3}
                            value={shopBio}
                            onChange={(e) => setShopBio(e.target.value)}
                            placeholder="Tell the world what you sell..."
                            className="w-full border-2 border-black p-3 font-medium focus:bg-yellow-50 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all"
                        />
                        {errors.bio && <p className="text-red-500 text-[10px] font-black uppercase mt-1">{errors.bio.message}</p>}
                    </div>

                    <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest block text-black">Visual Identity</label>
                        <label className="p-4 border-2 border-dashed border-black bg-gray-50 flex items-center justify-center gap-4 cursor-pointer hover:bg-yellow-50 transition-colors group">
                            <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                            <div className="p-3 bg-black text-yellow-400 group-hover:scale-110 transition-transform">
                                {logo ? <FiImage size={24} /> : <FiShoppingBag size={24} />}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-black uppercase">{logo ? logo.name : "Upload Shop Logo"}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">PNG, JPG up to 5MB</p>
                            </div>
                        </label>
                    </div>

                    <div className={`border-4 border-black overflow-hidden h-64 relative ${errors.location ? 'border-red-500' : ''}`}>
                        {MemoizedMap}
                        {locationData && (
                            <div className="absolute top-2 right-2 bg-green-400 border-2 border-black px-2 py-1 text-[8px] font-black uppercase z-50">
                                Location Set ✓
                            </div>
                        )}
                    </div>
                    {errors.location && <p className="text-red-500 text-[10px] font-black uppercase text-left">{errors.location.message as string}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group w-full bg-black text-white py-6 text-2xl font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-yellow-400 hover:text-black transition-all border-2 border-black shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] active:shadow-none active:translate-x-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <><FiLoader className="animate-spin" /> ESTABLISHING...</>
                        ) : (
                            <>Create My Shop <FiArrowRight className="group-hover:translate-x-2 transition-transform" /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateShopOnboarding;