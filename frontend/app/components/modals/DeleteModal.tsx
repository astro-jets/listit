import React from 'react';
import { IoAlertCircle, IoTrashBin } from 'react-icons/io5';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    itemName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, title, message, itemName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                <div className="flex flex-col items-center text-center">
                    {/* Icon Header */}
                    <div className="w-16 h-16 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center justify-center mb-6">
                        <IoAlertCircle className="text-red-500 w-10 h-10" />
                    </div>

                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">
                        {title}
                    </h2>

                    <p className="text-neutral-400 mt-4 leading-relaxed">
                        {message} <span className="text-white font-bold italic">"{itemName}"</span>?
                    </p>
                    <p className="text-red-500/80 text-xs font-bold uppercase tracking-widest mt-2">
                        This action cannot be undone.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-xl bg-neutral-800 text-white font-bold hover:bg-neutral-700 transition-colors border border-neutral-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all flex items-center justify-center shadow-lg shadow-red-600/20 active:scale-95"
                    >
                        <IoTrashBin className="mr-2" /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;