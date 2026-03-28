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

            navigate('/');
        } catch (err: any) {
            setServerError(err.response?.data?.error || "Invalid credentials");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 text-white">

            {/* BACKGROUND GLOW */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.15),transparent_40%)]" />

            <div className="relative w-full max-w-md">

                {/* CARD */}
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 shadow-xl">

                    {/* HEADER */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-zinc-400">
                            Sign in to continue to <span className="text-yellow-400">List IT</span>
                        </p>
                    </div>

                    {/* ERROR */}
                    {serverError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">
                            {serverError}
                        </div>
                    )}

                    {/* FORM */}
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                        {/* EMAIL */}
                        <div>
                            <label className="text-xs text-zinc-400">Email</label>
                            <div className="relative mt-1">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="you@example.com"
                                    className={`w-full bg-black/50 border border-white/10 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:border-yellow-400 transition ${errors.email && 'border-red-500'
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="text-xs text-zinc-400">Password</label>
                            <div className="relative mt-1">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    {...register('password')}
                                    type="password"
                                    placeholder="••••••••"
                                    className={`w-full bg-black/50 border border-white/10 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:border-yellow-400 transition ${errors.password && 'border-red-500'
                                        }`}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* OPTIONS */}
                        <div className="flex justify-between items-center text-xs text-zinc-400">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-yellow-400" />
                                Remember me
                            </label>

                            <button type="button" className="hover:text-yellow-400 transition">
                                Forgot password?
                            </button>
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
                        >
                            {isSubmitting ? (
                                <>
                                    <FiLoader className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Login <FiArrowRight />
                                </>
                            )}
                        </button>
                    </form>

                    {/* FOOTER */}
                    <p className="text-center text-sm text-zinc-400">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="text-yellow-400 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );

};

export default LoginPage;