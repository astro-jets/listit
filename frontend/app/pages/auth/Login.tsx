import React, { useState } from 'react';
import { FiMail, FiLock, FiArrowRight, FiLoader } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login } from '~/services/auth.service'; //
import { useAuth } from '~/context/AuthContext';

// --- Define Validation Schema ---
const loginSchema = z.object({
    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    password: z.string()
        .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const { login: authLogin } = useAuth()
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Initialize React Hook Form ---
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });


    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        try {
            const response = await login(data.email, data.password);

            authLogin(response.token, response.user);

            navigate('/dashboard');
        } catch (err: any) {
            setServerError(err.response?.data?.error || "Invalid credentials");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4 text-black font-sans">
            <div className="w-full max-w-md bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 space-y-8">

                <div className="text-center">
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
                        Welcome <span className="block text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Back</span>
                    </h1>
                    <p className="mt-2 font-bold text-xs uppercase tracking-widest text-gray-500">Enter the command center</p>
                </div>

                {serverError && (
                    <div className="bg-red-100 border-2 border-red-500 p-3 text-[10px] font-black uppercase text-red-600 animate-bounce">
                        Error: {serverError}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Email Field */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest flex justify-between">
                            Email Address
                            {errors.email && <span className="text-red-500 lowercase">{errors.email.message}</span>}
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-black z-10" />
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="USER@EXAMPLE.COM"
                                className={`w-full border-2 border-black p-3 pl-10 font-bold placeholder:text-gray-300 focus:bg-yellow-50 outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${errors.email ? 'border-red-500' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest flex justify-between">
                            Password
                            {errors.password && <span className="text-red-500 lowercase">{errors.password.message}</span>}
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-black z-10" />
                            <input
                                {...register('password')}
                                type="password"
                                placeholder="••••••••"
                                className={`w-full border-2 border-black p-3 pl-10 font-bold placeholder:text-gray-300 focus:bg-yellow-50 outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${errors.password ? 'border-red-500' : ''}`}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="button" className="text-[10px] font-black uppercase border-b-2 border-black hover:bg-yellow-400 transition-colors">
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black text-white py-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-black shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] hover:bg-yellow-400 hover:text-black transition-all active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <><FiLoader className="animate-spin" /> Verifying...</>
                        ) : (
                            <>Authorize <FiArrowRight strokeWidth={3} /></>
                        )}
                    </button>
                </form>

                <p className="text-center text-xs font-bold uppercase">
                    New here? <Link to="/signup" className="border-b-2 border-yellow-400 hover:bg-yellow-400 px-1">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;