import React, { useState, useEffect } from 'react';
import { BatteryMedium, HardDrive, Mic, Activity, Aperture, Disc, Zap, Thermometer, Layers, Focus } from 'lucide-react';
import OSDText from '../ui/OSDText';

// --- CUSTOM HOOKS FOR ANIMATION ---
const useAudioSimulation = () => {
    const [levels, setLevels] = useState(new Array(8).fill(10));

    useEffect(() => {
        const interval = setInterval(() => {
            setLevels(prev => prev.map(val => {
                const noise = (Math.random() - 0.5) * 15;
                let newVal = val + noise;
                if (newVal > 60) newVal -= 2;
                if (newVal < 10) newVal += 2;
                return Math.max(0, Math.min(100, newVal));
            }));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return levels;
};

const useHistogramSimulation = () => {
    const generateCurve = () => Array.from({ length: 40 }, (_, i) => {
        const x = i / 40;
        return 10 + 80 * Math.exp(-15 * Math.pow(x - 0.5, 2));
    });

    const [bars, setBars] = useState(generateCurve());

    useEffect(() => {
        const interval = setInterval(() => {
            setBars(prev => prev.map(h => {
                const jitter = (Math.random() - 0.5) * 5;
                return Math.max(5, Math.min(90, h + jitter));
            }));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return bars;
};

// --- SUB-COMPONENTS ---
const DataBox = ({ label, value, sub, icon: Icon, alert }) => (
    <div className={`bg-[#1a1a1a] p-2 md:p-3 border-l-2 ${alert ? 'border-red-500' : 'border-green-500'} flex flex-col justify-between overflow-hidden relative group`}>
        <div className="flex justify-between items-start z-10">
            <span className="text-[8px] md:text-[10px] text-white/40 uppercase font-bold tracking-wider flex items-center gap-1">
                {Icon && <Icon size={10} className="text-white/20" />} {label}
            </span>
        </div>
        <div className="z-10 mt-1">
            <div className={`text-white font-camera leading-none ${value.length > 5 ? 'text-sm md:text-xl' : 'text-lg md:text-3xl'}`}>{value}</div>
            {sub && <div className={`text-[9px] md:text-[10px] font-mono mt-0.5 ${alert ? 'text-red-500' : 'text-green-600'}`}>{sub}</div>}
        </div>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
);

export default function Viewfinder({ osdMode, time, formatTime }) {

    const audioLevels = useAudioSimulation();
    const histogramBars = useHistogramSimulation();

    // --- MODE 3: DASHBOARD ---
    const StatusDashboard = () => (
        <div className="absolute inset-0 z-0 flex flex-col md:flex-row p-2 md:p-8 gap-2 md:gap-8 pointer-events-none">

            {/* LEFT COLUMN: Audio */}
            <div className="flex-1 flex flex-col justify-end">
                <div className="bg-[#111]/90 backdrop-blur-md p-3 md:p-4 rounded border border-white/10 mt-auto w-40 md:w-56">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2 text-white/50 text-[8px] md:text-[10px] uppercase font-bold tracking-wider">
                            <Mic size={10} className="md:w-3 md:h-3" /> Audio (8ch)
                        </div>
                        <div className="text-green-500 text-[8px] md:text-[10px]">48k 24b</div>
                    </div>
                    <div className="space-y-1.5">
                        {audioLevels.map((level, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="text-[8px] text-white/30 w-3">{i + 1}</span>
                                <div className="flex-1 h-1 md:h-1.5 bg-zinc-800 rounded-sm overflow-hidden flex">
                                    <div
                                        className={`h-full transition-all duration-300 ease-out ${level > 85 ? 'bg-red-500' : level > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                        style={{ width: `${level}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Detailed Stats */}
            <div className="w-full md:w-1/3 flex flex-col gap-2 md:gap-4 font-camera bg-[#0a0a0a]/95 backdrop-blur-xl p-3 md:p-6 rounded border border-white/10 overflow-y-auto custom-scrollbar">

                {/* Histogram Box */}
                <div className="bg-[#111] p-2 md:p-4 rounded border border-white/10 h-24 md:h-32 flex items-end gap-1 relative overflow-hidden shrink-0">
                    <div className="absolute top-2 left-2 text-[8px] md:text-[10px] text-white/40 uppercase font-bold flex gap-2">
                        <Activity size={10} className="md:w-3 md:h-3" /> Histogram RGB
                    </div>
                    {histogramBars.map((h, i) => (
                        <div key={i} className="flex-1 bg-zinc-500 opacity-50 rounded-t-sm transition-all duration-300 ease-out"
                             style={{ height: `${h}%` }}></div>
                    ))}
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-2 gap-2 md:gap-3 shrink-0">
                    <DataBox label="Shutter" value="180.0°" sub="1/48" icon={Aperture} />
                    <DataBox label="Iris" value="T2.8" sub="1/2" icon={Focus} />
                    <DataBox label="WB" value="5600K" sub="CC +0.2" icon={Thermometer} />
                    <DataBox label="EI" value="800" sub="BASE 800" icon={Zap} />
                    <DataBox label="Lens" value="35mm" sub="Pr: 0.85m" icon={Layers} />
                    <DataBox label="ND" value="0.6" sub="2 STOPS" icon={Disc} />
                    <DataBox label="Bat A" value="14.4V" sub="OK" icon={BatteryMedium} />
                    <DataBox label="Media" value="82%" sub="01h 42m" icon={HardDrive} />
                </div>

                {/* Footer Info */}
                <div className="mt-auto border-t border-white/10 pt-2 md:pt-4 flex justify-between text-[9px] md:text-xs text-white/60">
                    <div>
                        <p>ProRes 4444 XQ</p>
                        <p>LogC4 / Wide Gamut</p>
                    </div>
                    <div className="text-right">
                        <p>TC: 14:22:10:05</p>
                        <p>23.976 FPS</p>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- MODE 0/1: STANDARD OSD ---
    const StandardOSD = () => (
        <div className="absolute inset-0 p-3 md:p-6 flex flex-col justify-between pointer-events-none">
            {/* TOP BAR */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-yellow-500/20 text-yellow-400 px-1 text-[8px] md:text-[10px] border border-yellow-500/50 rounded font-bold tracking-wider">STBY</span>
                        <OSDText className="text-[10px] md:text-sm">3840x2160</OSDText>
                        <OSDText className="text-white/70 text-[10px] md:text-sm">RAW</OSDText>
                    </div>
                    <OSDText className="text-sm md:text-xl">{formatTime(time)}</OSDText>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red] shrink-0"></div>
                        <OSDText className="text-red-500 tracking-widest text-[10px] md:text-xs">REC</OSDText>
                    </div>
                    <OSDText className="text-lg md:text-2xl font-bold">00:04:23:12</OSDText>
                    <div className="flex gap-2 md:gap-3 text-green-400 mt-1">
                        <div className="flex items-center gap-1"><BatteryMedium size={12} className="md:w-[14px] md:h-[14px]" /><span className="text-[9px] md:text-xs">14.4V</span></div>
                        <div className="flex items-center gap-1"><HardDrive size={12} className="md:w-[14px] md:h-[14px]" /><span className="text-[9px] md:text-xs">14GB</span></div>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="flex justify-between items-end bg-black/60 p-2 rounded backdrop-blur-sm border border-white/10 overflow-hidden">
                <div className="flex gap-3 md:gap-6 text-center overflow-x-auto no-scrollbar mask-linear-fade">
                    <div className="min-w-[40px]">
                        <div className="text-[8px] md:text-[9px] text-white/50 uppercase tracking-wider mb-1">Shut</div>
                        <OSDText className="text-[10px] md:text-sm">180°</OSDText>
                    </div>
                    <div className="min-w-[40px]">
                        <div className="text-[8px] md:text-[9px] text-white/50 uppercase tracking-wider mb-1">Iris</div>
                        <OSDText className="text-[10px] md:text-sm">T2.0</OSDText>
                    </div>
                    <div className="min-w-[40px]">
                        <div className="text-[8px] md:text-[9px] text-white/50 uppercase tracking-wider mb-1">ISO</div>
                        <OSDText className="text-[10px] md:text-sm">800</OSDText>
                    </div>
                    <div className="min-w-[40px]">
                        <div className="text-[8px] md:text-[9px] text-white/50 uppercase tracking-wider mb-1">WB</div>
                        <OSDText className="text-[10px] md:text-sm">5600</OSDText>
                    </div>
                </div>

                {/* Histogram Sim */}
                <div className="flex gap-px items-end h-6 md:h-8 w-16 md:w-24 opacity-80 shrink-0 ml-2">
                    {histogramBars.slice(0, 20).map((h, i) => (
                        <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-white/80 transition-all duration-300 ease-out"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    // --- GUIDES ---
    const GuideOverlay = () => (
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20"></div>
            <div className="absolute right-1/3 top-0 bottom-0 w-px bg-white/20"></div>
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20"></div>
            <div className="absolute bottom-1/3 left-0 right-0 h-px bg-white/20"></div>
            <div className="absolute inset-8 md:inset-12 border border-white/20 rounded-sm"></div>
        </div>
    );

    // --- RETICLE FIXED ---
    const ReticleOverlay = () => (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-16 md:h-16 pointer-events-none opacity-60">
            {/* Top Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-2 md:h-3 bg-white shadow-[0_0_2px_black]"></div>
            {/* Bottom Line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-2 md:h-3 bg-white shadow-[0_0_2px_black]"></div>
            {/* Left Line - FIXED: md:w-3 (length) instead of md:h-3 (thickness) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-2 md:w-3 bg-white shadow-[0_0_2px_black]"></div>
            {/* Right Line - FIXED: md:w-3 (length) instead of md:h-3 (thickness) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-px w-2 md:w-3 bg-white shadow-[0_0_2px_black]"></div>
            {/* Center Dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_4px_red]"></div>
        </div>
    );

    return (
        <div className="absolute inset-0 transition-opacity duration-300 opacity-100 font-camera">
            {osdMode === 3 && <StatusDashboard />}
            {osdMode < 2 && <StandardOSD />}
            {osdMode === 1 && <GuideOverlay />}
            {osdMode === 0 && <ReticleOverlay />}
        </div>
    );
}