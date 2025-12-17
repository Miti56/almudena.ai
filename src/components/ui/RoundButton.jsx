import React from 'react';

export default function RoundButton({ name, label, icon: Icon, onClick, active, activeButton, danger = false }) {
    const isPressed = activeButton === name;

    return (
        <div className="flex flex-col items-center gap-1 md:gap-2">
            <button
                onClick={onClick}
                className={`
                    relative rounded-full border border-black transition-all duration-100 ease-out
                    flex items-center justify-center
                    
                    /* CHANGED: Compact mobile size */
                    w-11 h-11 md:w-20 md:h-20
                    
                    shadow-[0_4px_6px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]
                    
                    ${isPressed
                    ? 'translate-y-[2px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]'
                    : 'hover:-translate-y-[1px] hover:shadow-[0_6px_8px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                }
                    
                    ${danger
                    ? (active ? 'bg-red-900/40' : 'bg-[#2a1a1a]')
                    : (active ? 'bg-zinc-800' : 'bg-[#222]')
                }
                `}
            >
                {active && (
                    <div className={`absolute top-1 md:top-2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${danger ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-green-500 shadow-[0_0_5px_lime]'}`}></div>
                )}

                <Icon
                    size={18}
                    className={`
                        transition-colors md:w-8 md:h-8
                        ${active
                        ? (danger ? 'text-red-500' : 'text-green-500')
                        : 'text-zinc-500 group-hover:text-zinc-300'
                    }
                    `}
                />
            </button>
            <span className="text-[8px] md:text-xs font-bold text-zinc-600 uppercase tracking-widest">{label}</span>
        </div>
    );
}