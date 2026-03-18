import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiCheck, FiInfo, FiImage, FiShoppingBag, FiLoader } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { registerUser } from '~/services/auth.service'; //

// --- Define Validation Schema ---
const signupSchema = z.object({
    username: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name is too long"),
    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email format"),
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
            tos: false
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
        // Manual validation for the logo as it's not in the RHF state
        if (!logo) {
            setLogoError("Profile image is required");
            return;
        }

        setIsSubmitting(true);
        setServerError(null);

        try {
            // Using FormData for multipart/form-data as required by the service
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('bio', data.bio);
            formData.append('avatar', logo);

            await registerUser(formData); //
            alert("Account created! Please login.");
            navigate('/login');
        } catch (err: any) {
            setServerError(err.response?.data?.error || "Signup failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 text-black">
            <div className="w-full max-w-lg bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(250,204,21,1)] p-8 md:p-12 space-y-8">

                <div>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-black">
                        Join the <span className="bg-yellow-400 px-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Elite</span>
                    </h1>
                    <p className="mt-4 font-bold text-sm uppercase tracking-widest text-gray-500 italic">Start your collection quest today.</p>
                </div>

                {serverError && (
                    <div className="bg-red-100 border-2 border-red-500 p-3 text-[10px] font-black uppercase text-red-600 animate-pulse">
                        {serverError}
                    </div>
                )}

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(onFormSubmit)}>

                    {/* Full Name */}
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest flex justify-between">
                            Username / Business Name
                            {errors.username && <span className="text-red-500 lowercase">{errors.username.message}</span>}
                        </label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                            <input
                                {...register('username')}
                                type="text"
                                placeholder="ALEX RIVER"
                                className={`w-full text-black border-2 border-black p-3 pl-10 font-bold focus:bg-yellow-50 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${errors.username ? 'border-red-500 shadow-red-500' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest flex justify-between">
                            Email Address
                            {errors.email && <span className="text-red-500 lowercase">{errors.email.message}</span>}
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="HELLO@QUESTFIND.COM"
                                className={`w-full border-2 border-black p-3 pl-10 font-bold focus:bg-yellow-50 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${errors.email ? 'border-red-500 shadow-red-500' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Avatar Upload */}
                    <div className="space-y-1 text-left md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest flex justify-between">
                            Avatar Image
                            {logoError && <span className="text-red-500 lowercase">{logoError}</span>}
                        </label>
                        <label className={`p-4 border-2 border-dashed border-black bg-gray-50 flex items-center justify-center gap-4 cursor-pointer hover:bg-yellow-50 transition-colors group ${logoError ? 'border-red-500 bg-red-50' : ''}`}>
                            <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                            <div className="p-3 bg-black text-yellow-400 group-hover:scale-110 transition-transform">
                                {logo ? <FiImage size={24} /> : <FiShoppingBag size={24} />}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-black uppercase">{logo ? logo.name : "Upload your profile image"}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">PNG, JPG up to 5MB</p>
                            </div>
                        </label>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest flex justify-between">
                            Bio
                            {errors.bio && <span className="text-red-500 lowercase">{errors.bio.message}</span>}
                        </label>
                        <div className="relative">
                            <FiInfo className="absolute left-3 top-4 text-black" />
                            <textarea
                                {...register('bio')}
                                rows={3}
                                placeholder="Tell your customers a little about you..."
                                className={`w-full text-black border-2 border-black p-3 pl-10 font-bold focus:bg-yellow-50 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${errors.bio ? 'border-red-500 shadow-red-500' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest flex justify-between">
                            Password
                            {errors.password && <span className="text-red-500 lowercase">{errors.password.message}</span>}
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                            <input
                                {...register('password')}
                                type="password"
                                placeholder="••••••••"
                                className={`w-full border-2 border-black p-3 pl-10 font-bold focus:bg-yellow-50 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${errors.password ? 'border-red-500 shadow-red-500' : ''}`}
                            />
                        </div>
                    </div>

                    {/* TOS Checkbox */}
                    <div className="md:col-span-2 space-y-2">
                        <div className="flex items-start gap-3 pt-2">
                            <div className="relative flex items-center h-5">
                                <input
                                    {...register('tos')}
                                    type="checkbox"
                                    className={`peer w-5 h-5 border-2 border-black appearance-none checked:bg-yellow-400 cursor-pointer ${errors.tos ? 'border-red-500' : ''}`}
                                />
                                <FiCheck className="absolute left-0.5 text-black pointer-events-none opacity-0 peer-checked:opacity-100" />
                            </div>
                            <p className="text-[10px] font-bold uppercase leading-tight">
                                I agree to the <a href="#" className="underline">Battle terms</a> and the <a href="#" className="underline">Privacy protocols</a>.
                            </p>
                        </div>
                        {errors.tos && <p className="text-red-500 text-[10px] font-black uppercase">{errors.tos.message}</p>}
                    </div>

                    <button
                        disabled={isSubmitting}
                        className="cursor-pointer md:col-span-2 bg-black text-white py-4 font-black uppercase tracking-[0.2em] border-2 border-black shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] hover:bg-yellow-400 hover:text-black transition-all active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 flex justify-center items-center gap-3"
                    >
                        {isSubmitting ? <><FiLoader className="animate-spin" /> PROCESSING</> : "SIGN UP"}
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