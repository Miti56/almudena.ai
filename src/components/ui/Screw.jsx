import React from 'react';

export default function Screw({ className }) {
    return (
        <div className={`w-3 h-3 rounded-full bg-zinc-800 shadow-[inset_0_1px_2px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center ${className}`}>
            <div className="w-full h-[1px] bg-zinc-900 rotate-45 shadow-[0_1px_0_rgba(255,255,255,0.2)]"></div>
            <div className="absolute w-full h-[1px] bg-zinc-900 -rotate-45 shadow-[0_1px_0_rgba(255,255,255,0.2)]"></div>
        </div>
    );
}