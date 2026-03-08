import React from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, message }) => {


    return (
        <div className="absolute w-full h-full top-0 left-0 inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300 overflow-hidden">
            <div className="bg-neutral-900 border border-neutral-800 w-full max-w-sm rounded-2xl shadow-2xl p-8 relative overflow-hidden">

                {/* Decorative Red Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl"></div>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-green-500/10 rounded-full text-green-500 animate-bounce">
                        <FaCheckCircle size={48} />
                    </div>

                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {title || "Congratulations!"}
                    </h2>

                    <p className="text-neutral-400 leading-relaxed">
                        {message || "Your release is now live and processing. You can track its status in your dashboard."}
                    </p>

                    <button
                        onClick={() => { onClose }}
                        className="cursor-pointer w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20 active:scale-95"
                    >
                        Go to Dashboard
                    </button>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                >
                    <FaTimes size={18} />
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;