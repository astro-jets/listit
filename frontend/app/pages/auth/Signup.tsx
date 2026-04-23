import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiCheck, FiInfo, FiImage, FiShoppingBag, FiLoader, FiPhone } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { registerUser } from '~/services/auth.service';

// --- Define Validation Schema ---
const signupSchema = z.object({
    username: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name is too long"),
    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    // New Requirement: Phone number for verification
    phone_number: z.string()
        .min(10, "Valid phone number required")
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone format (e.g. +1234567890)"),
    bio: z.string()
        .min(10, "Bio must be at least 10 characters for your profile")
        .max(200, "Bio must be under 200 characters"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Include at least one uppercase letter")
        .regex(/[0-9]/, "Include at least one number"),
    tos: z.boolean().refine(val => val === true, {
        message: "You must accept the terms to continue"
    }),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
    const navigate = useNavigate();
    const [logo, setLogo] = useState<File | null>(null);
    const [logoError, setLogoError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            tos: false,
            phone_number: ''
        }
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLogoError(null);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                setLogoError("Image must be less than 5MB");
                return;
            }
            setLogo(file);
        }
    };

    const onFormSubmit = async (data: SignupFormData) => {
        if (!logo) {
            setLogoError("Profile image is required");
            return;
        }

        setIsSubmitting(true);
        setServerError(null);

        try {
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('email', data.email);
            formData.append('phone_number', data.phone_number); // Added to payload
            formData.append('password', data.password);
            formData.append('bio', data.bio);
            formData.append('avatar', logo);

            await registerUser(formData);
            alert("Account created! Please login.");
            navigate('/login');
        } catch (err: any) {
            setServerError(err.response?.data?.error || "Signup failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.12),transparent_40%)]" />

            <div className="relative w-full max-w-lg">
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 shadow-xl">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">Create Account</h1>
                        <p className="text-sm text-zinc-400 italic font-medium uppercase tracking-tighter">
                            Verification required for all <span className="text-yellow-400">Studio X</span> partners
                        </p>
                    </div>

                    {serverError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                        {/* USERNAME */}
                        <div>
                            <label className="text-xs text-zinc-400">Username / Business</label>
                            <div className="relative mt-1">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    {...register('username')}
                                    className={`w-full bg-black/50 border border-white/10 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:border-yellow-400 ${errors.username && "border-red-500"}`}
                                    placeholder="alexriver"
                                />
                            </div>
                            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="text-xs text-zinc-400">Email</label>
                            <div className="relative mt-1">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    {...register('email')}
                                    className={`w-full bg-black/50 border border-white/10 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:border-yellow-400 ${errors.email && "border-red-500"}`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {/* PHONE NUMBER - NEW FIELD */}
                        <div>
                            <label className="text-xs text-zinc-400">Phone (for Verification)</label>
                            <div className="relative mt-1">
                                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    {...register('phone_number')}
                                    type="tel"
                                    className={`w-full bg-black/50 border border-white/10 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:border-yellow-400 ${errors.phone_number && "border-red-500"}`}
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                            {errors.phone_number && <p className="text-red-400 text-xs mt-1">{errors.phone_number.message}</p>}
                        </div>

                        {/* AVATAR */}
                        <div>
                            <label className="text-xs text-zinc-400">Profile Image</label>
                            <label className={`mt-2 flex items-center gap-4 p-4 rounded-lg border border-dashed cursor-pointer transition ${logoError ? "border-red-500 bg-red-500/10" : "border-white/10 hover:border-yellow-400"}`}>
                                <input type="file" hidden onChange={handleLogoChange} accept="image/*" />
                                <div className="p-3 bg-black border border-white/10 rounded-lg">
                                    <FiImage />
                                </div>
                                <div>
                                    <p className="text-sm">{logo ? logo.name : "Upload image"}</p>
                                    <p className="text-xs text-zinc-500 uppercase font-bold">PNG, JPG (max 5MB)</p>
                                </div>
                            </label>
                            {logoError && <p className="text-red-400 text-xs mt-1">{logoError}</p>}
                        </div>

                        {/* BIO */}
                        <div>
                            <label className="text-xs text-zinc-400">Bio</label>
                            <textarea
                                {...register('bio')}
                                rows={2}
                                className={`w-full mt-1 bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-yellow-400 ${errors.bio && "border-red-500"}`}
                                placeholder="Tell people about your craft..."
                            />
                            {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio.message}</p>}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="text-xs text-zinc-400">Password</label>
                            <div className="relative mt-1">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    {...register('password')}
                                    type="password"
                                    className={`w-full bg-black/50 border border-white/10 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:border-yellow-400 ${errors.password && "border-red-500"}`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        {/* TOS */}
                        <div className="flex items-start gap-3 text-sm pt-2">
                            <input
                                type="checkbox"
                                {...register('tos')}
                                className="accent-yellow-400 mt-1 h-4 w-4"
                            />
                            <p className="text-zinc-400 text-xs">
                                I agree to the <span className="text-yellow-400 cursor-pointer hover:underline">Terms</span> and{" "}
                                <span className="text-yellow-400 cursor-pointer hover:underline">Privacy Policy</span>
                            </p>
                        </div>
                        {errors.tos && <p className="text-red-400 text-xs">{errors.tos.message}</p>}

                        {/* BUTTON */}
                        <button
                            disabled={isSubmitting}
                            className="w-full bg-yellow-400 text-black py-4 rounded-lg font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-yellow-300 transition-colors disabled:opacity-50 mt-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] active:shadow-none active:translate-y-1"
                        >
                            {isSubmitting ? (
                                <><FiLoader className="animate-spin" /> VERIFYING...</>
                            ) : (
                                <>Sign Up <FiShoppingBag /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-zinc-400 uppercase font-bold tracking-tighter">
                        Already a member?{" "}
                        <Link to="/login" className="text-yellow-400 hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;