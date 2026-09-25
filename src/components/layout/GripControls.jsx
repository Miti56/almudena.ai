import React, { useState } from 'react';
import { Play, Info, CornerUpLeft, Camera, User } from 'lucide-react';
import RoundButton from '../ui/RoundButton';
import { tick } from '../../lib/sfx';

// ---------------------------------------------------------------------------
// Mode dial: a knurled dial that physically rotates to the active mode
// ---------------------------------------------------------------------------

const MODES = [
    { id: 'live', label: 'LV' },
    { id: 'play', label: '▶' },
    { id: 'info', label: 'INFO' },
    { id: 'selfie', label: 'SELF' },
];
const DETENT = 60;

function ModeDial({ mode, onMode, disabled }) {
    const idx = MODES.findIndex((m) => m.id === mode);
    const [dial, setDial] = useState({ mode, angle: -idx * DETENT });

    // Rotate the shortest way to the new detent (state adjusted during render)
    if (dial.mode !== mode) {
        let target = -idx * DETENT;
        while (target - dial.angle > 180) target -= 360;
        while (dial.angle - target > 180) target += 360;
        setDial({ mode, angle: target });
    }

    const select = (id) => {
        if (disabled || id === mode) return;
        tick();
        onMode(id);
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-[118px] h-[118px]">
                {/* index mark on the top plate */}
                <span className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-rec z-10" />

                {/* drop shadow on the plate */}
                <div className="absolute inset-1 rounded-full shadow-[0_10px_18px_rgba(0,0,0,0.55),0_2px_3px_rgba(0,0,0,0.6)]" />

                <div
                    className="absolute inset-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                    style={{ transform: `rotate(${dial.angle}deg)` }}
                >
                    {/* knurled rim */}
                    <button
                        aria-label="Dial de modo"
                        onClick={() => select(MODES[(idx + 1) % MODES.length].id)}
                        className="absolute inset-0 rounded-full knurl-black ring-1 ring-black cursor-pointer"
                    />
                    {/* face */}
                    <div className="absolute inset-[8px] rounded-full mat-paint shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-2px_6px_rgba(0,0,0,0.7),0_0_0_1px_#000] pointer-events-none" />
                    {/* engraved positions */}
                    {MODES.map((m, i) => (
                        <button
                            key={m.id}
                            onClick={() => select(m.id)}
                            className="absolute left-1/2 top-1/2 w-10 h-6 -ml-5 -mt-3 flex items-center justify-center"
                            style={{ transform: `rotate(${i * DETENT}deg) translateY(-37px)` }}
                        >
                            <span
                                className={`text-[10px] font-[800] tracking-[0.08em] transition-colors duration-300 ${
                                    i === idx ? 'text-osd' : 'text-white/35 hover:text-white/70'
                                }`}
                                style={{ fontStretch: '110%' }}
                            >
                                {m.label}
                            </span>
                        </button>
                    ))}
                    {/* spun-metal centre cap */}
                    <div className="absolute inset-[38px] rounded-full mat-spun shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(0,0,0,0.35)] pointer-events-none" />
                </div>
            </div>
            <span className="text-[9px] font-bold tracking-[0.3em] engrave-light" style={{ fontStretch: '115%' }}>
                MODE
            </span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Shutter release with the ON/OFF collar around it
// ---------------------------------------------------------------------------

function ShutterButton({ powerOn, onShutter, onPower, compact = false }) {
    const [down, setDown] = useState(false);
    const size = compact ? 'w-[58px] h-[58px]' : 'w-[104px] h-[104px]';
    const cap = compact ? 'inset-[13px]' : 'inset-[24px]';

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`relative ${size}`}>
                {/* ON / OFF engraving on the plate */}
                {!compact && (
                    <>
                        <span className="absolute -top-3 -left-2 text-[9px] font-[800] tracking-[0.15em] engrave-light">OFF</span>
                        <span className="absolute -top-3 -right-1 text-[9px] font-[800] tracking-[0.15em] engrave-light">ON</span>
                    </>
                )}

                {/* collar (rotates with the lever) */}
                <button
                    aria-label={powerOn ? 'Apagar' : 'Encender'}
                    onClick={() => {
                        tick();
                        onPower();
                    }}
                    className="absolute inset-0 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                    style={{ transform: `rotate(${powerOn ? 32 : -32}deg)` }}
                >
                    <span className="absolute inset-0 rounded-full knurl-silver ring-1 ring-black/60 shadow-[0_6px_12px_rgba(0,0,0,0.5)]" />
                    <span className="absolute inset-[4px] rounded-full mat-spun" />
                    {/* lever tab */}
                    <span
                        className={`absolute left-1/2 -translate-x-1/2 ${compact ? '-top-[6px] w-4 h-3' : '-top-[10px] w-6 h-4'} rounded-t-[5px] rounded-b-[2px] mat-silver ring-1 ring-black/40 shadow-[0_2px_3px_rgba(0,0,0,0.5)]`}
                    />
                    {/* power index dot on the collar */}
                    <span className={`absolute left-1/2 -translate-x-1/2 ${compact ? 'top-[4px]' : 'top-[7px]'} w-[5px] h-[5px] rounded-full ${powerOn ? 'bg-rec' : 'bg-zinc-600'}`} />
                </button>

                {/* release button */}
                <button
                    aria-label="Disparador"
                    onPointerDown={() => setDown(true)}
                    onPointerUp={() => setDown(false)}
                    onPointerLeave={() => setDown(false)}
                    onClick={onShutter}
                    className={`absolute ${cap} rounded-full transition-transform duration-75 ${down ? 'scale-[0.94] translate-y-[1px]' : ''}`}
                >
                    <span className="absolute inset-0 rounded-full bg-[#0c0c0c] shadow-[0_0_0_1px_rgba(0,0,0,0.9),0_3px_6px_rgba(0,0,0,0.6)]" />
                    <span className="absolute inset-[3px] rounded-full mat-spun" />
                    <span
                        className={`absolute inset-[3px] rounded-full transition-opacity duration-75 ${down ? 'opacity-100' : 'opacity-0'} shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]`}
                    />
                    {/* threaded cable-release socket */}
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[28%] h-[28%] rounded-full bg-[radial-gradient(circle,#111_35%,#555_40%,#222_55%,#777_70%,#333)]" />
                </button>
            </div>
            {!compact && (
                <span className="text-[9px] font-bold tracking-[0.3em] engrave-light" style={{ fontStretch: '115%' }}>
                    SHUTTER
                </span>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// 4-way selector (desktop)
// ---------------------------------------------------------------------------

const WEDGES = [
    { dir: 'up', clip: 'polygon(50% 50%, 0 0, 100% 0)', arrow: 'top-2.5 left-1/2 -translate-x-1/2 rotate-0' },
    { dir: 'right', clip: 'polygon(50% 50%, 100% 0, 100% 100%)', arrow: 'right-2.5 top-1/2 -translate-y-1/2 rotate-90' },
    { dir: 'down', clip: 'polygon(50% 50%, 100% 100%, 0 100%)', arrow: 'bottom-2.5 left-1/2 -translate-x-1/2 rotate-180' },
    { dir: 'left', clip: 'polygon(50% 50%, 0 100%, 0 0)', arrow: 'left-2.5 top-1/2 -translate-y-1/2 -rotate-90' },
];

function SelectorPad({ onDirection, onOk, activeButton }) {
    const tilt = { up: 'rotateX(6deg)', down: 'rotateX(-6deg)', left: 'rotateY(-6deg)', right: 'rotateY(6deg)' }[activeButton] || 'none';
    return (
        <div className="relative w-[164px] h-[164px] [perspective:400px]">
            {/* recess in the body */}
            <div className="absolute -inset-1.5 rounded-full bg-black/70 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.05)]" />
            <div
                className="absolute inset-0 rounded-full mat-paint shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_3px_8px_rgba(0,0,0,0.7)] transition-transform duration-100"
                style={{ transform: tilt }}
            >
                {WEDGES.map(({ dir, clip, arrow }) => (
                    <button
                        key={dir}
                        aria-label={dir}
                        onClick={() => onDirection(dir)}
                        className={`absolute inset-0 rounded-full transition-colors ${activeButton === dir ? 'bg-black/40' : 'hover:bg-white/[0.04]'}`}
                        style={{ clipPath: clip }}
                    >
                        <span
                            className={`absolute ${arrow} w-0 h-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent transition-colors ${
                                activeButton === dir ? 'border-b-fuji' : 'border-b-white/40'
                            }`}
                        />
                    </button>
                ))}
            </div>
            {/* centre OK */}
            <button
                onClick={onOk}
                aria-label="OK"
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[66px] h-[66px] rounded-full flex flex-col items-center justify-center leading-none transition-[transform,box-shadow] duration-100
                    bg-[radial-gradient(circle_at_50%_30%,#383838,#1a1a1a_60%,#0f0f0f)]
                    ${activeButton === 'ok'
                        ? 'scale-[0.97] shadow-[0_0_0_2px_#060606,inset_0_2px_6px_rgba(0,0,0,0.9)]'
                        : 'shadow-[0_0_0_2px_#060606,0_4px_8px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.14)] hover:brightness-110'
                    }`}
            >
                <span className="text-[8px] font-bold tracking-[0.2em] text-white/40">MENU</span>
                <span className={`mt-0.5 text-sm font-[800] tracking-[0.1em] ${activeButton === 'ok' ? 'text-fuji' : 'text-white/80'}`}>OK</span>
            </button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Grip
// ---------------------------------------------------------------------------

export default function GripControls({
    handlePress,
    handleDirection,
    handleOk,
    toggleGallery,
    toggleInfo,
    togglePower,
    toggleSelfie,
    handleShutter,
    setMode,
    mode,
    isSelfieMode,
    handleDispBack,
    activeButton,
    view,
    powerOn,
}) {
    const direction = (dir) => handlePress(dir, () => handleDirection(dir));
    const ok = () => handlePress('ok', handleOk);

    const buttons = [
        {
            name: 'back',
            label: view === 'viewfinder' && !isSelfieMode ? 'Disp' : 'Back',
            icon: view === 'viewfinder' && !isSelfieMode ? Info : CornerUpLeft,
            onClick: () => handlePress('back', handleDispBack),
            active: view !== 'viewfinder' || isSelfieMode,
        },
        { name: 'gallery', label: 'Play', icon: Play, onClick: () => handlePress('gallery', toggleGallery), active: view === 'gallery' || view === 'detail' },
        { name: 'selfie', label: 'Selfie', icon: Camera, onClick: () => handlePress('selfie', toggleSelfie), active: isSelfieMode },
        { name: 'info', label: 'Info', icon: User, onClick: () => handlePress('info', toggleInfo), active: view === 'info' },
    ];

    return (
        <div className="relative shrink-0 z-20 w-full md:w-[20rem] lg:w-[21rem] md:h-full flex flex-col">
            {/* ---------------- TOP-PLATE SHOULDER (desktop) ---------------- */}
            <div className="hidden md:flex relative mat-silver items-center justify-around px-5 pt-8 pb-5 [@media(max-height:800px)]:pt-6 [@media(max-height:800px)]:pb-3 shadow-[inset_0_-1px_0_rgba(0,0,0,0.35),inset_1px_0_0_rgba(255,255,255,0.4)]">
                <ModeDial mode={mode} onMode={setMode} disabled={!powerOn} />
                <ShutterButton powerOn={powerOn} onShutter={handleShutter} onPower={togglePower} />
                {/* chamfer into the leather */}
                <div className="absolute inset-x-0 -bottom-[6px] h-[6px] bg-gradient-to-b from-[#6f6e69] to-[#2a2a2a]" />
            </div>

            {/* ---------------- REAR / LEATHER ---------------- */}
            <div className="relative flex-1 mat-leather flex flex-row md:flex-col items-start md:items-center justify-between md:justify-start gap-4 md:gap-9 [@media(min-width:768px)_and_(max-height:800px)]:gap-5 px-5 pt-4 md:px-8 md:pt-10 [@media(min-width:768px)_and_(max-height:800px)]:pt-6 md:pb-6 border-t border-black md:border-t-0 md:border-l md:border-l-black/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:shadow-[inset_12px_0_18px_-10px_rgba(0,0,0,0.9)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                {/* Selector (desktop only; touch uses taps and swipes on the screen) */}
                <div className="hidden md:block">
                    <SelectorPad onDirection={direction} onOk={ok} activeButton={activeButton} />
                </div>

                {/* Buttons */}
                <div className="flex-1 md:flex-none grid grid-cols-4 md:grid-cols-2 justify-items-center gap-x-2 gap-y-2 md:gap-x-10 md:gap-y-5 [@media(min-width:768px)_and_(max-height:800px)]:gap-y-3">
                    {buttons.map((b) => (
                        <RoundButton key={b.name} {...b} activeButton={activeButton} />
                    ))}
                </div>

                {/* Shutter on touch layouts */}
                <div className="md:hidden flex items-center gap-4 -mt-[7px]">
                    <span className="w-px h-10 bg-white/[0.07] shadow-[1px_0_0_rgba(0,0,0,0.6)]" />
                    <ShutterButton compact powerOn={powerOn} onShutter={handleShutter} onPower={togglePower} />
                </div>

                {/* Badge */}
                <div className="hidden md:flex [@media(max-height:800px)]:!hidden mt-auto flex-col items-center gap-1.5">
                    <div className="flex items-center gap-2">
                        <span className="w-[5px] h-[5px] bg-rec" />
                        <span className="text-[11px] font-[800] tracking-[0.45em] engrave-dark" style={{ fontStretch: '125%' }}>
                            X-DIR
                        </span>
                    </div>
                    <span className="text-[8px] tracking-[0.35em] engrave-dark opacity-70">DIRECTOR SERIES</span>
                </div>
            </div>
        </div>
    );
}
