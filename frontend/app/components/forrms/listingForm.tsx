import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiExternalLink, FiHome, FiTruck, FiBriefcase, FiSmartphone, FiTag, FiTrash2, FiImage, FiLoader } from "react-icons/fi";
import { submitListing } from "~/services/listing.service";


// --- Zod Validation Schema ---
const listingSchema = z.object({
    category: z.string().min(1, "Please select a category"),
    title: z.string().min(3, "Title must be at least 3 characters").max(50),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

type ListingFormData = z.infer<typeof listingSchema>;

const NewListingForm = ({ onBack }: { onBack: () => void }) => {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // React Hook Form Setup
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset
    } = useForm<ListingFormData>({
        resolver: zodResolver(listingSchema),
        defaultValues: { category: "" }
    });

    const currentCategory = watch("category");

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const arr = Array.from(e.target.files);
            if (selectedImages.length + arr.length > 5) return alert("Limit 5 images");
            setSelectedImages([...selectedImages, ...arr]);
        }
    };

    const onFormSubmit = async (data: ListingFormData) => {
        if (selectedImages.length === 0) return alert("Please upload at least one image");

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("price", data.price);
            formData.append("category", data.category);
            formData.append("description", data.description);

            selectedImages.forEach((file) => {
                formData.append("images", file);
            });

            await submitListing(formData);
            alert("Listing Published Successfully!");
            reset();
            setSelectedImages([]);
            onBack();
        } catch (error) {
            console.error(error);
            alert("Failed to submit listing.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 border-2 border-black hover:bg-yellow-400">
                    <FiExternalLink className="rotate-180" />
                </button>
                <h2 className="text-3xl font-black uppercase tracking-tighter">New Shop Listing</h2>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="w-full grid grid-cols-1 gap-8 bg-white border-4 border-black p-8">

                {/* Category Picker */}
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest flex justify-between">
                        1. Select Category
                        {errors.category && <span className="text-red-500 lowercase">{errors.category.message}</span>}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {[
                            { id: 'real', lab: 'Homes', icon: <FiHome /> },
                            { id: 'auto', lab: 'Cars', icon: <FiTruck /> },
                            { id: 'jobs', lab: 'Jobs', icon: <FiBriefcase /> },
                            { id: 'elec', lab: 'Tech', icon: <FiSmartphone /> },
                            { id: 'misc', lab: 'Other', icon: <FiTag /> },
                        ].map(cat => (
                            <button
                                type="button"
                                key={cat.id}
                                onClick={() => setValue('category', cat.id, { shouldValidate: true })}
                                className={`flex flex-col items-center p-3 border-2 border-black transition-all ${currentCategory === cat.id ? 'bg-yellow-400 translate-y-1 shadow-none' : 'hover:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
                            >
                                {cat.icon}
                                <span className="text-[9px] font-black uppercase mt-1">{cat.lab}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest">2. Product Images ({selectedImages.length}/5)</label>
                    <div className="flex flex-wrap gap-3">
                        {selectedImages.map((file, i) => (
                            <div key={i} className="relative w-20 h-20 border-2 border-black group">
                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="prev" />
                                <button
                                    type="button"
                                    onClick={() => setSelectedImages(selectedImages.filter((_, idx) => idx !== i))}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white border border-black p-1 hover:bg-black"
                                >
                                    <FiTrash2 size={12} />
                                </button>
                            </div>
                        ))}
                        {selectedImages.length < 5 && (
                            <label className="w-20 h-20 border-2 border-dashed border-black flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-50">
                                <FiImage className="text-gray-400" />
                                <input type="file" multiple className="hidden" onChange={handleFile} accept="image/*" />
                            </label>
                        )}
                    </div>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                    <div className="relative">
                        <input
                            {...register("title")}
                            type="text"
                            placeholder="LISTING TITLE"
                            className={`w-full border-2 border-black p-4 font-black focus:outline-none focus:bg-yellow-50 ${errors.title ? 'border-red-500' : ''}`}
                        />
                        {errors.title && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.title.message}</p>}
                    </div>

                    <div className="relative">
                        <input
                            {...register("price")}
                            type="text"
                            placeholder="PRICE ($)"
                            className={`w-full border-2 border-black p-4 font-mono font-bold focus:outline-none focus:bg-yellow-50 ${errors.price ? 'border-red-500' : ''}`}
                        />
                        {errors.price && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.price.message}</p>}
                    </div>

                    <div className="relative">
                        <textarea
                            {...register("description")}
                            placeholder="DESCRIPTION"
                            rows={4}
                            className={`w-full border-2 border-black p-4 font-medium focus:outline-none focus:bg-yellow-50 ${errors.description ? 'border-red-500' : ''}`}
                        ></textarea>
                        {errors.description && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.description.message}</p>}
                    </div>
                </div>

                <button
                    disabled={isSubmitting}
                    className="w-full bg-black text-white py-5 text-xl font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] active:shadow-none active:translate-x-1 disabled:opacity-50 flex justify-center items-center gap-3"
                >
                    {isSubmitting ? <><FiLoader className="animate-spin" /> PROCESSING...</> : 'PUBLISH TO SHOP'}
                </button>
            </form>
        </div>
    );
}

export default NewListingForm;