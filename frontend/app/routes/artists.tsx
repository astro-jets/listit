import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { createArtist, getArtists } from "../../src/api/artistApi";

const artistSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    genre: z.string().min(2, "Genre must be at least 2 characters"),
    bio: z.string().max(1000).optional(),
});

type ArtistForm = z.infer<typeof artistSchema>;

export default function artistRoutes() {
    const [status, setStatus] = useState<string | null>(null);
    const [artists, setArtists] = useState<any>();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ArtistForm>({ resolver: zodResolver(artistSchema) });

    const onSubmit = async (data: ArtistForm) => {
        setStatus(null);
        try {
            // const res = await createArtist(data);
            // setStatus(`Success: ${res?.data?.message ?? "Created"}`);
            reset();
        } catch (err: any) {
            setStatus(err?.response?.data?.message ?? err?.message ?? "Error");
        }
    };

    useEffect(() => {
        const loadArtists = async () => {
            try {
                // const data = await getArtists();
                setArtists([]);
            } catch (err) {
                console.error("Failed to fetch artists:", err);
            }
        };

        loadArtists();
    }, []);


    return (
        <div className="container mx-auto p-6">
            <h1 className="text-xl md:text-4xl font-bold mb-4 text-center">Artists</h1>

            <div className="max-w-lg mx-auto  p-6 rounded shadow">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            {...register("name")}
                            placeholder="Artist name"
                        />
                        {errors.name && (
                            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Genre</label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            {...register("genre")}
                            placeholder="Genre"
                        />
                        {errors.genre && (
                            <p className="text-red-600 text-sm mt-1">{errors.genre.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <textarea
                            className="w-full border rounded px-3 py-2"
                            {...register("bio")}
                            placeholder="Short bio (optional)"
                            rows={4}
                        />
                        {errors.bio && (
                            <p className="text-red-600 text-sm mt-1">{errors.bio.message}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
                        >
                            {isSubmitting ? "Submitting..." : "Create Artist"}
                        </button>
                    </div>
                </form>

                {status && <p className="mt-4 text-center">{status}</p>}
            </div>
        </div>
    );
}