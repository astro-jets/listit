import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router';


const SignupPage = () => {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(250,204,21,1)] p-8 md:p-12 space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-black">
                        Join the <span className="bg-yellow-400 px-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Elite</span>
                    </h1>
                    <p className="mt-4 font-bold text-sm uppercase tracking-widest text-gray-500 italic">Start your collection quest today.</p>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                    {/* Full Name */}
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest">Legal Name / Business Name</label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                            <input
                                type="text"
                                placeholder="ALEX RIVER"
                                className="w-full border-2 border-black p-3 pl-10 font-bold focus:bg-yellow-50 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                            <input
                                type="email"
                                placeholder="HELLO@QUESTFIND.COM"
                                className="w-full border-2 border-black p-3 pl-10 font-bold focus:bg-yellow-50 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full border-2 border-black p-3 pl-10 font-bold focus:bg-yellow-50 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest">Repeat</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full border-2 border-black p-3 pl-10 font-bold focus:bg-yellow-50 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            />
                        </div>
                    </div>

                    {/* TOS Checkbox */}
                    <div className="md:col-span-2 flex items-start gap-3 pt-2">
                        <div className="relative flex items-center h-5">
                            <input type="checkbox" className="w-5 h-5 border-2 border-black appearance-none checked:bg-yellow-400 cursor-pointer" />
                            <FiCheck className="absolute left-0.5 text-black pointer-events-none opacity-0 checked:opacity-100" />
                        </div>
                        <p className="text-[10px] font-bold uppercase leading-tight">
                            I agree to the <a href="#" className="underline">Battle terms</a> and the <a href="#" className="underline">Privacy protocols</a>.
                        </p>
                    </div>

                    <button className="md:col-span-2 bg-black text-white py-4 font-black uppercase tracking-[0.2em] border-2 border-black shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] hover:bg-yellow-400 hover:text-black transition-all active:shadow-none active:translate-x-1 active:translate-y-1">
                        Create Mission Profile
                    </button>
                </form>

                <p className="text-center text-xs font-bold uppercase">
                    Already a member? <Link to="/login" className="border-b-2 border-black hover:bg-black hover:text-white px-1">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;