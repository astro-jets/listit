import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import { BsPlayFill, BsPauseFill, BsMusicNoteBeamed } from "react-icons/bs";
import { FaTrash, FaCheck, FaTimes, FaCamera, FaEdit } from "react-icons/fa";
import { IoPencilOutline, IoTrashBin, IoArrowBack } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import DeleteModal from "../modals/DeleteModal";
import WaveSurferPlayer from "../WaveSurferPlayer";

type Track = {
    releaseID: number;
    release_type: string;
    id: number; // maps to tracks.id
    title: string;
    genre: string;
    audio_url: string;
    artist_name: string;
    track_number: number; // maps to release_tracks.track_number
    release_title: string;
    cover_url?: string;
};

export default function ReleaseView() {
    const { id: releaseID } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);

    // Track Management States
    const [editingTrackId, setEditingTrackId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");
    const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'track' | 'release';
        id: number | null;
        name: string;
    }>({ isOpen: false, type: 'track', id: null, name: '' });

    // --- Edit & Delete State ---
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const currentRelease = tracks[selectedIndex];

    // Open modal for Track
    const confirmDeleteTrack = (trackId: number, title: string) => {
        setModalConfig({ isOpen: true, type: 'track', id: trackId, name: title });
    };

    // Open modal for Release
    const confirmDeleteRelease = () => {
        setModalConfig({
            isOpen: true,
            type: 'release',
            id: Number(releaseID),
            name: tracks[0]?.release_title || 'this release'
        });
    };

    const handleFinalDelete = async () => {
        if (!modalConfig.id) return;

        try {
            if (modalConfig.type === 'track') {
                await axios.delete(`http://localhost:3001/artist/tracks/${modalConfig.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTracks(prev => prev.filter(t => t.id !== modalConfig.id));
            } else {
                await axios.delete(`http://localhost:3001/artist/releases/${modalConfig.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                navigate("/artists/releases");
            }
        } catch (err) {
            console.error("Delete failed", err);
        } finally {
            setModalConfig({ ...modalConfig, isOpen: false });
        }
    };
    useEffect(() => {
        if (releaseID) fetchReleaseData();
    }, [releaseID]);

    const fetchReleaseData = async () => {
        try {
            const res = await axios.get<Track[]>(`http://localhost:3001/artist/releases/${releaseID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTracks(res.data);
        } catch (err) {
            console.error("Error fetching release:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- Action Handlers ---
    const handleUpdateRelease = async () => {
        try {
            await axios.patch(`http://localhost:3001/artist/releases/${currentRelease.id}`,
                { title: editTitle },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsEditing(false);
            fetchReleaseData(); // Refresh data
        } catch (err) {
            alert("Failed to update title");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('cover', file);

        try {
            await axios.put(`http://localhost:3001/artist/releases/${currentRelease.id}/cover`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchReleaseData();
        } catch (err) {
            alert("Image upload failed");
        }
    };

    const handleDeleteRelease = async () => {
        try {
            await axios.delete(`http://localhost:3001/artist/releases/${currentRelease.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsDeleteModalOpen(false);
            setSelectedIndex(0);
            fetchReleaseData();
        } catch (err) {
            alert("Delete failed");
        }
    };
    const handleUpdateTrack = async (trackId: number) => {
        try {
            // Updates metadata in the 'tracks' table
            await axios.patch(`http://localhost:3001/artist/tracks/${trackId}`,
                { title: editValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTracks(prev => prev.map(t => t.id === trackId ? { ...t, title: editValue } : t));
            setEditingTrackId(null);
        } catch (err) {
            alert("Failed to update track title.");
        }
    };


    if (loading) return <div className="p-20 text-center text-red-500 animate-pulse font-black">LOADING CATALOG...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Release Header */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">

                    {/* Cover Image with Edit Overlay */}
                    <div className="relative group shrink-0">
                        <img
                            src={tracks[0]?.cover_url || '/placeholder.png'}
                            className="w-56 h-56 rounded-2xl shadow-2xl object-cover border border-neutral-700 transition-transform group-hover:scale-[1.02]"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl text-white text-xs font-bold"
                        >
                            <FaCamera className="text-2xl mb-2" />
                            CHANGE COVER
                        </button>
                        <input type="file" ref={fileInputRef} hidden onChange={handleImageUpload} accept="image/*" />
                    </div>

                    <div className="flex-1 w-full space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1 flex-1">
                                {isEditing ? (
                                    <div className="flex items-center gap-3 mt-2">
                                        <input
                                            autoFocus
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="bg-neutral-800 border-2 border-red-600 text-3xl font-bold text-white px-4 py-1 rounded-xl outline-none w-full"
                                        />
                                        <button onClick={handleUpdateRelease} className="p-3 bg-green-600 rounded-xl text-white"><FaCheck /></button>
                                        <button onClick={() => setIsEditing(false)} className="p-3 bg-neutral-700 rounded-xl text-white"><FaTimes /></button>
                                    </div>
                                ) : (
                                    <h2 className="text-4xl font-black text-white leading-tight flex items-center gap-4">
                                        {currentRelease?.release_title}
                                        <button
                                            onClick={() => { setIsEditing(true); setEditTitle(currentRelease.release_title); }}
                                            className="text-neutral-600 hover:text-white transition-colors"
                                        >
                                            <FaEdit size={20} />
                                        </button>
                                    </h2>
                                )}
                                <p className="text-xl text-white tracking-tighter capitalize">{currentRelease?.release_type}</p>
                            </div>

                            <button
                                onClick={() => confirmDeleteRelease()}
                                className="p-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-600/20 rounded-2xl transition-all active:scale-90"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        <div className="bg-black/40 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
                            <WaveSurferPlayer
                                tracks={tracks}
                                initialIndex={selectedIndex}
                                isPlaying={isPlaying}
                                setIsPlaying={setIsPlaying}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <DeleteModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={handleFinalDelete}
                title={modalConfig.type === 'track' ? "Delete Track" : "Delete Release"}
                message={`Are you sure you want to permanently remove ${modalConfig.type === 'track' ? 'this track from the release' : 'this release and all its tracks'} `}
                itemName={modalConfig.name}
            />
            {/* Tracklist */}
            <div className="space-y-2">
                {tracks.map((track) => (
                    <div key={track.id} className="group bg-neutral-900/80 border border-neutral-800 p-4 rounded-xl flex items-center justify-between hover:border-red-600/40 transition-all">
                        <div className="flex items-center space-x-4 flex-1">
                            <span className="text-neutral-600 font-mono text-xs w-5">{track.track_number}</span>

                            {editingTrackId === track.id ? (
                                <div className="flex items-center space-x-2 flex-1">
                                    <input
                                        autoFocus
                                        className="bg-neutral-800 text-white border border-red-600 px-3 py-1 rounded-md outline-none w-full max-w-sm"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                    />
                                    <button onClick={() => handleUpdateTrack(track.id)} className="text-green-500"><FaCheck /></button>
                                    <button onClick={() => setEditingTrackId(null)} className="text-neutral-500"><FaTimes /></button>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <span className="text-white font-bold tracking-wide">{track.title}</span>
                                    <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">{track.genre}</span>
                                </div>
                            )}
                        </div>

                        {/* Control Actions */}
                        <div className="flex items-center space-x-3">
                            <TrackAction
                                icon={playingTrackId === track.id ? <BsPauseFill size={22} /> : <BsPlayFill size={22} />}
                                onClick={() => setPlayingTrackId(playingTrackId === track.id ? null : track.id)}
                                active={playingTrackId === track.id}
                                hoverColor="hover:text-red-500"
                            />
                            <TrackAction
                                icon={<IoPencilOutline size={18} />}
                                onClick={() => { setEditingTrackId(track.id); setEditValue(track.title); }}
                                hoverColor="hover:text-blue-500"
                            />
                            <TrackAction
                                icon={<FaTrash size={14} />}
                                onClick={() => confirmDeleteTrack(track.id, track.title)}
                                hoverColor="hover:text-red-500"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Sub-component for Buttons ---
const TrackAction = ({ icon, onClick, active, hoverColor }: any) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg bg-neutral-800 border border-neutral-700 transition-all active:scale-90 
        ${active ? 'text-red-500 border-red-500/50 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : 'text-neutral-400'} 
        ${hoverColor} hover:bg-neutral-700`}
    >
        {icon}
    </button>
);