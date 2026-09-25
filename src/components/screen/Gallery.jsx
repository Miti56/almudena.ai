import React, { useEffect, useRef, useState } from 'react';
import { Grid3X3, Grid2X2, ArrowLeft, Play } from 'lucide-react';
import { FILMS } from '../../data/cameraData';
import { simFor, fileNo } from '../../lib/camera';

function Thumb({ film, index, focused, onSelect, onHover }) {
    const [broken, setBroken] = useState(false);
    const sim = simFor(film);

    return (
        <button
            id={`film-card-${index}`}
            onClick={() => onSelect(film)}
            onMouseEnter={onHover}
            className="group relative text-left outline-none animate-[pop_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: `${80 + index * 55}ms` }}
        >
            <div
                className={`relative aspect-video w-full overflow-hidden rounded-[3px] bg-gradient-to-br ${film.color} transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    focused ? 'md:scale-[1.03]' : 'md:group-hover:scale-[1.015]'
                }`}
            >
                {!broken && (
                    <img
                        src={film.src}
                        alt={film.title}
                        loading="lazy"
                        draggable={false}
                        onError={() => setBroken(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-[transform,filter] duration-700 ease-out brightness-90 ${
                            focused ? 'md:scale-105 md:brightness-100' : 'md:brightness-[0.72] md:group-hover:brightness-90'
                        }`}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />

                {/* Playback info, as the camera draws it over each frame */}
                <div className="absolute inset-0 p-2.5 md:p-3 flex flex-col justify-between osd">
                    <div className="flex justify-between items-start font-mono text-[9px] md:text-[10px] font-bold">
                        <span>{fileNo(film)}</span>
                        <span className="px-1 border border-osd/60 rounded-[2px]">{sim.code}</span>
                    </div>
                    <div>
                        <h3 className="font-[800] uppercase text-sm md:text-base leading-tight line-clamp-2" style={{ fontStretch: '108%' }}>
                            {film.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 font-mono text-[9px] md:text-[10px] text-osd/70">
                            <span>{film.year}</span>
                            <span>·</span>
                            <span>{film.runtime}</span>
                            {film.url && film.url !== 'n/a' && (
                                <Play size={9} className="ml-auto text-osd" fill="currentColor" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Focus cursor (desktop only: on touch there is nothing to navigate with) */}
            <span
                className={`hidden md:block pointer-events-none absolute -inset-[5px] rounded-[5px] border-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    focused ? 'border-fuji opacity-100 scale-100 shadow-[0_0_24px_rgba(47,211,122,0.25)]' : 'border-transparent opacity-0 scale-[0.97]'
                }`}
            />
        </button>
    );
}

export default function Gallery({ galleryFocusIndex, gridMode, toggleGridMode, selectFilm, handleBack, onFocusIndex }) {
    const containerRef = useRef(null);
    const focusedFilm = galleryFocusIndex !== null ? FILMS[galleryFocusIndex] : null;

    useEffect(() => {
        if (galleryFocusIndex === null) return;
        document.getElementById(`film-card-${galleryFocusIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [galleryFocusIndex]);

    return (
        <div className="absolute inset-0 flex flex-col bg-[#0b0b0b]/80 animate-[fade_0.35s_ease-out_both]">
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-3 md:px-6 h-12 md:h-14 border-b border-white/10 bg-black/40 backdrop-blur-md osd">
                <div className="flex items-center gap-3">
                    <button onClick={handleBack} aria-label="Volver" className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <ArrowLeft size={15} />
                    </button>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-[3px] bg-osd text-black">
                        <Play size={11} fill="currentColor" />
                    </span>
                    <h2 className="font-[800] uppercase tracking-[0.2em] text-sm md:text-base" style={{ fontStretch: '115%' }}>
                        Playback
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                    <span className="hidden md:block font-mono text-[10px] text-osd/50 tracking-[0.2em]">◀ ▲ ▼ ▶ + OK</span>
                    <span className="hidden md:inline font-mono text-xs tabular text-osd/80">
                        {String((galleryFocusIndex ?? -1) + 1).padStart(2, '0')}/{String(FILMS.length).padStart(2, '0')}
                    </span>
                    <button onClick={toggleGridMode} aria-label="Cambiar cuadrícula" className="hidden md:flex text-osd/60 hover:text-osd transition-colors">
                        {gridMode === 2 ? <Grid2X2 size={18} /> : <Grid3X3 size={18} />}
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-thin px-3 md:px-6 py-4 md:py-6 touch-pan-y">
                <div className={`grid gap-4 md:gap-5 pb-4 ${gridMode === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {FILMS.map((film, index) => (
                        <Thumb
                            key={film.id}
                            film={film}
                            index={index}
                            focused={galleryFocusIndex === index}
                            onSelect={selectFilm}
                            onHover={() => onFocusIndex(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Info strip for the focused frame */}
            <div className="shrink-0 hidden md:flex items-center gap-6 h-10 px-6 border-t border-white/10 bg-black/50 backdrop-blur-md font-mono text-[10px] tracking-[0.12em] osd">
                {focusedFilm ? (
                    <>
                        <span className="text-fuji">● {fileNo(focusedFilm)}</span>
                        <span className="uppercase">{focusedFilm.project}</span>
                        <span className="uppercase text-osd/70 truncate">{focusedFilm.director}</span>
                        <span className="ml-auto">{focusedFilm.res}</span>
                        <span>{focusedFilm.size}</span>
                    </>
                ) : (
                    <span className="text-osd/50">SELECCIONA UN FOTOGRAMA</span>
                )}
            </div>
        </div>
    );
}
