// Step1Details.tsx
import Input from "../../shared/Input"; // Assume Input is a simple styled component
import { useReleaseStore } from "~/stores/useReleaseStore";

export default function Step1Details() {
    const { form, updateForm } = useReleaseStore();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-indigo-400 mb-6">1. Release Information</h2>

            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-300">Title</label>
                <Input
                    placeholder="E.g., The Midnight EP"
                    value={form.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm({ title: e.target.value })}
                    className="bg-gray-800 border border-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-300">Genre</label>
                <Input
                    placeholder="E.g., Electronic, Ambient"
                    value={form.genre}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateForm({ genre: e.target.value })}
                    className="bg-gray-800 border border-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
        </div>
    );
}