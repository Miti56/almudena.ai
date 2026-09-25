import React from 'react';

// Rubber-domed rear button with an engraved label and a status LED.
export default function RoundButton({ name, label, icon: Icon, onClick, active, activeButton, danger = false }) {
    const isPressed = activeButton === name;

    return (
        <div className="flex flex-col items-center gap-1.5">
            <button
                onClick={onClick}
                aria-label={label}
                aria-pressed={active}
                className={`group relative w-11 h-11 md:w-[52px] md:h-[52px] rounded-full flex items-center justify-center transition-[transform,box-shadow] duration-100 ease-out
                    bg-[radial-gradient(circle_at_50%_30%,#3a3a3a,#1b1b1b_55%,#0e0e0e)]
                    ${isPressed
                        ? 'translate-y-[1.5px] shadow-[0_0_0_2px_#070707,0_1px_1px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(0,0,0,0.9)]'
                        : 'shadow-[0_0_0_2px_#070707,0_0_0_3px_rgba(255,255,255,0.05),0_4px_8px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.14)] hover:-translate-y-[0.5px] active:translate-y-[1.5px] active:shadow-[0_0_0_2px_#070707,inset_0_2px_5px_rgba(0,0,0,0.9)]'
                    }`}
            >
                <Icon
                    size={18}
                    strokeWidth={2.2}
                    className={`transition-colors ${
                        active ? (danger ? 'text-rec' : 'text-osd') : 'text-white/45 group-hover:text-white/75'
                    }`}
                />
                <span
                    className={`absolute top-1.5 right-1.5 w-[5px] h-[5px] rounded-full transition-all duration-300 ${
                        active
                            ? danger
                                ? 'bg-rec shadow-[0_0_6px_rgba(255,59,48,0.9)]'
                                : 'bg-fuji shadow-[0_0_6px_rgba(47,211,122,0.9)]'
                            : 'bg-black/60'
                    }`}
                />
            </button>
            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] engrave-dark" style={{ fontStretch: '115%' }}>
                {label}
            </span>
        </div>
    );
}
