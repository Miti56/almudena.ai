import React, { useRef, useEffect } from 'react';
import Screw from '../ui/Screw';
import Viewfinder from '../screen/Viewfinder';
import Gallery from '../screen/Gallery';
import FilmDetail from '../screen/FilmDetail';
import SystemInfo from '../screen/SystemInfo';
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
                                        handleBack,
                                        webcamStream,
                                        navHint
                                    }) {

    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            if (webcamStream) {
                videoRef.current.srcObject = webcamStream;
                videoRef.current.play().catch(e => console.log("Stream play error", e));
            } else {
                videoRef.current.srcObject = null;
                videoRef.current.src = "./public/videoTest.mp4";
                videoRef.current.play().catch(e => console.log("Video play error", e));
            }
        }
    }, [webcamStream]);

    return (
        // CHANGED: p-0 on mobile, flex-1 to take available space
        <div className="flex-1 relative p-0 md:p-8 flex flex-col items-center justify-center z-10 w-full overflow-hidden">

            {/* --- BEZEL CONTAINER --- */}
            {/* CHANGED: Removed rounded corners, shadows, and thick borders on mobile */}
            <div className="relative w-full h-full bg-[#0a0a0a] md:rounded-lg md:shadow-[inset_0_0_20px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.1)] p-0 md:p-2 md:border-t md:border-white/5 md:border-b md:border-black flex flex-col overflow-hidden">

                {/* Top Bezel (Desktop Only) */}
                <div className="hidden md:block h-2 w-full bg-black mb-1 rounded-t-sm"></div>

                {/* --- LCD SCREEN --- */}
                {/* CHANGED: Added border-b for mobile separation */}
                <div className={`relative flex-1 w-full bg-black overflow-hidden shadow-none md:shadow-[inset_0_0_10px_rgba(0,0,0,1)] transition-opacity duration-500 ${!powerOn ? 'opacity-10' : 'opacity-100'} md:rounded-sm border-b border-white/20 md:border-0`}>

                    {/* Boot Sequence */}
                    {powerOn && bootSequence && (
                        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
                            <div className="text-green-500 font-camera text-sm mb-4 animate-pulse">INITIALIZING...</div>
                            <div className="w-48 h-1 bg-zinc-800 rounded overflow-hidden">
                                <div className="h-full bg-green-500 animate-[width_2s_ease-out_forwards]" style={{ width: '0%' }}></div>
                            </div>
                        </div>
                    )}

                    {/* VIDEO FEED */}
                    <video
                        ref={videoRef}
                        className={`absolute transition-all duration-700 ease-in-out object-cover border-zinc-800
                       ${view !== 'viewfinder'
                            ? 'scale-110 inset-0 w-full h-full'
                            : osdMode === 3
                                ? 'top-8 left-8 w-[35%] aspect-video border border-white/20 shadow-2xl z-10 rounded-sm'
                                : 'inset-0 scale-100 border-0 w-full h-full'
                        }`}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            filter: view !== 'viewfinder'
                                ? 'brightness(0.3) blur(16px)'
                                : 'brightness(1.1) blur(0px)',
                            transform: webcamStream ? 'scaleX(-1)' : 'none'
                        }}
                    />

                    {/* UI LAYER */}
                    <div className="relative z-10 h-full">
                        {powerOn && !bootSequence && (
                            <>
                                {/* Toast Hint */}
                                {navHint && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 border border-green-500/50 text-green-500 px-4 py-2 rounded shadow-2xl backdrop-blur-md z-50 animate-in fade-in zoom-in duration-200 pointer-events-none">
                                        <span className="font-camera text-sm md:text-lg tracking-widest">{navHint}</span>
                                    </div>
                                )}

                                {view === 'viewfinder' && (
                                    <div className="absolute inset-0 p-2 md:p-6 flex flex-col justify-between">
                                        <Viewfinder osdMode={osdMode} time={time} formatTime={formatTime} />
                                    </div>
                                )}
                                {view === 'gallery' && (
                                    <Gallery
                                        galleryFocusIndex={galleryFocusIndex}
                                        gridMode={gridMode}
                                        toggleGridMode={toggleGridMode}
                                        selectFilm={selectFilm}
                                        handleBack={handleBack}
                                    />
                                )}
                                {view === 'detail' && (
                                    <FilmDetail selectedFilm={selectedFilm} handleBack={handleBack} />
                                )}
                                <SystemInfo isVisible={view === 'info'} handleBack={handleBack} />
                            </>
                        )}
                    </div>

                    {/* OVERLAYS */}
                    {osdMode !== 3 && (
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            <div className="absolute inset-0 scanline opacity-10"></div>
                            <div className="absolute inset-0 screen-pixel opacity-10"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>
                        </div>
                    )}
                    <div className="absolute inset-0 pointer-events-none z-40" style={{ backgroundImage: `url(${dirtImg})`, backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'screen', opacity: 0.3 }}></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-sm z-50"></div>
                </div>

                {/* --- BOTTOM CHIN (Desktop Only) --- */}
                <div className="hidden md:flex h-8 w-full bg-[#0a0a0a] items-center justify-center rounded-b-sm border-t border-white/5 z-20">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 drop-shadow-[0_1px_0_rgba(0,0,0,1)]">CINEMA MONITOR // 8K</span>
                </div>

            </div>

            {/* Decorative Screws (Desktop Only) */}
            <Screw className="hidden md:block absolute top-3 left-3 z-30" />
            <Screw className="hidden md:block absolute top-3 right-3 z-30" />
            <Screw className="hidden md:block absolute bottom-3 left-3 z-30" />
            <Screw className="hidden md:block absolute bottom-3 right-3 z-30" />

            {/* REC LIGHT */}
            {powerOn && (
                <div className={`absolute top-4 right-4 md:top-6 md:right-6 z-30 flex items-center gap-2 transition-opacity duration-300 ${isRecording ? 'opacity-100' : 'opacity-20'}`}>
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,1)] animate-pulse border border-black/50"></div>
                </div>
            )}
        </div>
    );
}