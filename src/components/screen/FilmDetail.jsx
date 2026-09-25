import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { simFor, fileNo } from '../../lib/camera';

function Spec({ label, children, wide }) {
    return (
        <div className={`py-2.5 border-b border-white/10 ${wide ? 'col-span-2' : ''}`}>
            <div className="font-mono text-[9px] tracking-[0.2em] text-white/40 uppercase mb-1">{label}</div>
            <div className="text-[13px] text-white/90">{children}</div>
        </div>
    );
}

export default function FilmDetail({ selectedFilm, handleBack }) {
    const [isPlaying, setIsPlaying] = useState(false);
    if (!selectedFilm) return null;

    const film = selectedFilm;
    const canPlay = film.url && film.url !== 'n/a';
    const sim = simFor(film);

    return (
        <div className="absolute inset-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl overflow-y-auto lg:overflow-hidden animate-[fade_0.3s_ease-out_both]">
            <div className="min-h-full lg:h-full flex flex-col lg:flex-row gap-5 lg:gap-8 p-3 md:p-6 lg:p-8">
                {/* Player */}
                <div className="w-full lg:flex-1 flex flex-col justify-center shrink-0 min-h-0 animate-[pop_0.6s_cubic-bezier(0.16,1,0.3,1)_0.05s_both]">
                    <div className="relative w-full aspect-video bg-black rounded-[3px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
                        <video
                            key={film.id}
                            src={canPlay ? film.url : undefined}
                            poster={film.src}
                            className="w-full h-full object-cover"
                            preload="metadata"
                            controls={canPlay}
                            playsInline // required for inline playback on iOS Safari
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />

                        {/* Playback OSD; fades away while the film plays. Never captures clicks. */}
                        <div className={`absolute inset-0 pointer-events-none osd transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
                            <div className="absolute top-3 inset-x-3 flex justify-between font-mono text-[10px] font-bold">
                                <span className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-[3px] bg-osd text-black">
                                        <Play size={9} fill="currentColor" />
                                    </span>
                                    {fileNo(film)}
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="px-1 border border-osd/70 rounded-[2px]">{sim.code}</span>
                                    <span>{film.res}</span>
                                </span>
                            </div>
                        </div>

                        {!canPlay && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/65">
                                <span className="font-mono text-[10px] tracking-[0.3em] text-amber">NO DATA</span>
                                <span className="text-white/50 text-xs">Vídeo no disponible</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info panel */}
                <div className="w-full lg:w-[380px] flex flex-col lg:h-full lg:overflow-hidden pb-8 lg:pb-0">
                    <div className="flex justify-between items-start gap-4 mb-5 shrink-0 animate-[rise_0.7s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]">
                        <div>
                            <div className="font-mono text-[10px] tracking-[0.25em] text-fuji mb-2">
                                {film.year} · {film.runtime.toUpperCase()}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-[800] uppercase leading-[0.95] text-white" style={{ fontStretch: '112%' }}>
                                {film.title}
                            </h1>
                            <p className="mt-2 font-serif italic text-lg text-white/70">{film.project}</p>
                        </div>
                        <button onClick={handleBack} aria-label="Cerrar" className="shrink-0 w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 lg:overflow-y-auto pr-1 scrollbar-thin space-y-6">
                        <section className="animate-[rise_0.7s_cubic-bezier(0.16,1,0.3,1)_0.18s_both]">
                            <h4 className="font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase mb-2">Sinopsis</h4>
                            <p className="text-white/90 text-[15px] leading-relaxed">{film.description}</p>
                        </section>

                        {film.description2 && (
                            <section className="animate-[rise_0.7s_cubic-bezier(0.16,1,0.3,1)_0.24s_both]">
                                <h4 className="font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase mb-2">Nota de dirección</h4>
                                <p className="font-serif italic text-white/75 text-lg leading-snug border-l border-fuji/60 pl-4">{film.description2}</p>
                            </section>
                        )}

                        <section className="grid grid-cols-2 gap-x-5 animate-[rise_0.7s_cubic-bezier(0.16,1,0.3,1)_0.3s_both]">
                            <Spec label="Dirección" wide>{film.director}</Spec>
                            <Spec label="Rol">{film.role}</Spec>
                            <Spec label="Duración"><span className="font-mono">{film.runtime}</span></Spec>
                            <Spec label="Formato"><span className="font-mono">{film.res}</span></Spec>
                            <Spec label="Simulación"><span className="font-mono">{sim.name}</span></Spec>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
