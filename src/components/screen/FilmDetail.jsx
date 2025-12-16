import React from 'react';
import { Play, X, Clapperboard, CornerUpLeft } from 'lucide-react';

export default function FilmDetail({ selectedFilm, handleBack }) {
    if (!selectedFilm) return null;

    return (
        // Added overflow-y-auto for mobile scrolling, lg:overflow-hidden to lock it on desktop
        <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-md transition-all duration-300 opacity-100 z-50 overflow-y-auto lg:overflow-hidden">

            {/* Added min-h-full to ensure it fills screen, but p-4 allows scrolling content */}
            <div className="min-h-full lg:h-full flex flex-col lg:flex-row gap-6 p-4 md:p-8">

                {/* LEFT: Video Player */}
                {/* Added shrink-0 and min-h-[250px] so it never vanishes on mobile */}
                <div className="w-full lg:flex-1 flex flex-col justify-center shrink-0 min-h-[250px] lg:min-h-0">
                    <div className="relative w-full aspect-video bg-black rounded-lg border border-white/10 shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url(${selectedFilm.src})` }}></div>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Play size={64} className="text-white/90 drop-shadow-xl hover:scale-110 transition-transform cursor-pointer" fill="currentColor" />
                        </div>
                        {/* Fake Timeline */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                            <div className="w-1/3 h-full bg-green-500"></div>
                        </div>
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10">
                            RAW PREVIEW
                        </div>
                    </div>
                </div>

                {/* RIGHT: Info Panel */}
                {/* On mobile: standard div. On Desktop: fixed width with internal scroll */}
                <div className="w-full lg:w-[400px] flex flex-col lg:h-full lg:overflow-hidden pb-10 lg:pb-0">
                    <div className="flex justify-between items-start mb-6 shrink-0">
                        <div className="border-l-4 border-green-500 pl-4">
                            <h1 className="text-3xl md:text-4xl text-white font-camera uppercase leading-none mb-2 tracking-wide">{selectedFilm.title}</h1>
                            <div className="flex items-center gap-2 text-green-500 font-mono text-xs">
                                <span>{selectedFilm.year}</span>
                                <span>//</span>
                                <span className="uppercase">{selectedFilm.director}</span>
                            </div>
                        </div>
                        <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                            <X className="text-white/50 group-hover:text-white transition-colors" size={24} />
                        </button>
                    </div>

                    {/* On Desktop: overflow-y-auto. On Mobile: visible (main container scrolls) */}
                    <div className="flex-1 lg:overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent space-y-6 font-camera">

                        {/* Synopsis */}
                        <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                            <h4 className="text-white/40 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Clapperboard size={12} /> Synopsis
                            </h4>
                            <p className="text-white/90 text-sm md:text-base leading-relaxed font-sans">{selectedFilm.description}</p>
                        </div>

                        {/* Director's Note */}
                        {selectedFilm.description2 && (
                            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                <h4 className="text-white/40 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <CornerUpLeft size={12} /> Director's Note
                                </h4>
                                <p className="text-white/70 text-sm italic leading-relaxed font-serif">{selectedFilm.description2}</p>
                            </div>
                        )}

                        {/* Tech Specs Grid */}
                        <div>
                            <h4 className="text-white/40 text-[10px] uppercase tracking-widest mb-3 border-b border-white/10 pb-1">Production Specs</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-black/40 p-2 rounded border border-white/10">
                                    <span className="text-white/30 text-[9px] uppercase block mb-1">Cast</span>
                                    <span className="text-white/90 text-xs font-medium">{selectedFilm.actor}</span>
                                </div>
                                <div className="bg-black/40 p-2 rounded border border-white/10">
                                    <span className="text-white/30 text-[9px] uppercase block mb-1">Runtime</span>
                                    <span className="text-white/90 text-xs font-mono">{selectedFilm.runtime}</span>
                                </div>
                                <div className="bg-black/40 p-2 rounded border border-white/10">
                                    <span className="text-white/30 text-[9px] uppercase block mb-1">Format</span>
                                    <span className="text-white/90 text-xs font-mono">{selectedFilm.res}</span>
                                </div>
                                <div className="bg-black/40 p-2 rounded border border-white/10">
                                    <span className="text-white/30 text-[9px] uppercase block mb-1">Size</span>
                                    <span className="text-white/90 text-xs font-mono">{selectedFilm.size}</span>
                                </div>
                                <div className="bg-black/40 p-2 rounded border border-white/10 col-span-2">
                                    <span className="text-white/30 text-[9px] uppercase block mb-1">Role</span>
                                    <span className="text-green-400 text-xs font-mono uppercase">{selectedFilm.role}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}