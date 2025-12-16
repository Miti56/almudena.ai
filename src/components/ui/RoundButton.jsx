import React from 'react';

export default function RoundButton({ icon: Icon, label, onClick, active, name, activeButton, size = "md", danger = false }) {
    const sizeClasses = size === "lg" ? "w-14 h-14" : "w-10 h-10";
    // Check if this specific button is currently being pressed (via parent state)
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
}