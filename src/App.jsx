import React, { useState, useEffect, useCallback } from 'react';
import {
    Play,
    Info,
    X,
    BatteryMedium,
    Wifi,
    Aperture,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
    Film,
    User,
    Settings,
    Power,
    CornerUpLeft,
    Grid3X3,
    Grid2X2,
    Activity,
    Mic,
    HardDrive,
    Clock,
    Clapperboard
} from 'lucide-react';

// --- Film Data (Based on your JSON structure) ---
const FILMS = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop",
        title: "ALAS DE PAPEL",
        description: "Martina, una niña con mucha imaginación, vive sus primeras Navidades sabiendo que Papá Noel no existe, rodeada de una familia caótica y amorosa con la que se siente incomprendida.",
        description2: "Este cortometraje es un retrato intergeneracional que pone el foco en los cuidados, y en el autocuidado. Formalmente, se explora el sostenimiento de los planos como herramienta para construir una atmósfera densa y pausada, que insinue un espacio limbo, casi onírico.",
        director: "Almudena Mirones Riotte",
        actor: "John Smith",
        year: "2025",
        runtime: "8m",
        res: "4K HEVC",
        size: "14.2 GB",
        role: "Director of Photography", // Added default role for UI
        color: "from-purple-900 to-indigo-900"
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1505673598505-51722bc28c1d?q=80&w=2070&auto=format&fit=crop",
        title: "CUÍDALAS",
        description: "Rosario(75) se siente frustrada por estar perdiendo su autonomía, y con ello su utilidad en la familia. Rosita(7) se siente dejada de lado. Y Rosa(40) no da a basto entre los cuidados de su madre, su hija y las llamadas telefónicas constantes.",
        description2: "Este cortometraje es un retrato intergeneracional que pone el foco en los cuidados, y en el autocuidado. Formalmente, se explora el sostenimiento de los planos como herramienta para construir una atmósfera densa y pausada, que insinue un espacio limbo, casi onírico.",
        director: "Almudena Mirones Riotte",
        actor: "Anna Williams",
        year: "2024",
        runtime: "7m",
        res: "1080p RAW",
        size: "8.4 GB",
        role: "Cinematographer",
        color: "from-emerald-900 to-teal-900"
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
        title: "UN CRI DANS LE VIDE",
        description: "Dos compañeros de piso y amigos, atraviesan las distintas fases del duelo tras el suicidio de uno de sus mejores amigos.",
        description2: "Este cortometraje explora una estructura capitular (negación - ira - negociación - depresión - aceptación) así como saltos bruscos de sonido, imagen o conversaciones, para tratar de recrear la angustia, la confusión y el caos vividos en estas situaciones.",
        director: "Almudena Mirones Riotte",
        actor: "N/A",
        year: "2022",
        runtime: "6m",
        res: "1080p MP4",
        size: "1.1 GB",
        role: "DOP / Editor",
        color: "from-blue-900 to-slate-900"
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2074&auto=format&fit=crop",
        title: "TAMAHINE ITI",
        description: "Experimental visual journey through the memories of childhood.",
        description2: "Shot entirely on location using natural light to evoke a sense of nostalgia and lost time.",
        director: "Almudena Mirones Riotte",
        actor: "N/A",
        year: "2023",
        runtime: "5m",
        res: "1080p MP4",
        size: "1.1 GB",
        role: "Director",
        color: "from-orange-900 to-red-900"
    }
];

const SKILLS = [
    "Cinematography", "Color Grading", "Lighting Design", "Directing", "Editing (Premiere/Resolve)"
];

const EXPERIENCE = [
    { year: "2024", role: "Freelance DOP", company: "Global Studios" },
    { year: "2022", role: "Camera Operator", company: "Indie Feature 'Dust'" },
    { year: "2020", role: "Focus Puller", company: "TV Series 'The Shift'" },
];

export default function CameraPortfolio() {
    const [view, setView] = useState('viewfinder'); // viewfinder, gallery, info, detail
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [time, setTime] = useState(new Date());
    const [isRecording, setIsRecording] = useState(true);
    const [activeButton, setActiveButton] = useState(null);
    const [bootSequence, setBootSequence] = useState(true);
    const [powerOn, setPowerOn] = useState(true);

    // Navigation State
    // 0: Standard, 1: Grids/Safe, 2: Clean, 3: Status Dashboard
    const [osdMode, setOsdMode] = useState(0);
    const [galleryFocusIndex, setGalleryFocusIndex] = useState(0);
    const [gridMode, setGridMode] = useState(2); // 2 for 2x2, 3 for 3x3

    // Clock Effect
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Boot Sequence Effect
    useEffect(() => {
        if (powerOn) {
            setBootSequence(true);
            const timer = setTimeout(() => setBootSequence(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [powerOn]);

    // Format Time
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const togglePower = () => {
        setPowerOn(!powerOn);
        if (powerOn) setIsRecording(false);
        else setIsRecording(true);
    };

    // --- Navigation Logic ---

    const handlePress = useCallback((btnName, action) => {
        if (!powerOn && btnName !== 'power') return;
        setActiveButton(btnName);
        setTimeout(() => setActiveButton(null), 150);
        if (action) action();
    }, [powerOn]);

    const toggleGallery = () => {
        if (view === 'gallery' || view === 'detail') {
            setView('viewfinder');
            setSelectedFilm(null);
        } else {
            setView('gallery');
            setGalleryFocusIndex(0);
        }
    };

    const toggleInfo = () => {
        if (view === 'info') {
            setView('viewfinder');
        } else {
            setView('info');
        }
    };

    // DISP/BACK Button Logic
    const handleDispBack = () => {
        if (view === 'viewfinder') {
            // Cycle OSD modes: Standard -> Grids -> Clean -> Status Dashboard
            setOsdMode((prev) => (prev + 1) % 4);
        } else if (view === 'detail') {
            // Go back to Gallery
            setView('gallery');
            setSelectedFilm(null);
        } else {
            // Go back to Viewfinder (from Gallery or Info)
            setView('viewfinder');
            setSelectedFilm(null);
        }
    };

    const toggleGridMode = () => {
        setGridMode(prev => prev === 2 ? 3 : 2);
    };

    // D-Pad Navigation Logic
    const handleDirection = (dir) => {
        if (view === 'gallery') {
            const cols = gridMode;
            const capacity = gridMode * gridMode;
            const totalItems = Math.min(FILMS.length, capacity); // Constrain focus to visible items if strictly paginated, or just FILMS length

            if (dir === 'left') setGalleryFocusIndex(prev => Math.max(0, prev - 1));
            if (dir === 'right') setGalleryFocusIndex(prev => Math.min(FILMS.length - 1, prev + 1));
            if (dir === 'down') setGalleryFocusIndex(prev => Math.min(FILMS.length - 1, prev + cols));
            if (dir === 'up') setGalleryFocusIndex(prev => Math.max(0, prev - cols));
        }
    };

    const handleOk = () => {
        if (view === 'gallery') {
            setSelectedFilm(FILMS[galleryFocusIndex]);
            setView('detail');
        } else if (view === 'viewfinder') {
            // Could open a quick menu in future
        }
    };

    const selectFilm = (film) => {
        setSelectedFilm(film);
        setView('detail');
    };

    // --- Reusable Skeumorphic Components ---

    const Screw = ({ className }) => (
        <div className={`w-3 h-3 rounded-full bg-zinc-800 shadow-[inset_0_1px_2px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center ${className}`}>
            <div className="w-full h-[1px] bg-zinc-900 rotate-45 shadow-[0_1px_0_rgba(255,255,255,0.2)]"></div>
            <div className="absolute w-full h-[1px] bg-zinc-900 -rotate-45 shadow-[0_1px_0_rgba(255,255,255,0.2)]"></div>
        </div>
    );

    const RoundButton = ({ icon: Icon, label, onClick, active, name, size = "md", danger = false }) => {
        const sizeClasses = size === "lg" ? "w-14 h-14" : "w-10 h-10";
        const isActive = activeButton === name;

        return (
            <div className="flex flex-col items-center gap-2">
                <button
                    onClick={onClick}
                    className={`
            relative rounded-full transition-all duration-75 ease-out
            ${sizeClasses}
            ${isActive ? 'scale-95 translate-y-[1px]' : 'hover:-translate-y-[1px]'}
            shadow-[0_4px_6px_rgba(0,0,0,0.6),0_1px_1px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)]
            active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]
            group
          `}
                    style={{
                        background: danger
                            ? 'radial-gradient(circle at 30% 30%, #dc2626, #7f1d1d)'
                            : 'radial-gradient(circle at 30% 30%, #3f3f46, #18181b)',
                    }}
                >
                    {/* Metal Ring Highlight */}
                    <div className="absolute inset-0 rounded-full border border-white/10 opacity-50"></div>
                    {/* Inner Convex Shine */}
                    <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                    <div className="flex items-center justify-center h-full w-full relative z-10">
                        {Icon && <Icon size={size === "lg" ? 20 : 16} className={`${active ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'text-zinc-400'} ${isActive ? 'opacity-80' : ''}`} />}
                    </div>
                </button>
                {label && <span className="text-[9px] font-sans font-bold tracking-widest text-zinc-500 uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{label}</span>}
            </div>
        );
    };

    const OSDText = ({ children, className = "" }) => (
        <span className={`font-mono text-xs md:text-sm text-green-400 drop-shadow-[0_2px_0_rgba(0,0,0,0.8)] ${className}`}>
      {children}
    </span>
    );

    return (
        <div className="h-screen w-full bg-[#121212] font-sans overflow-hidden select-none">
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
          .font-camera { font-family: 'Share Tech Mono', monospace; }
          
          .texture-body {
            background-color: #1a1a1a;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
          }
          .texture-leather {
            background-color: #0f0f0f;
            background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
          }
          .scanline {
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.3));
            background-size: 100% 3px;
          }
          .screen-pixel {
             background-image: radial-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.4) 100%);
             background-size: 3px 3px;
          }
        `}
            </style>

            {/* --- CAMERA BODY (FULL SCREEN) --- */}
            <div className="relative w-full h-full texture-body flex flex-col md:flex-row overflow-hidden">

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/60 pointer-events-none"></div>

                {/* --- LEFT SIDE: MONITOR --- */}
                <div className="flex-1 relative p-4 md:p-8 flex flex-col items-center justify-center z-10">

                    {/* Bezel Container */}
                    <div className="relative w-full h-full bg-[#0a0a0a] rounded-lg shadow-[inset_0_0_20px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.1)] p-2 border-t border-white/5 border-b border-black flex flex-col">

                        {/* Top Bezel (Thin) */}
                        <div className="h-2 w-full bg-black mb-1 rounded-t-sm"></div>

                        {/* --- LCD SCREEN ITSELF --- */}
                        <div className={`relative flex-1 w-full bg-black overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,1)] transition-opacity duration-500 ${!powerOn ? 'opacity-10' : 'opacity-100'} rounded-sm`}>

                            {/* Boot Sequence */}
                            {powerOn && bootSequence && (
                                <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
                                    <div className="text-green-500 font-camera text-sm mb-4 animate-pulse">INITIALIZING SENSOR...</div>
                                    <div className="w-48 h-1 bg-zinc-800 rounded overflow-hidden">
                                        <div className="h-full bg-green-500 animate-[width_2s_ease-out_forwards]" style={{width: '0%'}}></div>
                                    </div>
                                </div>
                            )}

                            {/* Main Content: Dynamic Video Feed Container */}
                            <video
                                className={`absolute transition-all duration-500 ease-in-out object-cover border-zinc-800
                       ${view !== 'viewfinder'
                                    ? 'blur-md scale-105 brightness-[0.25] inset-0 w-full h-full'
                                    : osdMode === 3
                                        ? 'top-8 left-8 w-[35%] aspect-video border border-white/20 shadow-2xl z-10 rounded-sm'
                                        : 'inset-0 scale-100 border-0 w-full h-full'
                                }`}
                                src="previews/videoTest.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />

                            {/* Screen Effects (Only on full screen mode) */}
                            {osdMode !== 3 && (
                                <>
                                    <div className="absolute inset-0 scanline pointer-events-none opacity-20"></div>
                                    <div className="absolute inset-0 screen-pixel pointer-events-none opacity-30"></div>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
                                </>
                            )}

                            {/* === UI LAYERS (The OSD) === */}
                            {powerOn && !bootSequence && (
                                <>
                                    {/* 1. Viewfinder Layer */}
                                    <div className={`absolute inset-0 p-4 md:p-6 flex flex-col justify-between transition-opacity duration-300 ${view === 'viewfinder' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

                                        {/* MODE 3: DASHBOARD / STATUS SCREEN */}
                                        {osdMode === 3 && (
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
                                                            {[1,2,3,4,5,6,7,8].map(ch => (
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
                                                        {Array.from({length: 40}).map((_, i) => (
                                                            <div key={i} className="flex-1 bg-zinc-500 opacity-50 rounded-t-sm"
                                                                 style={{height: `${Math.random() * 80 + 10}%`}}></div>
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
                                        )}

                                        {/* MODES 0, 1: Standard OSD Layers */}
                                        {osdMode < 2 && (
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
                                                            <div className="flex items-center gap-1"><BatteryMedium size={14}/><span className="text-xs">14.4V</span></div>
                                                            <div className="flex items-center gap-1"><HardDrive size={14}/><span className="text-xs">14.2 GB</span></div>
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
                                                            <div key={i} style={{height: `${h}%`}} className="flex-1 bg-white/80"></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* MODE 1: GRIDS & GUIDES */}
                                        {osdMode === 1 && (
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
                                        )}

                                        {/* Center Reticle (Standard Mode Only) */}
                                        {osdMode === 0 && (
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 pointer-events-none opacity-60">
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-white shadow-[0_0_2px_black]"></div>
                                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-white shadow-[0_0_2px_black]"></div>
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-3 bg-white shadow-[0_0_2px_black]"></div>
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-3 bg-white shadow-[0_0_2px_black]"></div>
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_4px_red]"></div>
                                            </div>
                                        )}

                                    </div>

                                    {/* 2. Gallery Layer */}
                                    <div className={`absolute inset-0 p-6 md:p-10 overflow-y-auto transition-all duration-300 ${view === 'gallery' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
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
                                                    <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity" style={{backgroundImage: `url(${film.src})`}}></div>
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

                                    {/* 3. Detail Layer */}
                                    <div className={`absolute inset-0 bg-zinc-950/95 backdrop-blur-md p-4 md:p-8 transition-all duration-300 ${view === 'detail' ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none'}`}>
                                        {selectedFilm && (
                                            <div className="h-full flex flex-col lg:flex-row gap-6">
                                                {/* LEFT: Video Player (Takes maximum remaining space) */}
                                                <div className="flex-1 flex flex-col min-h-0 min-w-0 justify-center">
                                                    <div className="relative w-full h-auto max-h-full aspect-video bg-black rounded-lg border border-white/10 shadow-2xl overflow-hidden group">
                                                        <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{backgroundImage: `url(${selectedFilm.src})`}}></div>
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

                                                {/* RIGHT: Info Panel (Scrollable, readable width) */}
                                                <div className="w-full lg:w-[400px] flex flex-col h-full overflow-hidden">
                                                    <div className="flex justify-between items-start mb-6 shrink-0">
                                                        <div className="border-l-4 border-green-500 pl-4">
                                                            <h1 className="text-3xl md:text-4xl text-white font-camera uppercase leading-none mb-2 tracking-wide">{selectedFilm.title}</h1>
                                                            <div className="flex items-center gap-2 text-green-500 font-mono text-xs">
                                                                <span>{selectedFilm.year}</span>
                                                                <span>//</span>
                                                                <span className="uppercase">{selectedFilm.director}</span>
                                                            </div>
                                                        </div>
                                                        <button onClick={handleDispBack} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                                                            <X className="text-white/50 group-hover:text-white transition-colors" size={24} />
                                                        </button>
                                                    </div>

                                                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent space-y-6 font-camera">

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
                                        )}
                                    </div>

                                    {/* 4. Info Layer */}
                                    <div className={`absolute inset-0 bg-[#111] z-40 transition-transform duration-300 ${view === 'info' ? 'translate-x-0' : 'translate-x-full'}`}>
                                        <div className="bg-[#222] p-3 border-b border-black flex justify-between items-center shadow-lg">
                                            <span className="text-white/70 font-camera text-sm">SYSTEM STATUS</span>
                                            <button onClick={handleDispBack} className="text-xs bg-black/50 text-white px-2 py-1 rounded border border-white/10">BACK</button>
                                        </div>
                                        <div className="p-8 font-camera">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-16 h-16 rounded bg-zinc-800 border border-green-500/50 flex items-center justify-center text-green-500">
                                                    <User size={32} />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl text-white font-bold">OPERATOR: JOHN DOE</h2>
                                                    <p className="text-xs text-zinc-500">ID: CAM-OP-8821</p>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-green-500 text-xs uppercase mb-2">Capabilities</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {SKILLS.map(s => <span key={s} className="bg-zinc-800 text-white/70 text-[10px] px-2 py-1 rounded border border-white/5">{s}</span>)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-green-500 text-xs uppercase mb-2">Previous Assignments</h3>
                                                    {EXPERIENCE.map((e, i) => (
                                                        <div key={i} className="flex justify-between text-xs py-2 border-b border-white/5 text-zinc-400">
                                                            <span>{e.role} @ {e.company}</span>
                                                            <span>{e.year}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Glass Reflection Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-sm z-50"></div>
                        </div>

                        {/* Bottom Chin Bezel (For Branding) */}
                        <div className="h-8 w-full bg-[#0a0a0a] flex items-center justify-center rounded-b-sm border-t border-white/5 z-20">
                            <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 drop-shadow-[0_1px_0_rgba(0,0,0,1)]">CINEMA MONITOR // 8K</span>
                        </div>

                    </div>

                    {/* Decorative Screws on Front */}
                    <Screw className="absolute top-3 left-3" />
                    <Screw className="absolute top-3 right-3" />
                    <Screw className="absolute bottom-3 left-3" />
                    <Screw className="absolute bottom-3 right-3" />

                    {/* INTERNAL REC LIGHT */}
                    {powerOn && (
                        <div className={`absolute top-6 right-6 z-30 flex items-center gap-2 transition-opacity duration-300 ${isRecording ? 'opacity-100' : 'opacity-20'}`}>
                            <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,1)] animate-pulse border border-black/50"></div>
                        </div>
                    )}

                </div>

                {/* --- RIGHT SIDE: PHYSICAL CONTROLS & GRIP --- */}
                <div className="relative w-full md:w-80 bg-[#151515] flex md:flex-col items-center p-6 md:py-10 md:px-6 gap-6 md:gap-8 shadow-[-10px_0_20px_rgba(0,0,0,0.5)] z-20 md:border-l border-black">

                    {/* Rubber Texture Overlay for Grip Area */}
                    <div className="absolute inset-0 texture-leather opacity-80 pointer-events-none md:rounded-r-none"></div>

                    {/* Shadow Gradient to separate body from grip */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/80 to-transparent pointer-events-none"></div>

                    {/* --- TOP DIAL CLUSTER --- */}
                    <div className="hidden md:flex flex-col items-center w-full relative z-10 mb-2">
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#111] shadow-[0_5px_10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-[#000] flex items-center justify-center transform hover:rotate-12 transition-transform cursor-pointer">
                            {/* Grooves */}
                            <div className="absolute inset-0 rounded-full opacity-30" style={{background: 'conic-gradient(from 0deg, transparent 0deg 2deg, black 2deg 4deg) repeating-conic-gradient(from 0deg, transparent 0deg 2deg, black 2deg 4deg)'}}></div>
                            {/* Inner Cap */}
                            <div className="w-16 h-16 rounded-full bg-[#1a1a1a] shadow-[0_-1px_1px_rgba(255,255,255,0.1),inset_0_2px_5px_rgba(0,0,0,0.8)] flex items-center justify-center">
                                <div className="w-1 h-6 bg-red-600 rounded-full shadow-[0_0_5px_rgba(220,38,38,0.5)]"></div>
                            </div>
                        </div>
                        <span className="mt-3 text-[9px] font-sans font-bold text-zinc-600 tracking-widest uppercase text-shadow-sm">Multi-Function</span>
                    </div>

                    {/* --- D-PAD NAVIGATION --- */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative w-36 h-36 rounded-full bg-[#181818] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] flex items-center justify-center p-1 border border-black/50">
                            {/* Background Concave */}
                            <div className="absolute inset-2 rounded-full bg-gradient-to-b from-black to-[#222] shadow-inner"></div>

                            {/* Directional Buttons */}
                            <button onClick={() => { handlePress('up'); handleDirection('up'); }}
                                    className={`absolute top-3 p-2 text-zinc-500 hover:text-white transition-colors active:scale-95 active:text-green-500 ${activeButton==='up'?'text-green-500 scale-95':''}`}><ChevronUp size={24}/></button>
                            <button onClick={() => { handlePress('down'); handleDirection('down'); }}
                                    className={`absolute bottom-3 p-2 text-zinc-500 hover:text-white transition-colors active:scale-95 active:text-green-500 ${activeButton==='down'?'text-green-500 scale-95':''}`}><ChevronDown size={24}/></button>
                            <button onClick={() => { handlePress('left'); handleDirection('left'); }}
                                    className={`absolute left-3 p-2 text-zinc-500 hover:text-white transition-colors active:scale-95 active:text-green-500 ${activeButton==='left'?'text-green-500 scale-95':''}`}><ChevronLeft size={24}/></button>
                            <button onClick={() => { handlePress('right'); handleDirection('right'); }}
                                    className={`absolute right-3 p-2 text-zinc-500 hover:text-white transition-colors active:scale-95 active:text-green-500 ${activeButton==='right'?'text-green-500 scale-95':''}`}><ChevronRight size={24}/></button>

                            {/* Central OK Button */}
                            <button onClick={() => { handlePress('ok', handleOk); }}
                                    className={`
                       relative w-14 h-14 rounded-full bg-[#222] 
                       shadow-[0_3px_5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] 
                       border border-black flex items-center justify-center text-[10px] font-bold text-zinc-300 tracking-wider
                       transition-all active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] active:translate-y-[1px]
                       ${activeButton === 'ok' ? 'bg-black text-green-500 shadow-inner' : 'hover:bg-[#2a2a2a]'}
                     `}
                            >
                                OK
                            </button>
                        </div>
                        <span className="mt-2 text-[9px] font-sans font-bold text-zinc-600 tracking-widest uppercase">Navigation</span>
                    </div>

                    {/* --- MAIN ACTION BUTTONS --- */}
                    <div className="grid grid-cols-3 md:grid-cols-2 gap-x-6 gap-y-6 relative z-10 w-full px-2 justify-items-center">
                        <RoundButton
                            name="info"
                            label="Disp/Back"
                            icon={view === 'viewfinder' ? Info : CornerUpLeft}
                            onClick={() => handlePress('info', handleDispBack)}
                            active={view === 'info'}
                        />
                        <RoundButton
                            name="gallery"
                            label="Play"
                            icon={Play}
                            onClick={() => handlePress('gallery', toggleGallery)}
                            active={view === 'gallery' || view === 'detail'}
                        />
                        <RoundButton
                            name="settings"
                            label="Set"
                            icon={Settings}
                            onClick={() => handlePress('settings', toggleInfo)}
                            active={view === 'info'}
                        />
                        <RoundButton
                            name="power"
                            label="Power"
                            icon={Power}
                            danger={true}
                            onClick={togglePower}
                            active={powerOn}
                        />
                    </div>

                    {/* Logo / branding bottom */}
                    <div className="hidden md:block absolute bottom-6 text-center z-10 opacity-30">
                        <div className="flex gap-1 justify-center mb-1">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                        <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-white">PRO-LINE</span>
                    </div>

                </div>

            </div>
        </div>
    );
}