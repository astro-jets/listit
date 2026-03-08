// Step2Tracks.tsx

import FileUpload from "../../shared/FileUpload"; // Assume this is a component handling file selection
import { useReleaseStore } from "~/stores/useReleaseStore";

export default function Step2Tracks() {
    const {
        albumArtFile,
        trackFiles,
        setAlbumArt,
        addTrackFile
    } = useReleaseStore();

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-indigo-400 mb-6">2. Media Uploads</h2>

            {/* --- Album Art Uploader --- */}
            <div className="border border-gray-700 p-6 rounded-lg bg-gray-800">
                <h3 className="text-xl font-semibold text-gray-200 mb-4">Album Art (Cover)</h3>
                <FileUpload
                    // accept="image/*"
                    onChange={(file: File) => setAlbumArt(file)}
                // Assume FileUpload visually displays the file/name
                />
                {albumArtFile && (
                    <p className="mt-3 text-sm text-green-400">✅ Art Selected: {albumArtFile.name}</p>
                )}
            </div>

            {/* --- Track Uploader --- */}
            <div className="border border-gray-700 p-6 rounded-lg bg-gray-800">
                <h3 className="text-xl font-semibold text-gray-200 mb-4">Audio Tracks (MP3)</h3>
                <FileUpload
                    // accept="audio/mp3"
                    // multiple={true}
                    onChange={(file: File) => addTrackFile(file)}
                />

                <ul className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                    {trackFiles.map((t, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-300 bg-gray-700 p-2 rounded">
                            <svg className="w-5 h-5 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {t.name}.mp3
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}