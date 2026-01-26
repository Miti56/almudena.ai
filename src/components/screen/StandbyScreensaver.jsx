import React, { useState, useEffect, useMemo } from 'react';
import { FILMS } from '../../data/cameraData';

export default function StandbyScreensaver({ active }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timecode, setTimecode] = useState("00:00:00:00");

    // Cycle through films
    useEffect(() => {
        if (!active) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % FILMS.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [active]);

    // Running Timecode Effect
    useEffect(() => {
        if (!active) return;
        const tcInterval = setInterval(() => {
            const d = new Date();
            const ms = Math.floor(d.getMilliseconds() / 10).toString().padStart(2, '0');
            const s = d.getSeconds().toString().padStart(2, '0');
            const m = d.getMinutes().toString().padStart(2, '0');
            const h = d.getHours().toString().padStart(2, '0');
            setTimecode(`${h}:${m}:${s}:${ms}`);
        }, 40); // 25fps-ish update
        return () => clearInterval(tcInterval);
    }, [active]);

    // Memoize random technical values so they don't jitter uncontrollably
    const audioLevels = useMemo(() => Array.from({ length: 12 }, () => Math.random() * 100), [currentIndex]);

    return (
        <div className="absolute inset-0 bg-[#050505] overflow-hidden z-0 select-none font-mono">

            {/* --- LAYER 1: IMAGE BUFFER --- */}
            {FILMS.map((film, index) => {
                const isActive = index === currentIndex;
                return (
                    <div
                        key={film.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-linear ${isActive ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={film.src}
                                alt="standby_buffer"
                                className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out will-change-transform
                                ${isActive ? 'scale-110' : 'scale-100'} grayscale-[20%] contrast-110`}
                            />
                            {/* Cinematic Darkening */}
                            <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
                        </div>
                    </div>
                );
            })}

            {/* --- LAYER 2: GLOBAL CAMERA HUD (Static Elements) --- */}
            <div className="absolute inset-0 pointer-events-none p-4 md:p-8 flex flex-col justify-between z-10">

                {/* Top Bar: Status */}
                <div className="flex justify-between items-start text-[10px] md:text-xs tracking-widest text-red-500/90 font-bold">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
                            <span>REC</span>
                            <span className="text-white/80 ml-2 font-normal">{timecode}</span>
                        </div>
                        <div className="text-white/40 font-normal">
                            STBY {'>'} PRW
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-white/80">
                        <div className="flex items-center gap-2">
                            <span>BAT</span>
                            <div className="w-6 h-3 border border-white/40 p-[1px] flex items-center">
                                <div className="h-full w-[80%] bg-white/80"></div>
                            </div>
                            <span className="text-xs">82%</span>
                        </div>
                        <span className="text-white/40">4K UHD 24p</span>
                    </div>
                </div>

                {/* Center: Focus Brackets & Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center opacity-60">
                    {/* Center Cross */}
                    <div className="relative w-8 h-8 md:w-16 md:h-16">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/30"></div>
                        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white/30"></div>
                    </div>
                    {/* Corners */}
                    <div className="absolute w-[60%] h-[60%] border border-white/10"></div>
                    <div className="absolute w-[90%] h-[90%] border-t border-b border-white/5"></div>
                </div>

                {/* Right Side: Audio Meters (Simulated) */}
                <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex gap-1 h-32 opacity-70">
                    <div className="flex flex-col justify-end h-full gap-[2px]">
                        <span className="text-[8px] text-white/50 mb-1">L</span>
                        {audioLevels.slice(0, 6).map((val, i) => (
                            <div key={i} className="w-1 bg-white/80 transition-all duration-300" style={{ height: `${val}%` }}></div>
                        ))}
                    </div>
                    <div className="flex flex-col justify-end h-full gap-[2px]">
                        <span className="text-[8px] text-white/50 mb-1">R</span>
                        {audioLevels.slice(6, 12).map((val, i) => (
                            <div key={i} className="w-1 bg-white/80 transition-all duration-300" style={{ height: `${val}%` }}></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- LAYER 3: DYNAMIC FILE DATA (Per Image) --- */}
            {FILMS.map((film, index) => {
                const isActive = index === currentIndex;
                if (!isActive) return null;

                return (
                    <div key={film.id} className="absolute inset-0 z-20 flex flex-col justify-end p-4 md:p-8 pb-12 md:pb-12 pointer-events-none">

                        {/* Information Cluster */}
                        <div className="border-l-2 border-white/80 pl-4 animate-[slideIn_0.5s_ease-out]">
                            <div className="flex items-baseline gap-2 mb-1">
                                <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter leading-none" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                                    {film.title}
                                </h2>
                                <span className="text-[10px] text-green-400 border border-green-500/50 px-1 rounded-sm bg-green-900/20 backdrop-blur-sm">
                                    IN_FOCUS
                                </span>
                            </div>

                            {/* Technical Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-1 text-[10px] md:text-xs text-white/70 font-mono mt-2">
                                <div className="flex justify-between border-b border-white/10 pb-1">
                                    <span>ROLE</span> <span className="text-white">{film.role}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-1">
                                    <span>ISO</span> <span className="text-white">800 DUAL</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-1">
                                    <span>SHUTTER</span> <span className="text-white">180°</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-1">
                                    <span>WB</span> <span className="text-white">5600K</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-1 col-span-2">
                                    <span>FILE_ID</span> <span className="text-white tracking-widest">C00{film.id}_XH2S_LOG</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* --- LAYER 4: TEXTURE & OVERLAYS --- */}

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)] z-30 pointer-events-none"></div>

            {/* Scanlines */}
            <div className="absolute inset-0 z-40 opacity-[0.07] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

            {/* Grain */}
            <div className="absolute inset-0 z-40 opacity-[0.03] pointer-events-none animate-[grain_8s_steps(10)_infinite] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes grain {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-5%, -5%); }
                    20% { transform: translate(-10%, 5%); }
                    30% { transform: translate(5%, -10%); }
                    40% { transform: translate(-5%, 15%); }
                    50% { transform: translate(-10%, 5%); }
                    60% { transform: translate(15%, 0); }
                    70% { transform: translate(0, 10%); }
                    80% { transform: translate(-15%, 0); }
                    90% { transform: translate(10%, 5%); }
                }
            `}</style>
        </div>
    );
}