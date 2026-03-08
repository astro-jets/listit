import React, { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
// Assuming you have react-icons installed. We'll use Fa and Io icons as examples.
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoVolumeHigh, IoVolumeMute } from "react-icons/io5";

interface Release {
    id: number; // maps to tracks.id
    title: string;
    genre: string;
    audio_url: string;
    artist_name: string;
    track_number: number; // maps to release_tracks.track_number
    release_title: string;
    cover_url?: string;
}

interface WaveSurferPlayerProps {
    tracks: Release[];
    initialIndex?: number;
    // Props for external control from the table
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
}

const WaveSurferPlayer: React.FC<WaveSurferPlayerProps> = ({
    tracks,
    initialIndex = 0,
    isPlaying,
    setIsPlaying
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const waveRef = useRef<HTMLDivElement>(null);
    const waveSurferRef = useRef<WaveSurfer | null>(null);

    // Update currentIndex when initialIndex prop changes
    useEffect(() => {
        if (initialIndex !== currentIndex) {
            setCurrentIndex(initialIndex);
        }
    }, [initialIndex]);

    // Effect to handle WaveSurfer initialization and track loading
    useEffect(() => {
        if (tracks.length === 0 || currentIndex < 0) return;

        if (waveSurferRef.current) {
            waveSurferRef.current.destroy();
        }

        if (waveRef.current) {
            waveSurferRef.current = WaveSurfer.create({
                container: waveRef.current,
                // Dribbble Dark Theme Colors
                waveColor: "#e9b3b3", // Muted red/indigo for non-progressed part
                progressColor: "#ec1212", // Bright red for progress
                cursorColor: "#d8b4fe", // Light red cursor
                barWidth: 3,
                barGap: 1,
                barRadius: 3,
                height: 50,
                minPxPerSec: 1,
                interact: true,
            });

            waveSurferRef.current.load(tracks[currentIndex].audio_url);

            waveSurferRef.current.on("finish", () => {
                handleNext();
            });

            waveSurferRef.current.on("play", () => setIsPlaying(true));
            waveSurferRef.current.on("pause", () => setIsPlaying(false));

            waveSurferRef.current.on("audioprocess", () => {
                const ws = waveSurferRef.current;
                if (ws) setProgress(ws.getCurrentTime() / ws.getDuration());
            });
        }

        return () => {
            waveSurferRef.current?.destroy();
        };
    }, [currentIndex, tracks]);

    // Effect to synchronize internal player state with external control (the table)
    useEffect(() => {
        if (waveSurferRef.current) {
            if (isPlaying) {
                waveSurferRef.current.play();
            } else {
                waveSurferRef.current.pause();
            }
        }
    }, [isPlaying]);


    const handlePlayPause = useCallback(() => {
        waveSurferRef.current?.playPause();
    }, []);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => {
            const newIndex = prev === 0 ? tracks.length - 1 : prev - 1;
            if (!isPlaying) setIsPlaying(true);
            return newIndex;
        });
    }, [tracks.length, isPlaying, setIsPlaying]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => {
            const newIndex = prev === tracks.length - 1 ? 0 : prev + 1;
            if (!isPlaying) setIsPlaying(true);
            return newIndex;
        });
    }, [tracks.length, isPlaying, setIsPlaying]);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = Number(e.target.value);
        waveSurferRef.current?.setVolume(vol);
        setVolume(vol);
    };

    // Helper to format time (e.g., 0:00)
    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const currentTime = formatTime(waveSurferRef.current?.getCurrentTime() || 0);
    const duration = formatTime(waveSurferRef.current?.getDuration() || 0);

    const currentTrack = tracks[currentIndex];

    if (tracks.length === 0 || currentIndex === -1) {
        return <p className="text-gray-400 text-center py-4">Select a track to start playing.</p>;
    }

    return (
        // Wrapper container with dark theme styling
        <div className=" w-full">

            {/* Track Info and Volume Control */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div>
                        <strong className="text-white text-lg font-extrabold block truncate w-64">
                            {currentTrack.title}
                        </strong>
                        <span className="text-gray-400 text-sm">Now Playing</span>
                    </div>
                </div>

            </div>

            <div className="flex items-center space-x-2 px-2 mb-4 w-full">
                {/* Placeholder for a small cover */}
                <div className={`w-12 h-12 rounded-full overflow-hidden  transition-all duration-1000 flex items-center justify-center text-gray-500 text-xs shadow-md
                    ${isPlaying ? 'animate-spin' : ''}
                    `

                }>

                    <img className="w-full h-full object-cover" src={currentTrack.cover_url} />
                </div>
                {/* Waveform Visualization */}
                <div ref={waveRef} className=" w-3/4 overflow-hidden " />
            </div>

            {/* Controls and Timestamps */}
            <div className="flex items-center justify-between">

                {/* Current Time */}
                <div className="text-sm text-gray-400 font-mono w-10 text-left">
                    {currentTime}
                </div>

                {/* Playback Controls (Center) */}
                <div className="flex gap-4 items-center">
                    <button
                        onClick={handlePrev}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        disabled={tracks.length <= 1}
                    >
                        {/* Using FaStepBackward */}
                        <FaStepBackward className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handlePlayPause}
                        className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 ease-in-out shadow-lg 
                        bg-red-600 hover:bg-red-700 text-white shadow-red-900/50"
                    >
                        {/* Using FaPlay / FaPause */}
                        {isPlaying ? (
                            <FaPause className="w-5 h-5" />
                        ) : (
                            <FaPlay className="w-5 h-5 translate-x-px" />
                        )}
                    </button>

                    <button
                        onClick={handleNext}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        disabled={tracks.length <= 1}
                    >
                        {/* Using FaStepForward */}
                        <FaStepForward className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex space-x-4">
                    {/* Total Duration */}
                    <div className="text-sm text-gray-400 font-mono w-10 text-right">
                        {duration}
                    </div>


                    {/* Volume Control */}
                    <div className="flex items-center gap-2 text-gray-400">
                        {/* Using IoVolumeHigh or FaVolumeUp based on which library you prefer */}
                        {volume > 0 ? (
                            <IoVolumeHigh className="w-5 h-5 text-red-400" />
                        ) : (
                            <IoVolumeMute className="w-5 h-5 text-gray-500" />
                        )}
                        <input
                            id="volume"
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={handleVolumeChange}
                            className="h-1 appearance-none bg-gray-700 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default WaveSurferPlayer;