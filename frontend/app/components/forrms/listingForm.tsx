import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiExternalLink, FiHome, FiTruck, FiBriefcase, FiSmartphone, FiTag, FiTrash2, FiImage, FiLoader, FiX } from "react-icons/fi";
import { submitListing } from "~/services/listing.service";

const listingSchema = z.object({
    category: z.string().min(1, "Select a category"),
    title: z.string().min(3, "Min 3 characters").max(50),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Use format 0.00"),
    description: z.string().min(10, "Min 10 characters"),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface Props {
    onBack: () => void;
    shopId: string;
}

const NewListingForm = ({ onBack, shopId }: Props) => {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<ListingFormData>({
        resolver: zodResolver(listingSchema),
    });

    const currentCategory = watch("category");

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (selectedImages.length + files.length > 5) {
                alert("Max 5 images allowed");
                return;
            }
            setSelectedImages([...selectedImages, ...files]);
        }
    };

    const onFormSubmit = async (data: ListingFormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("shop_id", shopId);
            formData.append("title", data.title);
            formData.append("price", data.price);
            formData.append("category", data.category);
            formData.append("description", data.description);

            selectedImages.forEach((img) => formData.append("images", img));

            await submitListing(formData);
            alert("Listing Published!");
            onBack();
        } catch (error) {
            alert("Upload failed. Check connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 text-left p-4">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 border-2 border-black hover:bg-yellow-400 transition-colors">
                    <FiExternalLink className="rotate-180" />
                </button>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">New <span className="bg-black text-white px-2">Listing</span></h2>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-8">
                {/* Category Selection */}
                <div className="grid grid-cols-5 gap-2">
                    {['homes', 'cars', 'jobs', 'tech', 'misc'].map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setValue('category', cat)}
                            className={`p-4 border-2 border-black font-black uppercase text-[10px] ${currentCategory === cat ? 'bg-yellow-400' : 'hover:bg-gray-50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Image Upload Area */}
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {selectedImages.map((file, i) => (
                        <div key={i} className="relative w-24 h-24 border-2 border-black shrink-0">
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => setSelectedImages(selectedImages.filter((_, idx) => idx !== i))}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full border-2 border-black"
                            >
                                <FiX size={12} />
                            </button>
                        </div>
                    ))}
                    {selectedImages.length < 5 && (
                        <label className="w-24 h-24 border-2 border-dashed border-black flex items-center justify-center cursor-pointer hover:bg-yellow-50 shrink-0">
                            <FiImage className="text-2xl" />
                            <input type="file" multiple className="hidden" onChange={handleFile} accept="image/*" />
                        </label>
                    )}
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                    <input {...register("title")} placeholder="TITLE" className="w-full border-2 border-black p-4 font-black uppercase" />
                    <input {...register("price")} placeholder="PRICE (0.00)" className="w-full border-2 border-black p-4 font-mono font-bold" />
                    <textarea {...register("description")} placeholder="DESCRIPTION" rows={4} className="w-full border-2 border-black p-4" />
                </div>

                <button
                    disabled={isSubmitting}
                    className="w-full bg-black text-white py-5 font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-[6_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                >
                    {isSubmitting ? <FiLoader className="animate-spin mx-auto" /> : 'PUBLISH TO SHOP'}
                </button>
            </form>
        </div>
    );
};

export default NewListingForm;