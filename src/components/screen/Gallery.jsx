import React from 'react';
import { Grid3X3, Grid2X2 } from 'lucide-react';
import { FILMS } from '../../data/cameraData';

export default function Gallery({ galleryFocusIndex, gridMode, toggleGridMode, selectFilm }) {
    return (
        <div className="absolute inset-0 p-6 md:p-10 overflow-y-auto transition-all duration-300 opacity-100 translate-y-0">
            <div className="flex items-center justify-between mb-6 border-b border-white/20 pb-4">
                <h2 className="text-white font-camera text-2xl tracking-widest text-shadow-sm">PLAYBACK</h2>
                <div className="flex items-center gap-4">
                    <span className="text-green-500 font-mono text-xs">USE ARROWS + OK</span>
                    <button onClick={toggleGridMode} className="text-white/50 hover:text-white transition-colors">
                        {gridMode === 2 ? <Grid2X2 size={20} /> : <Grid3X3 size={20} />}
                    </button>
                </div>
            </div>

            {/* Dynamic Grid Layout */}
            <div className={`grid gap-4 ${gridMode === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                {FILMS.map((film, index) => (
                    <button key={film.id} onClick={() => selectFilm(film)}
                            className={`group relative aspect-video w-full rounded border hover:border-green-400 bg-zinc-900/80 text-left transition-all hover:scale-[1.02] overflow-hidden ${galleryFocusIndex === index ? 'border-green-400 ring-2 ring-green-500/50 scale-[1.02]' : 'border-white/10'}`}>
                        <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity" style={{ backgroundImage: `url(${film.src})` }}></div>
                        <div className={`absolute inset-0 bg-gradient-to-br ${film.color} opacity-40 mix-blend-multiply`}></div>

                        <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                            <div className="flex justify-between items-start">
                                <span className="bg-black/70 px-2 py-0.5 rounded text-[9px] text-white font-mono border border-white/10">{film.role}</span>
                                <span className="text-[9px] text-white/60 font-mono bg-black/40 px-1 rounded">{film.size}</span>
                            </div>
                            <div>
                                <h3 className="text-white font-bold font-camera group-hover:text-green-400 text-shadow">{film.title}</h3>
                                <p className="text-white/60 text-[10px] font-mono">{film.res}</p>
                            </div>
                        </div>
                    </button>
                ))}
                {/* Empty Slots */}
                {Array.from({ length: Math.max(0, (gridMode * gridMode) - FILMS.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-video w-full rounded border border-white/5 bg-zinc-900/30 flex items-center justify-center flex-col gap-2">
                        <span className="text-white/10 font-bold tracking-widest text-xs font-mono">NO MEDIA</span>
                        <div className="w-8 h-[1px] bg-white/5"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}