import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import WaveSurferPlayer from "../WaveSurferPlayer";
import { FiPause, FiPlay, FiSearch } from "react-icons/fi";
import { Link } from "react-router";
import { useAuth } from "~/context/AuthContext";


interface Release {
    id: string;
    release_id: string;
    title: string;
    featuring?: string;
    genre: string;
    cover_url: string;
    audio_url: string;
    release_date: string;
    status: boolean;
    artist_name: string;
    release_title: string;
}

const ReleasesTable: React.FC = () => {
    const [releases, setReleases] = useState<Release[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1); // Use -1 for no selection initially
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const { token } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredReleases, setFilteredReleases] = useState(releases);

    const handleSearchChange = (e: any) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = releases.filter(release =>
            release.title.toLowerCase().includes(query.toLowerCase()) ||
            release.release_title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredReleases(filtered);
    };

    useEffect(() => {
        fetchReleases();
    }, []);

    const fetchReleases = async () => {
        try {
            const res = await axios.get<Release[]>("http://localhost:3001/artist/releases", { headers: { Authorization: `Bearer ${token}` } });
            setReleases(res.data);
            setFilteredReleases(res.data);
            if (res.data.length > 0) {
                // Automatically select the first track to load the player
                setSelectedIndex(0);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePlayClick = useCallback((index: number) => {
        if (selectedIndex === index) {
            // If the same track is clicked, toggle play/pause status
            setIsPlaying(prev => !prev);
        } else {
            // If a new track is clicked, select it and start playing
            setSelectedIndex(index);
            setIsPlaying(true);
        }
    }, [selectedIndex]);


    // Tailwind CSS classes for Dribbble-style dark theme
    const baseClasses = "min-h-screen text-neutral-950 ";
    const tableClasses = "w-full text-left border-collapse rounded-xl overflow-hidden shadow-2xl shadow-red-900/20";
    const headCellClasses = "px-6 py-4 text-sm font-semibold uppercase tracking-wider text-white bg-neutral-900 border-b border-netural-700";
    const dataCellClasses = "px-6 py-4 text-sm font-medium text-netural-300 border-b border-netural-800 transition duration-300 ease-in-out";
    const rowBaseClasses = "text-white hover:bg-netural-800/70";
    const rowSelectedClasses = "bg-red-900/30 border-l-2 text-white border-red-500 shadow-inner shadow-red-900/40";
    const buttonClasses = "p-2 rounded-full transition-all duration-200 ease-in-out";

    return (
        <div className="p-4">
            {/* Header */}
            <div className="w-full flex justify-center items-center mb-8">
                <div>
                    <h1 className="text-xl md:text-4xl font-black text-white mb-2 tracking-tight">YOUR <span className="text-red-600">RELEASES</span></h1>

                </div>

            </div>

            <div className="w-full flex justify-between items-center">

                <div className="flex my-4 items-center gap-2 bg-black rounded-xl px-4 py-3 border border-neutral-800 w-sm">
                    <FiSearch className="text-neutral-500" />
                    <input
                        placeholder="Search Release..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="bg-transparent outline-none text-white text-sm w-full"
                    />
                </div>


                <Link
                    to="/artists/upload"
                    className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-xl font-medium h-10"
                >
                    + New Release
                </Link>
            </div>
            <div className={baseClasses}>
                {releases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
                        <p className="mb-4">You haven’t uploaded any releases yet.</p>
                        <Link
                            to="/artists/newrelease"
                            className="underline text-red-400"
                        >
                            Create your first release
                        </Link>
                    </div>
                ) :
                    // <div className="overflow-x-auto">
                    //     <table className={tableClasses}>
                    //         <thead>
                    //             <tr>
                    //                 <th className={headCellClasses + " w-12"}>#</th>
                    //                 <th className={headCellClasses}>Cover</th>
                    //                 <th className={headCellClasses}>Title</th>
                    //                 <th className={headCellClasses}>Featuring</th>
                    //                 <th className={headCellClasses}>Genre</th>
                    //                 <th className={headCellClasses + " w-24"}>Released</th>
                    //             </tr>
                    //         </thead>
                    //         <tbody>
                    //             {releases.map((release, idx) => {
                    //                 const isSelected = idx === selectedIndex;
                    //                 const currentTrackPlaying = isSelected && isPlaying;

                    //                 return (
                    //                     <tr
                    //                         key={release.id}
                    //                         className={`${rowBaseClasses} ${isSelected ? rowSelectedClasses : 'border-netural-900'}`}
                    //                     >
                    //                         {/* Play/Pause Button Column */}
                    //                         <td className={dataCellClasses + " w-12"}>
                    //                             <button
                    //                                 onClick={(e) => {
                    //                                     e.stopPropagation(); // Prevents row selection from firing twice
                    //                                     handlePlayClick(idx);
                    //                                 }}
                    //                                 className={`${buttonClasses} ${currentTrackPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-netural-700 hover:bg-red-600'} text-white`}
                    //                             >
                    //                                 {currentTrackPlaying ? (
                    //                                     <FiPause className="w-5 h-5" />

                    //                                 ) : (
                    //                                     <FiPlay className="w-5 h-5" />

                    //                                 )}
                    //                             </button>
                    //                         </td>

                    //                         {/* Cover Art */}
                    //                         <td className={dataCellClasses}>
                    //                             <img
                    //                                 src={release.cover_url}
                    //                                 alt={release.title}
                    //                                 className="w-12 h-12 object-cover rounded-md shadow-lg shadow-netural-900/50 transition-transform duration-300 hover:scale-105"
                    //                             />
                    //                         </td>

                    //                         {/* Title & Details */}
                    //                         <td className={dataCellClasses + " font-bold text-white"}>
                    //                             {release.title}
                    //                         </td>
                    //                         <td className={dataCellClasses}>
                    //                             <span className="text-netural-400 italic">
                    //                                 {release.featuring || "—"}
                    //                             </span>
                    //                         </td>
                    //                         <td className={dataCellClasses}>
                    //                             <span className="inline-block px-3 py-1 text-xs font-semibold leading-none rounded-full bg-red-800/50 text-red-300">
                    //                                 {release.genre}
                    //                             </span>
                    //                         </td>
                    //                         <td className={dataCellClasses}>
                    //                             {new Date(release.release_date).toLocaleDateString()}
                    //                         </td>
                    //                     </tr>
                    //                 );
                    //             })}
                    //         </tbody>
                    //     </table>
                    // </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredReleases?.map((release, idx) => {
                            return (
                                <Link to={release.release_id} key={idx} className="bg-neutral-900/50 border border-neutral-700 p-1 rounded-2xl shadow-lg">
                                    <div className="flex flex-col items-center">
                                        <div className="md:w-full rounded-2xl h-50 overflow-hidden">
                                            <img src={'/img.png'} className="object-cover w-full h-full" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-thin text-white my-1">{release.title}</h3>
                                            <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">{release.artist_name}</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                }

                {/* WaveSurfer player under the table */}
                {/* {releases.length > 0 && selectedIndex !== -1 && (
                    <div className="mt-8  shadow-inner shadow-netural-700/50">
                        <WaveSurferPlayer
                            tracks={releases}
                            initialIndex={selectedIndex}
                            isPlaying={isPlaying} setIsPlaying={function (playing: boolean): void {
                                throw new Error("Function not implemented.");
                            }}
                        />
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default ReleasesTable;