// WizardContainer.tsx

import { useState } from "react";

export default function WizardContainer({
    steps,
    onNext,
    onBack, // Added onBack for potential custom logic
}: {
    steps: React.ReactNode[];
    onNext?: (stepIndex: number) => void;
    onBack?: (stepIndex: number) => void;
}) {
    const [index, setIndex] = useState(0);

    const handleNext = () => {
        if (onNext) onNext(index);
        setIndex((i) => i + 1);
    };

    const handleBack = () => {
        if (onBack) onBack(index);
        setIndex((i) => i - 1);
    };

    const isLastStep = index === steps.length - 1;

    // Modern, dark-mode, clean UI container
    return (
        <div className="bg-gray-900 p-8 md:p-12 rounded-xl shadow-2xl max-w-4xl mx-auto my-12 text-gray-100 font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">New Release Wizard</h1>
                <p className="text-sm text-gray-500 mt-1">Step {index + 1} of {steps.length}</p>
                <div className="h-1 mt-4 bg-gray-700 rounded-full">
                    <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${(index + 1) / steps.length * 100}%` }}
                    />
                </div>
            </div>

            <div className="min-h-75 mb-8">
                {steps[index]}
            </div>

            <div className="flex justify-between mt-6 border-t border-gray-700 pt-6">
                <button
                    type="button"
                    disabled={index === 0}
                    onClick={handleBack}
                    className="flex items-center text-gray-400 hover:text-indigo-400 transition duration-150 disabled:opacity-30"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back
                </button>

                {!isLastStep && (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:bg-indigo-500 transition duration-150 disabled:opacity-30"
                    >
                        Next: {index === 0 ? "Files" : "Review"}
                        <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                )}

                {/* Submit button is handled in Step3Review */}
            </div>
        </div>
    );
}