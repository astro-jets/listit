import React, { useCallback, useEffect, useState } from 'react';
import { FaMusic, FaCheckCircle, FaSpinner, FaPlay, FaRegDotCircle, FaCompactDisc, FaMicrophoneAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiPause, FiPlay, FiTrendingUp, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '~/context/AuthContext';
import type { IconType } from 'react-icons/lib';
import WaveSurferPlayer from '../WaveSurferPlayer';
import { Link } from 'react-router';

interface ReleaseSummary {
    id: number;
    title: string;
    featuring?: string;
    genre: string;
    cover_url: string;
    audio_url: string;
    track_number: number;
    release_title: string;
    release_date: string;
    release_type: 'single' | 'album' | 'ep';
    status: boolean;
    artist_name: string;
    plays?: number; // Added mock field for design
}

const ArtistDashboardTemplate: React.FC = () => {
    const [releases, setReleases] = useState<ReleaseSummary[]>([]);
    const { token } = useAuth();
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchReleases = async () => {
            try {
                const res = await axios.get("http://localhost:3001/artist/releases", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Adding mock play counts if backend doesn't provide them yet
                const dataWithMockStats = res.data.map((r: any) => ({
                    ...r,
                    plays: Math.floor(Math.random() * 50000) + 1200
                }));
                setReleases(dataWithMockStats);
                setLoading(false)
            } catch (err) {
                console.error(err);
            }
        };
        fetchReleases();
    }, [token]);

    // --- Pagination Logic ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = releases.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(releases.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    const handlePlayClick = useCallback((index: number) => {
        if (selectedIndex === index) {
            setIsPlaying(prev => !prev);
        } else {
            setSelectedIndex(index);
            setIsPlaying(true);
        }
    }, [selectedIndex]);

    // Statistics calculations
    const stats = {
        totalPlays: releases.reduce((acc, curr) => acc + (curr.plays || 0), 0),
        albums: releases.filter(r => r.release_type === 'album').length,
        eps: releases.filter(r => r.release_type === 'ep').length,
        singles: releases.filter(r => r.release_type === 'single').length,
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">BACKSTAGE</h1>
                    <p className="text-neutral-500 font-medium">Manage your music and track performance.</p>
                </div>
                <div className="flex gap-3">
                    <Link to={"/artists/upload"} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition-all shadow-lg shadow-red-600/20 active:scale-95">
                        Distribute New Music
                    </Link>
                </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Streams"
                    value={stats.totalPlays.toLocaleString()}
                    icon={FiTrendingUp}
                    color="text-red-500"
                    trend="+12.5% this month"
                />
                <StatCard label="Albums" value={stats.albums} icon={FaCompactDisc} color="text-blue-400" />
                <StatCard label="EPs" value={stats.eps} icon={FaRegDotCircle} color="text-purple-400" />
                <StatCard label="Singles" value={stats.singles} icon={FaMicrophoneAlt} color="text-orange-400" />
            </div>

            {/* Featured Track / Player Section */}
            {releases.length > 0 && (
                <div className="bg-linear-to-r from-neutral-900 to-neutral-800 border border-neutral-700/50 rounded-3xl p-6 shadow-2xl">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <img
                            src={releases[selectedIndex]?.cover_url || '/placeholder.png'}
                            alt="Cover"
                            className="w-48 h-48 rounded-2xl shadow-2xl object-cover border-2 border-neutral-700"
                        />
                        <div className="flex-1 w-full space-y-4">
                            <div>
                                <span className="text-red-500 text-xs font-bold uppercase tracking-widest">Now Reviewing</span>
                                <h2 className="text-3xl font-bold text-white leading-tight">{releases[selectedIndex]?.title}</h2>
                                <p className="text-neutral-400">{releases[selectedIndex]?.artist_name}</p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                <WaveSurferPlayer
                                    tracks={releases}
                                    initialIndex={selectedIndex}
                                    isPlaying={isPlaying}
                                    setIsPlaying={setIsPlaying}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Catalog Table */}
            {/* <div className="space-y-4">
                <h2 className="text-xl font-bold text-white px-2">Recent Catalog</h2>
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="grid grid-cols-12 gap-4 p-4 text-xs font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-800 bg-neutral-900/60">
                        <div className="col-span-6 md:col-span-5 px-4 text-left">Track</div>
                        <div className="hidden md:block col-span-2 text-center">Type</div>
                        <div className="hidden md:block col-span-2 text-center">Streams</div>
                        <div className="col-span-6 md:col-span-3 text-right pr-4">Status</div>
                    </div>

                    <div className="divide-y divide-neutral-800/50">
                        {releases.map((release, idx) => (
                            <div key={release.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-all group">
                                <div className="col-span-6 md:col-span-5 flex items-center space-x-4">
                                    <div className="relative shrink-0 cursor-pointer" onClick={() => handlePlayClick(idx)}>
                                        <img src={release.cover_url} className="w-12 h-12 rounded-lg object-cover group-hover:opacity-50 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                            {idx === selectedIndex && isPlaying ? <FiPause /> : <FiPlay />}
                                        </div>
                                    </div>
                                    <div className="truncate">
                                        <p className="font-bold text-white text-sm truncate">{release.title}</p>
                                        <p className="text-xs text-neutral-500 font-medium">{release.genre}</p>
                                    </div>
                                </div>

                                <div className="hidden md:block col-span-2 text-center">
                                    <span className="text-xs font-bold text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full uppercase">
                                        {release.release_type}
                                    </span>
                                </div>

                                <div className="hidden md:block col-span-2 text-center text-sm font-mono text-neutral-300">
                                    {release.plays?.toLocaleString()}
                                </div>

                                <div className="col-span-6 md:col-span-3 flex justify-end pr-2">
                                    <StatusBadge status={release.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div> */}

            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-xl font-bold text-white">Recent Catalog</h2>
                    <span className="text-xs text-neutral-500 font-mono">
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, releases.length)} of {releases.length}
                    </span>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 text-xs font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-800 bg-neutral-900/60">
                        <div className="col-span-6 md:col-span-5 px-4 text-left">Track</div>
                        <div className="hidden md:block col-span-2 text-center">Type</div>
                        <div className="hidden md:block col-span-2 text-center">Streams</div>
                        <div className="col-span-6 md:col-span-3 text-right pr-4">Status</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-neutral-800/50">
                        {currentItems.map((release) => {
                            // Find the actual index in the full releases array for the player
                            const globalIndex = releases.findIndex(r => r.id === release.id);

                            return (
                                <div key={release.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-all group">
                                    <div className="col-span-6 md:col-span-5 flex items-center space-x-4">
                                        <div className="relative shrink-0 cursor-pointer" onClick={() => handlePlayClick(globalIndex)}>
                                            <img src={release.cover_url} className="w-12 h-12 rounded-lg object-cover group-hover:opacity-50 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                                {globalIndex === selectedIndex && isPlaying ? <FiPause /> : <FiPlay />}
                                            </div>
                                        </div>
                                        <div className="truncate">
                                            <p className="font-bold text-white text-sm truncate">{release.title}</p>
                                            <p className="text-xs text-neutral-500 font-medium">{release.genre}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:block col-span-2 text-center">
                                        <span className="text-[10px] font-bold text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full uppercase italic">
                                            {release.release_type}
                                        </span>
                                    </div>
                                    <div className="hidden md:block col-span-2 text-center text-sm font-mono text-neutral-300">
                                        {release.plays?.toLocaleString()}
                                    </div>
                                    <div className="col-span-6 md:col-span-3 flex justify-end pr-2">
                                        <StatusBadge status={release.status} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    <div className="p-4 bg-neutral-900/60 border-t border-neutral-800 flex items-center justify-between">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                        >
                            <FaChevronLeft size={14} />
                        </button>

                        <div className="flex space-x-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1
                                        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                                        : "bg-neutral-800 text-neutral-500 hover:text-white"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                        >
                            <FaChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Specialized Components ---

const StatCard: React.FC<{ label: string; value: string | number; icon: any; color: string; trend?: string }> = ({ label, icon: Icon, color, value, trend }) => (
    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl hover:border-neutral-700 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 bg-neutral-800 rounded-xl ${color}`}>
                <Icon size={18} />
            </div>
            {trend && <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md">{trend}</span>}
        </div>
        <p className="text-neutral-500 text-[11px] font-bold uppercase tracking-tighter">{label}</p>
        <h3 className="text-2xl font-black text-white mt-1">{value}</h3>
    </div>
);

const StatusBadge: React.FC<{ status: boolean }> = ({ status }) => (
    <div className={`flex items-center px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${status ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
        }`}>
        {status ? <FaCheckCircle className="mr-2" /> : <FaSpinner className="mr-2 animate-spin" />}
        <span>{status ? 'Live' : 'Review'}</span>
    </div>
);

export default ArtistDashboardTemplate;