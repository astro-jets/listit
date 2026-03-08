// Step3Review.tsx

import { useReleaseStore } from "~/stores/useReleaseStore";
import ProgressBar from "../../shared/ProgressBar"; // Assume ProgressBar exists

export default function Step3Review() {
    const {
        form,
        trackFiles,
        albumArtFile,
        status,
        uploadProgress,
        submitReleaseAction,
        error
    } = useReleaseStore();

    const canSubmit = albumArtFile && trackFiles.length > 0;
    const isProcessing = status === 'UPLOADING' || status === 'SUBMITTING';
    const isComplete = status === 'COMPLETE';

    const getStatusText = () => {
        if (status === 'UPLOADING') return `Uploading Files... (${Math.round(uploadProgress)}%)`;
        if (status === 'SUBMITTING') return 'Finalizing Release...';
        if (status === 'COMPLETE') return 'Release Submitted!';
        return 'Submit Release';
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-indigo-400 mb-6">3. Review & Submit</h2>

            {/* --- Review Section --- */}
            <div className="border border-gray-700 p-6 rounded-lg bg-gray-800 text-gray-300 space-y-4">
                <h3 className="text-xl font-semibold text-white">Summary</h3>
                <p><span className="font-medium text-indigo-300">Title:</span> {form.title || 'N/A'}</p>
                <p><span className="font-medium text-indigo-300">Genre:</span> {form.genre || 'N/A'}</p>
                <p><span className="font-medium text-indigo-300">Tracks Count:</span> {trackFiles.length}</p>
                <p><span className="font-medium text-indigo-300">Album Art:</span> {albumArtFile ? 'Selected' : 'Missing'}</p>
            </div>

            {/* --- Submission Area --- */}
            <div className="pt-4 space-y-4">

                {(status === 'UPLOADING' || status === 'SUBMITTING') && (
                    <div className="mt-4">
                        <ProgressBar progress={uploadProgress} />
                        <p className="text-sm text-indigo-300 mt-2">{getStatusText()}</p>
                    </div>
                )}

                {isComplete && (
                    <div className="text-center bg-green-900/50 p-4 rounded-lg">
                        <p className="text-lg font-bold text-green-400">🎉 Release Submitted Successfully!</p>
                        <p className="text-sm text-green-300">It is now being processed by the backend.</p>
                    </div>
                )}

                {status === 'ERROR' && (
                    <div className="text-center bg-red-900/50 p-4 rounded-lg">
                        <p className="text-lg font-bold text-red-400">❌ Submission Failed</p>
                        <p className="text-sm text-red-300">{error}</p>
                    </div>
                )}

                <button
                    // Crucial: type="button" to prevent native form submission
                    type="button"
                    className={`w-full py-3 rounded-xl font-bold tracking-wider transition duration-300 ${isProcessing
                        ? "bg-indigo-700 text-indigo-300 cursor-not-allowed"
                        : isComplete
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 text-white shadow-xl hover:bg-indigo-500"
                        }`}
                    onClick={submitReleaseAction}
                    disabled={isProcessing || isComplete || !canSubmit}
                >
                    {getStatusText()}
                </button>
            </div>
        </div>
    );
}