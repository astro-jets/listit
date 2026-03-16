import React from 'react';
import { FiMail, FiLock, FiArrowRight, FiGithub, FiTwitter } from 'react-icons/fi';
import { Link } from 'react-router';


const LoginPage = () => {
    return (
        <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 space-y-8">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
                        Welcome <span className="block text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Back</span>
                    </h1>
                    <p className="mt-2 font-bold text-xs uppercase tracking-widest text-gray-500">Enter the command center</p>
                </div>

                {/* Form */}
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                            <input
                                type="email"
                                placeholder="USER@EXAMPLE.COM"
                                className="w-full border-2 border-black p-3 pl-10 font-bold placeholder:text-gray-300 focus:bg-yellow-50 outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full border-2 border-black p-3 pl-10 font-bold placeholder:text-gray-300 focus:bg-yellow-50 outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <a href="#" className="text-[10px] font-black uppercase border-b-2 border-black hover:bg-yellow-400">Forgot Password?</a>
                    </div>

                    <button className="w-full bg-black text-white py-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-black shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] hover:bg-yellow-400 hover:text-black transition-all active:shadow-none active:translate-x-1 active:translate-y-1">
                        Authorize <FiArrowRight strokeWidth={3} />
                    </button>
                </form>

                {/* Social Logins */}
                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t-2 border-black"></span></div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase"><span className="bg-white px-2">Or connect with</span></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="border-2 border-black p-3 flex items-center justify-center gap-2 hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">
                        <FiGithub size={20} /> <span className="font-black text-xs uppercase">Github</span>
                    </button>
                    <button className="border-2 border-black p-3 flex items-center justify-center gap-2 hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">
                        <FiTwitter size={20} /> <span className="font-black text-xs uppercase">Twitter</span>
                    </button>
                </div>

                <p className="text-center text-xs font-bold uppercase">
                    New here? <Link to="/signup" className="border-b-2 border-yellow-400 hover:bg-yellow-400 px-1">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;