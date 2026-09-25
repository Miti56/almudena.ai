import React from 'react';

// Power-on splash: wordmark resolves, then the iris (rendered behind this layer) opens onto live view.
export default function BootScreen({ leaving }) {
    return (
        <div
            className={`absolute inset-0 z-40 bg-black flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${
                leaving ? 'opacity-0' : 'opacity-100'
            }`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)]" />

            <div className="relative flex flex-col items-center gap-5 px-6 text-center">
                <div className="flex items-center gap-3 animate-[fade_0.6s_ease-out_0.1s_both]">
                    <span className="block w-1.5 h-1.5 bg-rec" />
                    <span className="font-mono text-[10px] tracking-[0.4em] text-white/40">X-DIR SERIES</span>
                </div>

                <h1
                    className="font-sans font-[800] text-white text-3xl md:text-6xl uppercase"
                    style={{ fontStretch: '125%', animation: 'wordmark 1.6s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}
                >
                    Almudena
                </h1>

                <div className="h-px w-40 md:w-64 bg-white/15 overflow-hidden">
                    <div className="h-full w-full bg-white/70 origin-left animate-[wipe_1.8s_cubic-bezier(0.65,0,0.35,1)_0.5s_both]" />
                </div>

                <p
                    className="font-sans text-[11px] md:text-sm uppercase tracking-[0.5em] text-white/55 animate-[rise_0.9s_cubic-bezier(0.16,1,0.3,1)_0.9s_both]"
                    style={{ fontStretch: '110%' }}
                >
                    Mirones Riotte
                </p>
            </div>

            <div className="absolute bottom-5 inset-x-0 px-6 flex justify-between items-end font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-white/30 animate-[fade_0.6s_ease-out_1.2s_both]">
                <span>FW 3.10 · LENS 35MM F1.4</span>
                <span>
                    DESIGNED WITH <span className="text-rec/70">♥</span> BY MITI
                </span>
            </div>
        </div>
    );
}
