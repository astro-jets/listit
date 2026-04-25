import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiExternalLink, FiLoader, FiX, FiPlus } from "react-icons/fi";
import { submitListing, getCategories } from "~/services/listing.service";

const MAX_IMAGES = 5;

const listingSchema = z.object({
    category_id: z.number().min(1, "Select a category"),
    title: z.string().min(3, "Min 3 characters").max(50),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Use format 0.00"),
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
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingCats, setIsLoadingCats] = useState(true);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ListingFormData>({
        resolver: zodResolver(listingSchema),
    });

    const currentCategoryId = watch("category_id");

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
            const newFiles = Array.from(e.target.files);
            if (selectedImages.length + newFiles.length > MAX_IMAGES) {
                alert(`Tactical Error: Maximum ${MAX_IMAGES} images allowed.`);
                return;
            }
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setSelectedImages(prev => [...prev, ...newFiles]);
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const onFormSubmit = async (data: ListingFormData) => {
        if (selectedImages.length === 0) {
            alert("Visual data required.");
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("shop_id", shopId);
            formData.append("title", data.title);
            formData.append("price", data.price);
            formData.append("category_id", String(data.category_id));
            formData.append("description", data.description);
            selectedImages.forEach((img) => formData.append("images", img));

            await submitListing(formData);
            onBack();
        } catch (error) {
            alert("Broadcast failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 text-left p-2 md:p-0">
            {/* Header Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 border-2 border-black hover:bg-yellow-400 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                >
                    <FiExternalLink className="rotate-180" size={18} />
                </button>
                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">
                    New <span className="bg-black text-white px-2">Artifact</span>
                </h2>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white border-4 border-black p-5 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-6 md:space-y-8">

                {/* Image Grid */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                        Visual Documentation ({selectedImages.length}/{MAX_IMAGES})
                    </label>
                    <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                        {previews.map((url, i) => (
                            <div key={url} className="relative w-24 h-24 md:w-28 md:h-28 border-4 border-black shrink-0 bg-zinc-100 snap-start">
                                <img src={url} className="w-full h-full object-cover" alt="preview" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                >
                                    <FiX size={12} />
                                </button>
                                {i === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black text-white text-[7px] font-black uppercase text-center py-0.5">
                                        Primary
                                    </div>
                                )}
                            </div>
                        ))}

                        {selectedImages.length < MAX_IMAGES && (
                            <label className="w-24 h-24 md:w-28 md:h-28 border-4 border-dashed border-black flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-400 transition-all shrink-0 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none snap-start">
                                <FiPlus className="text-xl mb-1" />
                                <span className="text-[8px] md:text-[9px] font-black uppercase">Add View</span>
                                <input type="file" multiple className="hidden" onChange={handleFile} accept="image/*" />
                            </label>
                        )}
                    </div>
                </div>

                {/* Class Selection */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Class Specification</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {isLoadingCats ? (
                            <div className="col-span-full py-4 text-center font-mono text-xs border-2 border-black border-dashed animate-pulse">Syncing Classes...</div>
                        ) : (
                            categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setValue('category_id', cat.id)}
                                    className={`p-2.5 md:p-3 border-2 border-black font-black uppercase text-[9px] md:text-[10px] transition-all leading-tight ${currentCategoryId === cat.id
                                        ? 'bg-yellow-400 translate-x-1 translate-y-1 shadow-none'
                                        : 'bg-white hover:bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))
                        )}
                    </div>
                    {errors.category_id && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.category_id.message}</p>}
                </div>

                {/* Text Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Identity</label>
                        <input
                            {...register("title")}
                            placeholder="ARTIFACT TITLE"
                            className="w-full border-4 border-black p-3 md:p-4 font-black uppercase text-sm placeholder:text-zinc-300 outline-none focus:bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        />
                        {errors.title && <p className="text-red-500 text-[10px] font-black uppercase">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Valuation</label>
                        <div className="relative">
                            <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 font-mono font-black text-zinc-400 text-xs md:text-sm">MWK</span>
                            <input
                                {...register("price")}
                                placeholder="0.00"
                                className="w-full border-4 border-black p-3 md:p-4 pl-12 md:pl-16 font-mono font-black text-sm outline-none focus:bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            />
                        </div>
                        {errors.price && <p className="text-red-500 text-[10px] font-black uppercase">{errors.price.message}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Core Specifications</label>
                        <textarea
                            {...register("description")}
                            placeholder="DESCRIBE THE ARTIFACT'S HISTORY"
                            rows={4}
                            className="w-full border-4 border-black p-3 md:p-4 font-bold text-sm outline-none focus:bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        />
                        {errors.description && <p className="text-red-500 text-[10px] font-black uppercase">{errors.description.message}</p>}
                    </div>
                </div>

                <button
                    disabled={isSubmitting || isLoadingCats}
                    className="w-full bg-black text-white py-4 md:py-6 text-lg md:text-xl font-black uppercase tracking-widest md:tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 border-4 border-black"
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                            <FiLoader className="animate-spin" size={20} />
                            <span>Broadcasting...</span>
                        </div>
                    ) : 'Initialize Listing'}
                </button>
            </form>
        </div>
    );
};

export default NewListingForm;