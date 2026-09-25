import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useHistogram from '../../lib/useHistogram';
import { simFor, evFor, fileNo, AUTOPLAY_MS, FOCUS_MS } from '../../lib/camera';
import { afBeep } from '../../lib/sfx';
import Timecode from '../ui/Timecode';

// ---------------------------------------------------------------------------
// Small OSD glyphs
// ---------------------------------------------------------------------------

function SimBadge({ sim }) {
    return (
        <span className="relative inline-flex items-center h-[18px] md:h-5 pl-2 pr-1.5 border border-osd/80 rounded-[3px] text-[10px] md:text-[11px] font-bold tracking-wide">
            {/* film-strip sprockets */}
            <span className="absolute left-[2px] top-[3px] bottom-[3px] w-[3px] flex flex-col justify-between">
                <span className="h-[2px] bg-osd/80" />
                <span className="h-[2px] bg-osd/80" />
                <span className="h-[2px] bg-osd/80" />
            </span>
            <span className="ml-0.5">{sim.code}</span>
        </span>
    );
}

function Battery() {
    return (
        <span className="inline-flex items-center">
            <span className="w-[22px] h-[11px] border border-osd/90 rounded-[2px] p-[1.5px] flex gap-[1.5px]">
                <span className="flex-1 bg-osd" />
                <span className="flex-1 bg-osd" />
                <span className="flex-1 bg-osd/30" />
            </span>
            <span className="w-[2px] h-[5px] bg-osd/90 rounded-r-[1px]" />
        </span>
    );
}

function CardSlots() {
    return (
        <span className="inline-flex gap-1 text-[9px] font-bold font-mono">
            <span className="px-[3px] border border-osd/90 rounded-[2px] leading-[12px]">1</span>
            <span className="px-[3px] border border-osd/40 text-osd/40 rounded-[2px] leading-[12px]">2</span>
        </span>
    );
}

function Histogram({ data }) {
    const toPath = (arr) => {
        if (!arr) return '';
        const step = 100 / (arr.length - 1);
        return `M0 40 ${arr.map((v, i) => `L${(i * step).toFixed(2)} ${(40 - v * 38).toFixed(2)}`).join(' ')} L100 40 Z`;
    };
    return (
        <div className="relative w-28 md:w-40 h-12 md:h-[70px] bg-black/45 border border-white/15 rounded-[3px] overflow-hidden backdrop-blur-[2px]">
            <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
                <span className="border-r border-white/10" />
                <span className="border-r border-white/10" />
                <span className="border-r border-white/10" />
            </div>
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                <g style={{ mixBlendMode: 'screen' }}>
                    <path d={toPath(data?.[0])} fill="rgb(255,70,70)" fillOpacity="0.7" style={{ transition: 'd 0.5s ease' }} />
                    <path d={toPath(data?.[1])} fill="rgb(70,255,120)" fillOpacity="0.7" style={{ transition: 'd 0.5s ease' }} />
                    <path d={toPath(data?.[2])} fill="rgb(80,140,255)" fillOpacity="0.7" style={{ transition: 'd 0.5s ease' }} />
                </g>
            </svg>
        </div>
    );
}

function ExposureScale({ ev }) {
    const ticks = Array.from({ length: 19 }, (_, i) => -3 + i / 3);
    const pos = ((ev + 3) / 6) * 100;
    return (
        <div className="relative w-40 md:w-64 h-7 md:h-8 select-none">
            <div className="absolute inset-x-0 top-0 flex justify-between text-[8px] md:text-[9px] font-mono font-bold leading-none">
                {['-3', '2', '1', '0', '1', '2', '+3'].map((l, i) => (
                    <span key={i} className="w-3 text-center">{l}</span>
                ))}
            </div>
            <div className="absolute inset-x-[5px] top-[12px] flex justify-between items-start">
                {ticks.map((t, i) => (
                    <span
                        key={i}
                        className={`w-px bg-osd ${Number.isInteger(Math.round(t * 1000) / 1000) ? 'h-[7px]' : 'h-[4px] opacity-70'}`}
                    />
                ))}
            </div>
            <div
                className="absolute top-[21px] -translate-x-1/2 transition-[left] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{ left: `calc(5px + (100% - 10px) * ${pos / 100})` }}
            >
                <span className="block w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-osd" />
            </div>
        </div>
    );
}

function AudioMeters() {
    const bar = (delay, dur) => (
        <span className="relative w-[5px] h-full bg-white/10 overflow-hidden rounded-[1px]">
            <span
                className="absolute inset-0 origin-bottom bg-[linear-gradient(to_top,var(--color-fuji)_0%,var(--color-fuji)_65%,var(--color-amber)_80%,var(--color-rec)_95%)]"
                style={{ animation: `meter ${dur}s ease-in-out ${delay}s infinite` }}
            />
            <span className="absolute inset-0 bg-[repeating-linear-gradient(to_top,transparent_0_3px,rgba(0,0,0,0.85)_3px_4px)]" />
        </span>
    );
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="flex gap-[3px] h-24">
                {bar(0, 1.7)}
                {bar(0.35, 1.9)}
            </div>
            <div className="flex gap-[5px] text-[8px] font-mono font-bold">
                <span>L</span>
                <span>R</span>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Viewfinder OSD
// ---------------------------------------------------------------------------

export default function Viewfinder({ film, index, total, isSelfie, videoRef, frames, autoplay, onOpen, onPrev, onNext, onFocus }) {
    const sim = simFor(film);
    const ev = isSelfie ? 0 : evFor(film);
    const histogram = useHistogram(isSelfie ? null : film.src, videoRef, isSelfie);

    // AF point, remembered per film so it resets to centre whenever the frame changes
    const [af, setAf] = useState({ x: 50, y: 50, key: 0, locked: false, filmId: film.id, selfie: isSelfie });
    const afState = af.filmId === film.id && af.selfie === isSelfie ? af : { x: 50, y: 50, key: -1, locked: false };
    const timers = useRef([]);
    const gesture = useRef(null);

    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const focusAt = (x, y) => {
        timers.current.forEach(clearTimeout);
        const key = Date.now();
        setAf({ x, y, key, locked: false, filmId: film.id, selfie: isSelfie });
        onFocus?.(x, y);
        timers.current = [
            setTimeout(() => {
                setAf((a) => (a.key === key ? { ...a, locked: true } : a));
                afBeep();
            }, FOCUS_MS),
        ];
        if (!isSelfie) timers.current.push(setTimeout(onOpen, FOCUS_MS + 370));
    };

    const onPointerDown = (e) => {
        gesture.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    };
    const onPointerUp = (e) => {
        const start = gesture.current;
        gesture.current = null;
        if (!start) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            if (!isSelfie) (dx < 0 ? onNext : onPrev)();
            return;
        }
        if (Math.hypot(dx, dy) < 12) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = Math.min(88, Math.max(12, ((e.clientX - rect.left) / rect.width) * 100));
            const y = Math.min(80, Math.max(20, ((e.clientY - rect.top) / rect.height) * 100));
            focusAt(x, y);
        }
    };

    return (
        <div className="absolute inset-0 osd font-sans select-none">
            {/* Gesture surface: tap to focus (and open), swipe to browse */}
            <div
                className="absolute inset-0 cursor-crosshair"
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerCancel={() => (gesture.current = null)}
            />

            <div className="absolute inset-0 pointer-events-none">
                {/* ---------------- TOP STATUS ROW ---------------- */}
                <div className="absolute top-0 inset-x-0 p-3 md:p-5 flex justify-between items-start text-[10px] md:text-xs font-bold tracking-wide animate-[fade_0.6s_ease-out_0.2s_both]">
                    <div className="flex items-center gap-2 md:gap-3">
                        <span className="h-[18px] md:h-5 min-w-[18px] md:min-w-5 px-1 inline-flex items-center justify-center bg-osd text-black rounded-[3px] text-[11px] md:text-xs font-[800]">
                            M
                        </span>
                        <SimBadge sim={sim} />
                        <span className="hidden sm:inline">AWB</span>
                        <span className="hidden sm:inline font-mono">4K 24P</span>
                        <span className="hidden md:inline text-osd/70">{sim.name}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-2 md:gap-3">
                            <span className="font-mono tabular">{String(frames).padStart(4, '0')}</span>
                            <CardSlots />
                            <Battery />
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[9px] md:text-[11px]">
                            {isSelfie ? (
                                <span className="flex items-center gap-1.5 text-rec">
                                    <span className="w-2 h-2 rounded-full bg-rec animate-[blink_1.1s_steps(1)_infinite]" />
                                    LIVE
                                </span>
                            ) : (
                                <span className="text-amber">STBY</span>
                            )}
                            <Timecode className="text-osd/80" />
                        </div>
                    </div>
                </div>

                {/* ---------------- ELECTRONIC LEVEL ---------------- */}
                <div className="hidden xl:flex [@media(max-height:820px)]:!hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] items-center justify-center opacity-60">
                    <div className="w-full flex items-center gap-[14%]" style={{ animation: 'level-drift 11s ease-in-out infinite' }}>
                        <span className="flex-1 h-px bg-osd shadow-[0_0_2px_black]" />
                        <span className="flex-1 h-px bg-osd shadow-[0_0_2px_black]" />
                    </div>
                    <span className="absolute w-1 h-1 rounded-full bg-fuji shadow-[0_0_4px_rgba(47,211,122,0.8)]" />
                </div>

                {/* ---------------- AF FRAME ---------------- */}
                <div
                    key={afState.key}
                    className="absolute w-14 h-14 md:w-20 md:h-20"
                    style={{
                        left: `${afState.x}%`,
                        top: `${afState.y}%`,
                        transform: 'translate(-50%, -50%)',
                        animation: afState.key > 0 ? 'af-seek 0.3s cubic-bezier(0.16,1,0.3,1) both' : undefined,
                    }}
                >
                    {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((c) => (
                        <span
                            key={c}
                            className={`absolute w-3 h-3 md:w-4 md:h-4 transition-colors duration-150 ${c} ${
                                afState.locked ? 'border-fuji drop-shadow-[0_0_4px_rgba(47,211,122,0.7)]' : 'border-osd/90'
                            }`}
                        />
                    ))}
                </div>

                {/* ---------------- AUDIO ---------------- */}
                <div className="hidden md:block absolute right-5 top-1/2 -translate-y-1/2">
                    <AudioMeters />
                </div>

                {/* ---------------- CAPTION + HISTOGRAM ---------------- */}
                <div className="absolute inset-x-0 bottom-12 md:bottom-16 px-3 md:px-5 flex items-end justify-between gap-4">
                    {isSelfie ? (
                        <div key="selfie" className="max-w-[70%] animate-[rise_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
                            <div className="font-mono text-[10px] md:text-xs text-osd/70 tracking-[0.2em] mb-1">SELF-TIMER · MIRROR</div>
                            <h2 className="text-2xl md:text-5xl font-[800] uppercase leading-[0.95]" style={{ fontStretch: '115%' }}>
                                Tu turno
                            </h2>
                            <p className="mt-2 text-xs md:text-sm text-osd/80 font-serif italic">
                                Pulsa el disparador para hacer una foto.
                            </p>
                        </div>
                    ) : (
                        <div key={film.id} className="max-w-[78%] md:max-w-[62%]">
                            <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-osd/70 tracking-[0.18em] mb-1.5 animate-[rise_0.6s_cubic-bezier(0.16,1,0.3,1)_0.05s_both]">
                                <span className="text-osd">{String(index + 1).padStart(2, '0')}</span>
                                <span>/ {String(total).padStart(2, '0')}</span>
                                <span className="w-4 h-px bg-osd/40" />
                                <span>{fileNo(film)}</span>
                            </div>
                            <h2
                                className="text-[26px] leading-[0.95] md:text-5xl xl:text-6xl font-[800] uppercase line-clamp-2 animate-[rise_0.7s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]"
                                style={{ fontStretch: '112%' }}
                            >
                                {film.title}
                            </h2>
                            <p className="mt-2 text-[11px] md:text-sm text-osd/80 animate-[rise_0.7s_cubic-bezier(0.16,1,0.3,1)_0.18s_both]">
                                <span className="font-serif italic text-[13px] md:text-lg text-osd">{film.project}</span>
                                <span className="mx-2 text-osd/40">·</span>
                                <span className="font-mono">{film.year}</span>
                                <span className="mx-2 text-osd/40">·</span>
                                <span className="uppercase tracking-wide">{film.role}</span>
                            </p>
                            <div className="mt-3 md:mt-4 flex items-center gap-2 md:gap-3 animate-[rise_0.7s_cubic-bezier(0.16,1,0.3,1)_0.26s_both]">
                                <button onClick={onPrev} aria-label="Anterior" className="pointer-events-auto w-8 h-8 md:w-9 md:h-9 rounded-full border border-osd/40 flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <ChevronLeft size={16} />
                                </button>
                                <button onClick={onNext} aria-label="Siguiente" className="pointer-events-auto w-8 h-8 md:w-9 md:h-9 rounded-full border border-osd/40 flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                            {/* autoplay progress */}
                            <div className="mt-3 md:mt-4 h-px w-40 md:w-64 bg-white/15 overflow-hidden">
                                <div
                                    className="h-full bg-osd/80 origin-left"
                                    style={{
                                        animation: `progress ${AUTOPLAY_MS}ms linear both`,
                                        animationPlayState: autoplay ? 'running' : 'paused',
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    <div className="shrink-0 hidden sm:block animate-[fade_0.6s_ease-out_0.3s_both]">
                        <Histogram data={histogram} />
                    </div>
                </div>

                {/* ---------------- EXPOSURE BAR ---------------- */}
                <div className="absolute inset-x-0 bottom-0 h-11 md:h-14 px-3 md:px-5 flex items-center justify-between bg-gradient-to-t from-black/70 to-black/0 font-bold animate-[fade_0.6s_ease-out_0.25s_both]">
                    <div className="flex items-baseline gap-3 md:gap-6">
                        <span className="font-mono text-sm md:text-lg tabular">1/48</span>
                        <span className="font-mono text-sm md:text-lg tabular">F2.0</span>
                    </div>
                    <ExposureScale ev={ev} />
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[9px] md:text-[10px] text-osd/70">ISO</span>
                        <span className="font-mono text-sm md:text-lg tabular">800</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
