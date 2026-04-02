import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiExternalLink, FiImage, FiLoader, FiX, FiMapPin } from "react-icons/fi";
import { submitListing, getCategories } from "~/services/listing.service";

// Updated Schema to match DB types
const listingSchema = z.object({
    category_id: z.number().min(1, "Select a category"),
    title: z.string().min(3, "Min 3 characters").max(50),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Use format 0.00"),
    location: z.string().min(2, "Location required"), // Added location field
    description: z.string().min(10, "Min 10 characters"),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    onBack: () => void;
    shopId: string;
}

const NewListingForm = ({ onBack, shopId }: Props) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingCats, setIsLoadingCats] = useState(true);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ListingFormData>({
        resolver: zodResolver(listingSchema),
    });

    const currentCategoryId = watch("category_id");

    // Fetch dynamic categories from DB
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to load categories");
            } finally {
                setIsLoadingCats(false);
            }
        };
        loadCategories();
    }, []);

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
            formData.append("category_id", String(data.category_id)); // Use ID now
            formData.append("location", data.location);
            formData.append("description", data.description);

            selectedImages.forEach((img) => formData.append("images", img));

            await submitListing(formData);
            alert("Artifact Listed Successfully!");
            onBack();
        } catch (error) {
            alert("Broadcast failed. Check your connection to the archives.");
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
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                    New <span className="bg-black text-white px-2">Listing</span>
                </h2>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-8">

                {/* Dynamic Category Selection */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Class Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {isLoadingCats ? (
                            <div className="col-span-5 py-4 text-center font-mono animate-pulse">Loading Classes...</div>
                        ) : (
                            categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setValue('category_id', cat.id)}
                                    className={`p-3 border-2 border-black font-black uppercase text-[10px] transition-all ${currentCategoryId === cat.id ? 'bg-yellow-400 translate-x-1 translate-y-1 shadow-none' : 'hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))
                        )}
                    </div>
                    {errors.category_id && <p className="text-red-500 text-xs font-bold uppercase">{errors.category_id.message}</p>}
                </div>

                {/* Image Upload Area */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedImages.map((file, i) => (
                        <div key={i} className="relative w-24 h-24 border-2 border-black shrink-0 bg-zinc-100">
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => setSelectedImages(selectedImages.filter((_, idx) => idx !== i))}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 border-2 border-black"
                            >
                                <FiX size={12} />
                            </button>
                        </div>
                    ))}
                    {selectedImages.length < 5 && (
                        <label className="w-24 h-24 border-2 border-dashed border-black flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-50 shrink-0">
                            <FiImage className="text-xl mb-1" />
                            <span className="text-[8px] font-black">ADD IMG</span>
                            <input type="file" multiple className="hidden" onChange={handleFile} accept="image/*" />
                        </label>
                    )}
                </div>

                {/* Inputs */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4 md:col-span-2">
                        <input {...register("title")} placeholder="ITEM TITLE" className="w-full border-2 border-black p-4 font-black uppercase placeholder:text-zinc-300 outline-none focus:bg-yellow-50" />
                        {errors.title && <p className="text-red-500 text-xs font-bold">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-zinc-400">MWK</span>
                            <input {...register("price")} placeholder="0.00" className="w-full border-2 border-black p-4 pl-14 font-mono font-bold outline-none focus:bg-yellow-50" />
                        </div>
                        {errors.price && <p className="text-red-500 text-xs font-bold">{errors.price.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <div className="relative">
                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input {...register("location")} placeholder="REGION/CITY" className="w-full border-2 border-black p-4 pl-10 font-black uppercase outline-none focus:bg-yellow-50" />
                        </div>
                        {errors.location && <p className="text-red-500 text-xs font-bold">{errors.location.message}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-1">
                        <textarea {...register("description")} placeholder="SPECIFICATIONS & LORE" rows={4} className="w-full border-2 border-black p-4 outline-none focus:bg-yellow-50" />
                        {errors.description && <p className="text-red-500 text-xs font-bold">{errors.description.message}</p>}
                    </div>
                </div>

                <button
                    disabled={isSubmitting || isLoadingCats}
                    className="w-full bg-black text-white py-5 font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50"
                >
                    {isSubmitting ? <FiLoader className="animate-spin mx-auto" size={24} /> : 'INITIALIZE LISTING'}
                </button>
            </form>
        </div>
    );
};

export default NewListingForm;