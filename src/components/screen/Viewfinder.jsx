import React from 'react';
import { BatteryMedium, HardDrive, Mic, Activity } from 'lucide-react';
import OSDText from '../ui/OSDText';

export default function Viewfinder({ osdMode, time, formatTime }) {
    // --- Sub-components for clean rendering ---

    const StatusDashboard = () => (
        <div className="absolute inset-0 bg-black/90 p-8 grid grid-cols-2 gap-8 z-0">
            {/* Left Column (Video sits here) */}
            <div className="flex flex-col justify-end">
                {/* Audio Meters */}
                <div className="bg-[#111] p-4 rounded border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase font-bold tracking-wider">
                            <Mic size={12} /> Audio Levels (8ch)
                        </div>
                        <div className="text-green-500 text-[10px]">48kHz 24-bit</div>
                    </div>
                    <div className="space-y-1.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(ch => (
                            <div key={ch} className="flex items-center gap-2">
                                <span className="text-[9px] text-white/30 w-3">{ch}</span>
                                <div className="flex-1 h-1.5 bg-zinc-800 rounded-sm overflow-hidden flex">
                                    <div className={`h-full ${ch < 3 ? 'w-[75%] bg-green-500' : 'w-[0%] bg-zinc-700'}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Detailed Stats */}
            <div className="flex flex-col gap-6 font-camera">
                {/* Histogram Box */}
                <div className="bg-[#111] p-4 rounded border border-white/10 h-32 flex items-end gap-1 relative overflow-hidden">
                    <div className="absolute top-2 left-2 text-[10px] text-white/40 uppercase font-bold flex gap-2">
                        <Activity size={12} /> Histogram RGB
                    </div>
                    {/* Fake Histogram Bars */}
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className="flex-1 bg-zinc-500 opacity-50 rounded-t-sm"
                             style={{ height: `${Math.random() * 80 + 10}%` }}></div>
                    ))}
                </div>

                {/* Large Values Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1a1a1a] p-3 border-l-2 border-green-500">
                        <div className="text-[10px] text-white/40 uppercase">Shutter Angle</div>
                        <div className="text-3xl text-white">180.0°</div>
                    </div>
                    <div className="bg-[#1a1a1a] p-3 border-l-2 border-green-500">
                        <div className="text-[10px] text-white/40 uppercase">Iris</div>
                        <div className="text-3xl text-white">T2.8 1/2</div>
                    </div>
                    <div className="bg-[#1a1a1a] p-3 border-l-2 border-green-500">
                        <div className="text-[10px] text-white/40 uppercase">White Balance</div>
                        <div className="text-3xl text-white">5600K <span className="text-sm text-green-500">+2</span></div>
                    </div>
                    <div className="bg-[#1a1a1a] p-3 border-l-2 border-green-500">
                        <div className="text-[10px] text-white/40 uppercase">EI / ISO</div>
                        <div className="text-3xl text-white">800</div>
                    </div>
                </div>

                {/* Meta Info Footer */}
                <div className="mt-auto border-t border-white/10 pt-4 flex justify-between text-xs text-white/60">
                    <div>
                        <p>CODEC: ProRes 4444 XQ</p>
                        <p>COLOR: LogC4</p>
                    </div>
                    <div className="text-right">
                        <p>TC: 14:22:10:05</p>
                        <p>FPS: 24.00</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const StandardOSD = () => (
        <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="bg-yellow-500/20 text-yellow-400 px-1 text-[10px] border border-yellow-500/50 rounded font-bold tracking-wider">STBY</span>
                        <OSDText>3840x2160</OSDText>
                        <OSDText className="text-white/70">RAW</OSDText>
                    </div>
                    <OSDText className="text-xl">{formatTime(time)}</OSDText>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]"></div>
                        <OSDText className="text-red-500 tracking-widest">REC</OSDText>
                    </div>
                    <OSDText className="text-2xl font-bold">00:04:23:12</OSDText>
                    <div className="flex gap-3 text-green-400 mt-1">
                        <div className="flex items-center gap-1"><BatteryMedium size={14} /><span className="text-xs">14.4V</span></div>
                        <div className="flex items-center gap-1"><HardDrive size={14} /><span className="text-xs">14.2 GB</span></div>
                    </div>
                </div>
            </div>

            {/* Bottom OSD (Exposure) */}
            <div className="flex justify-between items-end bg-black/40 p-2 rounded backdrop-blur-sm border border-white/10">
                <div className="flex gap-6 text-center">
                    <div>
                        <div className="text-[9px] text-white/50 uppercase tracking-wider mb-1">Shutter</div>
                        <OSDText>180°</OSDText>
                    </div>
                    <div>
                        <div className="text-[9px] text-white/50 uppercase tracking-wider mb-1">Iris</div>
                        <OSDText>T2.0</OSDText>
                    </div>
                    <div>
                        <div className="text-[9px] text-white/50 uppercase tracking-wider mb-1">ISO</div>
                        <OSDText>800</OSDText>
                    </div>
                    <div>
                        <div className="text-[9px] text-white/50 uppercase tracking-wider mb-1">WB</div>
                        <OSDText>5600K</OSDText>
                    </div>
                </div>

                {/* Histogram Sim */}
                <div className="flex gap-0.5 items-end h-8 w-24 opacity-80">
                    {[40, 60, 30, 80, 50, 90, 20, 40, 70, 50, 30, 10, 5].map((h, i) => (
                        <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-white/80"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    const GuideOverlay = () => (
        <div className="absolute inset-0 pointer-events-none">
            {/* Rule of Thirds */}
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20"></div>
            <div className="absolute right-1/3 top-0 bottom-0 w-px bg-white/20"></div>
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20"></div>
            <div className="absolute bottom-1/3 left-0 right-0 h-px bg-white/20"></div>

            {/* Center Crosshair (Large) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-50">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-green-400"></div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[1px] w-full bg-green-400"></div>
            </div>

            {/* Safe Action Area (90%) */}
            <div className="absolute inset-12 border border-white/20 rounded-sm"></div>
            {/* Safe Title Area (80%) */}
            <div className="absolute inset-20 border border-white/10 border-dashed rounded-sm"></div>
        </div>
    );

    const ReticleOverlay = () => (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 pointer-events-none opacity-60">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-white shadow-[0_0_2px_black]"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-white shadow-[0_0_2px_black]"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-3 bg-white shadow-[0_0_2px_black]"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-3 bg-white shadow-[0_0_2px_black]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_4px_red]"></div>
        </div>
    );

    return (
        <div className="absolute inset-0 transition-opacity duration-300 opacity-100">
            {/* MODE 3: DASHBOARD / STATUS SCREEN */}
            {osdMode === 3 && <StatusDashboard />}

            {/* MODES 0, 1: Standard OSD Layers */}
            {osdMode < 2 && <StandardOSD />}

            {/* MODE 1: GRIDS & GUIDES */}
            {osdMode === 1 && <GuideOverlay />}

            {/* Center Reticle (Standard Mode Only) */}
            {osdMode === 0 && <ReticleOverlay />}
        </div>
    );
}