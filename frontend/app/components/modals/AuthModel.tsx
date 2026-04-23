import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthRequiredModal = ({ isOpen, onClose }: AuthModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Dark Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Box */}
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        className="relative w-full max-w-md bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute -top-4 -right-4 bg-yellow-400 border-[3px] border-black w-10 h-10 font-black text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                            X
                        </button>

                        <div className="space-y-6 text-center">
                            <div className="inline-block bg-yellow-400 border-[3px] border-black p-4 rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <span className="text-4xl">🛑</span>
                            </div>

                            <h2 className="text-3xl font-black uppercase italic leading-none tracking-tighter">
                                HALT! <br />
                                <span className="bg-black text-white px-2">Access Denied</span>
                            </h2>

                            <p className="font-bold text-lg uppercase tracking-tight text-zinc-600">
                                Please log in or sign up to perform this action.
                            </p>

                            <div className="flex flex-col gap-4 pt-4">
                                <a
                                    href="/login"
                                    className="bg-black text-white py-4 font-black uppercase tracking-widest border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                                >
                                    Join The Squad
                                </a>
                                <button
                                    onClick={onClose}
                                    className="bg-white text-black py-3 font-black uppercase tracking-tight border-[3px] border-black hover:bg-zinc-100 transition-all"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthRequiredModal;