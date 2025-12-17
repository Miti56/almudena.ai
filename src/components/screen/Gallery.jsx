import React, { useEffect, useRef } from 'react';
import { Grid3X3, Grid2X2 } from 'lucide-react';
import { FILMS } from '../../data/cameraData';

export default function Gallery({ galleryFocusIndex, gridMode, toggleGridMode, selectFilm }) {

    // NEW: Auto-scroll logic
    const containerRef = useRef(null);

    useEffect(() => {
        const activeElement = document.getElementById(`film-card-${galleryFocusIndex}`);
        if (activeElement && containerRef.current) {
            activeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest', // Ensures it just nudges into view without jumping wildly
            });
        }
    }, [galleryFocusIndex]);

    return (
        // Added ref={containerRef} and specific touch/scroll classes
        <div ref={containerRef} className="absolute inset-0 p-4 md:p-10 overflow-y-auto custom-scrollbar touch-pan-y">
            <div className="flex items-center justify-between mb-4 md:mb-6 border-b border-white/20 pb-2 md:pb-4 sticky top-0 bg-[#0a0a0a] z-20 pt-2">
                <h2 className="text-white font-camera text-xl md:text-2xl tracking-widest text-shadow-sm">PLAYBACK</h2>
                <div className="flex items-center gap-4">
                    <span className="text-green-500 font-mono text-[10px] hidden md:block">USE ARROWS + OK</span>
                    <button onClick={toggleGridMode} className="text-white/50 hover:text-white transition-colors">
                        {gridMode === 2 ? <Grid2X2 size={20} /> : <Grid3X3 size={20} />}
                    </button>
                </div>
            </div>

            <div className={`grid gap-3 md:gap-4 pb-12 ${gridMode === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                {FILMS.map((film, index) => (
                    <button
                        key={film.id}
                        id={`film-card-${index}`} // Added ID for scroll targeting
                        onClick={() => selectFilm(film)}
                        className={`group relative aspect-video w-full rounded border bg-zinc-900/80 text-left transition-all overflow-hidden ${galleryFocusIndex === index ? 'border-green-400 ring-2 ring-green-500/50 scale-[1.02] z-10' : 'border-white/10'}`}>

                        <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity" style={{ backgroundImage: `url(${film.src})` }}></div>
                        <div className={`absolute inset-0 bg-gradient-to-br ${film.color} opacity-40 mix-blend-multiply`}></div>

                        <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-between z-10">
                            <div className="flex justify-between items-start">
                                <span className="bg-black/70 px-2 py-0.5 rounded text-[9px] text-white font-mono border border-white/10">{film.role}</span>
                            </div>
                            <div>
                                <h3 className="text-white font-bold font-camera text-sm md:text-base group-hover:text-green-400 text-shadow truncate">{film.title}</h3>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}