import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Play, Info, Settings, Power, CornerUpLeft } from 'lucide-react';
import RoundButton from '../ui/RoundButton';

export default function GripControls({
                                         handlePress,
                                         handleDirection,
                                         handleOk,
                                         toggleGallery,
                                         toggleInfo,
                                         togglePower,
                                         handleDispBack,
                                         activeButton,
                                         view,
                                         powerOn
                                     }) {
    return (
        // CHANGED: Reduced padding (py-4), fixed width on desktop, flexible height on mobile
        <div className="relative w-full md:w-80 bg-[#151515] flex flex-row md:flex-col items-center justify-between md:justify-start p-4 md:py-10 md:px-6 gap-2 md:gap-8 shadow-[-10px_0_20px_rgba(0,0,0,0.5)] z-20 md:border-l border-black shrink-0">

            <div className="absolute inset-0 texture-leather opacity-80 pointer-events-none md:rounded-r-none"></div>
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/80 to-transparent pointer-events-none"></div>

            {/* Top Dial - HIDDEN on Mobile to save space */}
            <div className="hidden md:flex flex-col items-center w-full relative z-10 mb-2">
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#111] shadow-[0_5px_10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-[#000] flex items-center justify-center transform hover:rotate-12 transition-transform cursor-pointer">
                    <div className="absolute inset-0 rounded-full opacity-30" style={{ background: 'conic-gradient(from 0deg, transparent 0deg 2deg, black 2deg 4deg) repeating-conic-gradient(from 0deg, transparent 0deg 2deg, black 2deg 4deg)' }}></div>
                    <div className="w-16 h-16 rounded-full bg-[#1a1a1a] shadow-[0_-1px_1px_rgba(255,255,255,0.1),inset_0_2px_5px_rgba(0,0,0,0.8)] flex items-center justify-center">
                        <div className="w-1 h-6 bg-red-600 rounded-full shadow-[0_0_5px_rgba(220,38,38,0.5)]"></div>
                    </div>
                </div>
                <span className="mt-3 text-[9px] font-sans font-bold text-zinc-600 tracking-widest uppercase text-shadow-sm">Multi-Function</span>
            </div>

            {/* D-PAD - Scaled Down on Mobile */}
            <div className="relative z-10 flex flex-col items-center pl-2 md:pl-0">
                {/* CHANGED: w-28 h-28 on mobile, w-36 h-36 on desktop */}
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#181818] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] flex items-center justify-center p-1 border border-black/50">
                    <div className="absolute inset-2 rounded-full bg-gradient-to-b from-black to-[#222] shadow-inner"></div>

                    <button onClick={() => { handlePress('up'); handleDirection('up'); }}
                            className={`absolute top-2 p-2 text-zinc-500 hover:text-white transition-colors active:scale-95 active:text-green-500 ${activeButton === 'up' ? 'text-green-500 scale-95' : ''}`}><ChevronUp size={20} className="md:w-6 md:h-6" /></button>
                    <button onClick={() => { handlePress('down'); handleDirection('down'); }}
                            className={`absolute bottom-2 p-2 text-zinc-500 hover:text-white transition-colors active:scale-95 active:text-green-500 ${activeButton === 'down' ? 'text-green-500 scale-95' : ''}`}><ChevronDown size={20} className="md:w-6 md:h-6" /></button>
                    <button onClick={() => { handlePress('left'); handleDirection('left'); }}
                            className={`absolute left-2 p-2 text-zinc-500 hover:text-white transition-colors active:scale-95 active:text-green-500 ${activeButton === 'left' ? 'text-green-500 scale-95' : ''}`}><ChevronLeft size={20} className="md:w-6 md:h-6" /></button>
                    <button onClick={() => { handlePress('right'); handleDirection('right'); }}
                            className={`absolute right-2 p-2 text-zinc-500 hover:text-white transition-colors active:scale-95 active:text-green-500 ${activeButton === 'right' ? 'text-green-500 scale-95' : ''}`}><ChevronRight size={20} className="md:w-6 md:h-6" /></button>

                    <button onClick={() => { handlePress('ok', handleOk); }}
                            className={`
                       relative w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#222] 
                       shadow-[0_3px_5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] 
                       border border-black flex items-center justify-center text-[8px] md:text-[10px] font-bold text-zinc-300 tracking-wider
                       transition-all active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] active:translate-y-[1px]
                       ${activeButton === 'ok' ? 'bg-black text-green-500 shadow-inner' : 'hover:bg-[#2a2a2a]'}
                     `}
                    >
                        OK
                    </button>
                </div>
            </div>

            {/* BUTTON CLUSTER - Adjusted Layout for Mobile */}
            {/* CHANGED: grid-cols-4 for mobile (horizontal strip), gap-2 for tightness */}
            <div className="grid grid-cols-2 grid-rows-2 md:grid-cols-2 gap-x-3 gap-y-3 md:gap-6 relative z-10 w-full px-2 justify-items-center">
                <RoundButton
                    name="info"
                    label="Back"
                    icon={view === 'viewfinder' ? Info : CornerUpLeft}
                    onClick={() => handlePress('info', handleDispBack)}
                    active={view === 'info'}
                    activeButton={activeButton}
                />
                <RoundButton
                    name="gallery"
                    label="Play"
                    icon={Play}
                    onClick={() => handlePress('gallery', toggleGallery)}
                    active={view === 'gallery' || view === 'detail'}
                    activeButton={activeButton}
                />
                <RoundButton
                    name="settings"
                    label="Info"
                    icon={Settings}
                    onClick={() => handlePress('settings', toggleInfo)}
                    active={view === 'info'}
                    activeButton={activeButton}
                />
                <RoundButton
                    name="power"
                    label="Power"
                    icon={Power}
                    danger={true}
                    onClick={togglePower}
                    active={powerOn}
                    activeButton={activeButton}
                />
            </div>

            <div className="hidden md:block absolute bottom-6 text-center z-10 opacity-30">
                <div className="flex gap-1 justify-center mb-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
                <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-white">PRO-LINE</span>
            </div>

        </div>
    );
}