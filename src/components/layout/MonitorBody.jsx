import React from 'react';
import Screw from '../ui/Screw';
import Viewfinder from '../screen/Viewfinder';
import Gallery from '../screen/Gallery';
import FilmDetail from '../screen/FilmDetail';
import SystemInfo from '../screen/SystemInfo';

// --- IMPORTS ---
import dirtImg from '../../assets/textures/001.jpg';

export default function MonitorBody({
                                        powerOn,
                                        bootSequence,
                                        view,
                                        osdMode,
                                        time,
                                        isRecording,
                                        formatTime,
                                        galleryFocusIndex,
                                        gridMode,
                                        toggleGridMode,
                                        selectFilm,
                                        selectedFilm,
                                        handleBack
                                    }) {
    return (
        <div className="flex-1 relative p-4 md:p-8 flex flex-col items-center justify-center z-10">

            {/* --- BEZEL CONTAINER --- */}
            <div className="relative w-full h-full bg-[#0a0a0a] rounded-lg shadow-[inset_0_0_20px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.1)] p-2 border-t border-white/5 border-b border-black flex flex-col overflow-hidden">

                {/* Top Bezel (Thin) */}
                <div className="h-2 w-full bg-black mb-1 rounded-t-sm"></div>

                {/* --- LCD SCREEN ITSELF --- */}
                <div className={`relative flex-1 w-full bg-black overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,1)] transition-opacity duration-500 ${!powerOn ? 'opacity-10' : 'opacity-100'} rounded-sm`}>

                    {/* Boot Sequence */}
                    {powerOn && bootSequence && (
                        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
                            <div className="text-green-500 font-camera text-sm mb-4 animate-pulse">INITIALIZING SENSOR...</div>
                            <div className="w-48 h-1 bg-zinc-800 rounded overflow-hidden">
                                <div className="h-full bg-green-500 animate-[width_2s_ease-out_forwards]" style={{ width: '0%' }}></div>
                            </div>
                        </div>
                    )}

                    {/* 1. LAYER: VIDEO FEED (Bottom) */}
                    <video
                        className={`absolute transition-all duration-700 ease-in-out object-cover border-zinc-800
                       ${view !== 'viewfinder'
                            ? 'scale-110 inset-0 w-full h-full' // Zoom in slightly when blurring
                            : osdMode === 3
                                ? 'top-8 left-8 w-[35%] aspect-video border border-white/20 shadow-2xl z-10 rounded-sm'
                                : 'inset-0 scale-100 border-0 w-full h-full'
                        }`}
                        // FIX: Logic moved here.
                        // If in Viewfinder: slightly bright to see through dirt.
                        // If in Gallery/Menu: Dark (0.3) and Heavy Blur (16px) for readability.
                        style={{
                            filter: view !== 'viewfinder'
                                ? 'brightness(0.3) blur(16px)'
                                : 'brightness(1.1) blur(0px)'
                        }}
                        src="previews/videoTest.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />

                    {/* 2. LAYER: UI / OSD (Middle, z-10) */}
                    <div className="relative z-10 h-full">
                        {powerOn && !bootSequence && (
                            <>
                                {view === 'viewfinder' && (
                                    <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between">
                                        <Viewfinder osdMode={osdMode} time={time} formatTime={formatTime} />
                                    </div>
                                )}
                                {view === 'gallery' && (
                                    <Gallery
                                        galleryFocusIndex={galleryFocusIndex}
                                        gridMode={gridMode}
                                        toggleGridMode={toggleGridMode}
                                        selectFilm={selectFilm}
                                    />
                                )}
                                {view === 'detail' && (
                                    <FilmDetail selectedFilm={selectedFilm} handleBack={handleBack} />
                                )}
                                <SystemInfo isVisible={view === 'info'} handleBack={handleBack} />
                            </>
                        )}
                    </div>

                    {/* 3. LAYER: CRT EFFECTS (Scanlines/Pixels) (z-20) */}
                    {osdMode !== 3 && (
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            <div className="absolute inset-0 scanline opacity-10"></div>
                            <div className="absolute inset-0 screen-pixel opacity-10"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>
                        </div>
                    )}

                    {/* 4. LAYER: SCREEN DIRT (Top, z-40) */}
                    <div
                        className="absolute inset-0 pointer-events-none z-40"
                        style={{
                            backgroundImage: `url(${dirtImg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            mixBlendMode: 'screen',
                            opacity: 0.3
                        }}
                    ></div>

                    {/* 5. LAYER: GLASS REFLECTION (Highest, z-50) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-sm z-50"></div>
                </div>

                {/* --- BOTTOM CHIN (Standard Matte) --- */}
                <div className="h-8 w-full bg-[#0a0a0a] flex items-center justify-center rounded-b-sm border-t border-white/5 z-20">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 drop-shadow-[0_1px_0_rgba(0,0,0,1)]">
                        CINEMA MONITOR // 8K
                    </span>
                </div>

            </div>

            {/* Decorative Screws */}
            <Screw className="absolute top-3 left-3 z-30" />
            <Screw className="absolute top-3 right-3 z-30" />
            <Screw className="absolute bottom-3 left-3 z-30" />
            <Screw className="absolute bottom-3 right-3 z-30" />

            {/* INTERNAL REC LIGHT */}
            {powerOn && (
                <div className={`absolute top-6 right-6 z-30 flex items-center gap-2 transition-opacity duration-300 ${isRecording ? 'opacity-100' : 'opacity-20'}`}>
                    <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,1)] animate-pulse border border-black/50"></div>
                </div>
            )}

        </div>

    );
}