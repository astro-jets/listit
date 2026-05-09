import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiImage, FiShoppingBag, FiLoader, FiPhone, FiChevronDown } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { registerUser } from '~/services/auth.service';

// --- Production Country Data ---

const COUNTRY_DATA = [
    { code: '+265', iso: 'MW', label: 'Malawi', flag: '🇲🇼' },
    { code: '+254', iso: 'KE', label: 'Kenya', flag: '🇰🇪' },
    { code: '+255', iso: 'TZ', label: 'Tanzania', flag: '🇹🇿' },
    { code: '+260', iso: 'ZM', label: 'Zambia', flag: '🇿🇲' },
    { code: '+263', iso: 'ZW', label: 'Zimbabwe', flag: '🇿🇼' },
    { code: '+256', iso: 'UG', label: 'Uganda', flag: '🇺🇬' },
    { code: '+27', iso: 'ZA', label: 'South Africa', flag: '🇿🇦' },
    { code: '+234', iso: 'NG', label: 'Nigeria', flag: '🇳🇬' },
    { code: '+233', iso: 'GH', label: 'Ghana', flag: '🇬🇭' },
    { code: '+251', iso: 'ET', label: 'Ethiopia', flag: '🇪🇹' },
    { code: '+20', iso: 'EG', label: 'Egypt', flag: '🇪🇬' },
    { code: '+1', iso: 'US', label: 'USA', flag: '🇺🇸' },
    { code: '+1', iso: 'CA', label: 'Canada', flag: '🇨🇦' },
    { code: '+44', iso: 'GB', label: 'UK', flag: '🇬🇧' },
    { code: '+61', iso: 'AU', label: 'Australia', flag: '🇦🇺' },
    { code: '+91', iso: 'IN', label: 'India', flag: '🇮🇳' },
    { code: '+86', iso: 'CN', label: 'China', flag: '🇨🇳' },
    { code: '+971', iso: 'AE', label: 'UAE', flag: '🇦🇪' },
    { code: '+33', iso: 'FR', label: 'France', flag: '🇫🇷' },
    { code: '+49', iso: 'DE', label: 'Germany', flag: '🇩🇪' },
    { code: '+353', iso: 'IE', label: 'Ireland', flag: '🇮🇪' },
    { code: '+81', iso: 'JP', label: 'Japan', flag: '🇯🇵' },
    { code: '+244', iso: 'AO', label: 'Angola', flag: '🇦🇴' },
    { code: '+258', iso: 'MZ', label: 'Mozambique', flag: '🇲🇿' },
    { code: '+264', iso: 'NA', label: 'Namibia', flag: '🇳🇦' },
    { code: '+267', iso: 'BW', label: 'Botswana', flag: '🇧🇼' },
].sort((a, b) => a.label.localeCompare(b.label));

// --- Validation Schema ---
const signupSchema = z.object({
    username: z.string().min(3, "Username required (min 3)").max(50),
    email: z.string().email("Invalid email address"),
    country_code: z.string().min(1, "Select code"),
    phone_number: z.string()
        .min(7, "Phone number too short")
        .regex(/^\d+$/, "Digits only (no spaces or dashes)"),
    bio: z.string().min(10, "Bio is too short").max(200),
    password: z.string()
        .min(8, "Min 8 characters")
        .regex(/[A-Z]/, "Need one uppercase")
        .regex(/[0-9]/, "Need one number"),
    tos: z.boolean().refine(val => val === true, {
        message: "Terms must be accepted"
    }),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
    const navigate = useNavigate();
    const [logo, setLogo] = useState<File | null>(null);
    const [logoError, setLogoError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            tos: false,
            country_code: '+265',
            phone_number: ''
        }
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLogoError(null);
        const file = e.target.files?.[0];
        if (file) {
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
            // E.164 Formatting: +265888123456
            formData.append('phone_number', `${data.country_code}${data.phone_number}`);
            formData.append('password', data.password);
            formData.append('bio', data.bio);
            formData.append('avatar', logo);

            await registerUser(formData);
            navigate('/login', { state: { message: "Account verified. Welcome to the sector." } });
        } catch (err: any) {
            setServerError(err.response?.data?.error || "Transmission failed. Check uplink.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 text-white selection:bg-yellow-400">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.08),transparent_50%)] pointer-events-none" />

            <div className="relative w-full max-w-lg">
                <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl">

                    <div className="space-y-1">
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Initialize Account</h1>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                            Secure Gateway <span className="text-yellow-400">// LIST.IT PARTNER</span>
                        </p>
                    </div>

                    {serverError && (
                        <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 text-xs p-4 font-bold uppercase">
                            Warning: {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                        {/* USERNAME */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Identity</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    {...register('username')}
                                    className={`w-full bg-black/40 border ${errors.username ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all`}
                                    placeholder="Business or User Name"
                                />
                            </div>
                            {errors.username && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.username.message}</p>}
                        </div>

                        {/* EMAIL */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Comms Link (Email)</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    {...register('email')}
                                    className={`w-full bg-black/40 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all`}
                                    placeholder="operator@sector.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.email.message}</p>}
                        </div>

                        {/* PHONE NUMBER FIELD */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Phone Verification</label>
                            <div className="flex gap-2">
                                {/* Country Code Dropdown */}
                                <div className="relative shrink-0">
                                    <select
                                        {...register('country_code')}
                                        className="appearance-none bg-black border border-white/10 rounded-xl p-4 pr-10 text-sm font-bold focus:outline-none focus:border-yellow-400 cursor-pointer h-full"
                                    >
                                        {COUNTRY_DATA.map(c => (
                                            <option key={c.iso} value={c.code} className="bg-zinc-900">
                                                {c.flag} {c.code}
                                            </option>
                                        ))}
                                    </select>
                                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                </div>

                                {/* Phone Input */}
                                <div className="relative flex-1">
                                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        {...register('phone_number')}
                                        type="tel"
                                        className={`w-full bg-black/40 border ${errors.phone_number ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all`}
                                        placeholder="888123456"
                                    />
                                </div>
                            </div>
                            {errors.phone_number && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.phone_number.message}</p>}
                        </div>

                        {/* PROFILE IMAGE */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Auth Image (Profile)</label>
                            <label className={`group relative flex items-center gap-4 p-4 rounded-xl border border-dashed transition-all cursor-pointer ${logoError ? 'border-red-500 bg-red-500/5' : 'border-white/20 hover:border-yellow-400 hover:bg-yellow-400/5'}`}>
                                <input type="file" hidden onChange={handleLogoChange} accept="image/*" />
                                <div className="p-3 bg-black border border-white/10 rounded-lg group-hover:scale-110 transition-transform">
                                    <FiImage className={logo ? 'text-yellow-400' : 'text-zinc-500'} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold truncate">{logo ? logo.name : "Select Image File"}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase font-black">Max Payload: 5MB</p>
                                </div>
                            </label>
                            {logoError && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{logoError}</p>}
                        </div>

                        {/* BIO */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Merchant Bio</label>
                            <textarea
                                {...register('bio')}
                                rows={2}
                                className={`w-full bg-black/40 border ${errors.bio ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all resize-none`}
                                placeholder="Describe your sector operations..."
                            />
                            {errors.bio && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.bio.message}</p>}
                        </div>

                        {/* PASSWORD */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Access Key (Password)</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    {...register('password')}
                                    type="password"
                                    className={`w-full bg-black/40 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.password.message}</p>}
                        </div>

                        {/* TOS */}
                        <div className="flex items-start gap-3 p-2">
                            <input
                                type="checkbox"
                                {...register('tos')}
                                className="accent-yellow-400 mt-1 h-4 w-4 rounded border-white/10 bg-black"
                            />
                            <p className="text-zinc-500 text-[11px] font-medium leading-tight">
                                Confirm alignment with <span className="text-yellow-400 underline cursor-pointer">Protocol Terms</span> and the sector
                                <span className="text-yellow-400 underline cursor-pointer ml-1">Privacy Policy</span>.
                            </p>
                        </div>
                        {errors.tos && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.tos.message}</p>}

                        {/* SUBMIT BUTTON */}
                        <button
                            disabled={isSubmitting}
                            className="w-full bg-yellow-400 text-black py-5 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-yellow-300 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale shadow-[0px_8px_24px_rgba(250,204,21,0.2)]"
                        >
                            {isSubmitting ? (
                                <><FiLoader className="animate-spin" /> Transmitting...</>
                            ) : (
                                <>Deploy Account <FiShoppingBag /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-zinc-500 uppercase font-black tracking-widest">
                        Already synced? <Link to="/login" className="text-yellow-400 hover:underline underline-offset-4">Login Here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;