import React, { useState, useRef } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Play, Info, Settings, Power, CornerUpLeft, Camera } from 'lucide-react';
import RoundButton from '../ui/RoundButton';

function VirtualJoystick({ onDirection, onOk }) {
    const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
    const startPos = useRef(null);
    const maxRadius = 26;
    const threshold = 12;

    const handleTouchStart = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        startPos.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        if (!startPos.current) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startPos.current.x;
        const dy = touch.clientY - startPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > maxRadius) {
            const scale = maxRadius / dist;
            setKnobPos({ x: dx * scale, y: dy * scale });
        } else {
            setKnobPos({ x: dx, y: dy });
        }
    };

    const handleTouchEnd = (e) => {
        e.preventDefault();
        const { x, y } = knobPos;
        if (Math.abs(x) < threshold && Math.abs(y) < threshold) {
            onOk();
        } else if (Math.abs(x) > Math.abs(y)) {
            onDirection(x > 0 ? 'right' : 'left');
        } else {
            onDirection(y > 0 ? 'down' : 'up');
        }
        setKnobPos({ x: 0, y: 0 });
        startPos.current = null;
    };

    return (
        <div
            className="relative w-24 h-24 rounded-full bg-[#181818] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] border border-black/50 flex items-center justify-center touch-none select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="absolute inset-2 rounded-full bg-gradient-to-b from-black to-[#222]"></div>
            <ChevronUp size={12} className="absolute top-1 left-1/2 -translate-x-1/2 text-zinc-600" />
            <ChevronDown size={12} className="absolute bottom-1 left-1/2 -translate-x-1/2 text-zinc-600" />
            <ChevronLeft size={12} className="absolute left-1 top-1/2 -translate-y-1/2 text-zinc-600" />
            <ChevronRight size={12} className="absolute right-1 top-1/2 -translate-y-1/2 text-zinc-600" />
            <div
                className="relative z-10 w-10 h-10 rounded-full bg-[#333] border border-zinc-700 shadow-[0_3px_6px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)]"
                style={{ transform: `translate(${knobPos.x}px, ${knobPos.y}px)` }}
            >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-600/20 to-transparent"></div>
            </div>
        </div>
    );
}

export default function GripControls({
                                         handlePress,
                                         handleDirection,
                                         handleOk,
                                         toggleGallery,
                                         toggleInfo,
                                         togglePower,
                                         toggleSelfie,
                                         isSelfieMode,
                                         handleDispBack,
                                         activeButton,
                                         view,
                                         powerOn
                                     }) {
    return (
        // CHANGED: py-2 on mobile (was py-4), adjusted height/width behavior
        <div className="relative w-full md:w-96 bg-[#151515] flex flex-row md:flex-col items-center justify-around md:justify-start p-2 md:py-12 md:px-8 gap-2 md:gap-10 shadow-[-10px_0_20px_rgba(0,0,0,0.5)] z-20 md:border-l border-black shrink-0 h-auto min-h-[140px] md:h-auto">

            <div className="absolute inset-0 texture-leather opacity-80 pointer-events-none md:rounded-r-none"></div>
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/80 to-transparent pointer-events-none"></div>

            {/* Top Dial (Desktop Only) */}
            <div className="hidden md:flex flex-col items-center w-full relative z-10 mb-2">
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#111] shadow-[0_5px_10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-[#000] flex items-center justify-center transform hover:rotate-12 transition-transform cursor-pointer">
                    <div className="absolute inset-0 rounded-full opacity-30" style={{ background: 'conic-gradient(from 0deg, transparent 0deg 2deg, black 2deg 4deg) repeating-conic-gradient(from 0deg, transparent 0deg 2deg, black 2deg 4deg)' }}></div>
                    <div className="w-20 h-20 rounded-full bg-[#1a1a1a] shadow-[0_-1px_1px_rgba(255,255,255,0.1),inset_0_2px_5px_rgba(0,0,0,0.8)] flex items-center justify-center">
                        <div className="w-1 h-8 bg-red-600 rounded-full shadow-[0_0_5px_rgba(220,38,38,0.5)]"></div>
                    </div>
                </div>
                <span className="mt-3 text-[10px] font-sans font-bold text-zinc-600 tracking-widest uppercase text-shadow-sm">Multi-Function</span>
            </div>

            {/* D-PAD: Mobile = Virtual Joystick, Desktop = Physical D-Pad */}
            <div className="relative z-10 flex flex-col items-center pl-1 md:pl-0">
                {/* Mobile Joystick */}
                <div className="md:hidden">
                    <VirtualJoystick
                        onDirection={(dir) => { handlePress(dir); handleDirection(dir); }}
                        onOk={() => handlePress('ok', handleOk)}
                    />
                </div>

                {/* Desktop D-Pad */}
                <div className="hidden md:flex relative w-44 h-44 rounded-full bg-[#181818] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] items-center justify-center p-1 border border-black/50">
                    <div className="absolute inset-2 rounded-full bg-gradient-to-b from-black to-[#222] shadow-inner"></div>

                    <button onClick={() => { handlePress('up'); handleDirection('up'); }}
                            className={`absolute top-3 p-2 text-zinc-500 hover:text-white transition-colors active:scale-95 active:text-green-500 ${activeButton === 'up' ? 'text-green-500 scale-95' : ''}`}><ChevronUp size={32} /></button>
                    <button onClick={() => { handlePress('down'); handleDirection('down'); }}
                            className={`absolute bottom-3 p-2 text-zinc-500 hover:text-white transition-colors active:scale-95 active:text-green-500 ${activeButton === 'down' ? 'text-green-500 scale-95' : ''}`}><ChevronDown size={32} /></button>
                    <button onClick={() => { handlePress('left'); handleDirection('left'); }}
                            className={`absolute left-3 p-2 text-zinc-500 hover:text-white transition-colors active:scale-95 active:text-green-500 ${activeButton === 'left' ? 'text-green-500 scale-95' : ''}`}><ChevronLeft size={32} /></button>
                    <button onClick={() => { handlePress('right'); handleDirection('right'); }}
                            className={`absolute right-3 p-2 text-zinc-500 hover:text-white transition-colors active:scale-95 active:text-green-500 ${activeButton === 'right' ? 'text-green-500 scale-95' : ''}`}><ChevronRight size={32} /></button>

                    <button onClick={() => { handlePress('ok', handleOk); }}
                            className={`
                       relative w-20 h-20 rounded-full bg-[#222]
                       shadow-[0_3px_5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]
                       border border-black flex items-center justify-center text-sm font-bold text-zinc-300 tracking-wider
                       transition-all active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] active:translate-y-[1px]
                       ${activeButton === 'ok' ? 'bg-black text-green-500 shadow-inner' : 'hover:bg-[#2a2a2a]'}
                     `}
                    >
                        OK
                    </button>
                </div>
            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-5 md:grid-cols-2 gap-x-1 gap-y-2 md:gap-8 relative z-10 md:w-full px-1 justify-items-center">
                <RoundButton
                    name="info"
                    label="Back"
                    icon={view === 'viewfinder' && !isSelfieMode ? Info : CornerUpLeft}
                    onClick={() => handlePress('info', handleDispBack)}
                    active={view !== 'viewfinder' || isSelfieMode}
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
                    name="selfie"
                    label="Selfie"
                    icon={Camera}
                    onClick={() => handlePress('selfie', toggleSelfie)}
                    active={isSelfieMode}
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
                    label="Pwr"
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