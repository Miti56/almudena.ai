import React, { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import Viewfinder from '../screen/Viewfinder';
import Gallery from '../screen/Gallery';
import FilmDetail from '../screen/FilmDetail';
import SystemInfo from '../screen/SystemInfo';
import LiveView from '../screen/LiveView';
import BootScreen from '../screen/BootScreen';
import Iris from '../ui/Iris';
import { FILMS } from '../../data/cameraData';
import dirtImg from '../../assets/textures/001.webp';

const HELP = [
    ['◀ ▶', 'Cambiar película'],
    ['OK', 'Ver película'],
    ['PLAY', 'Galería'],
    ['INFO', 'Sobre mí'],
    ['SELFIE', 'Cámara frontal'],
    ['●', 'Disparador · volver'],
];

function HelpCard() {
    return (
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none bg-black/45 animate-[fade_0.25s_ease-out_both]">
            <div className="w-full max-w-[300px] bg-black/80 backdrop-blur-xl border border-white/15 rounded-[6px] shadow-2xl overflow-hidden animate-[pop_0.3s_cubic-bezier(0.16,1,0.3,1)_both]">
                <div className="flex items-center justify-between px-4 h-9 bg-osd text-black">
                    <span className="text-[10px] font-[800] tracking-[0.25em]">GUÍA RÁPIDA</span>
                    <span className="font-mono text-[10px]">?</span>
                </div>
                <div className="py-1">
                    {HELP.map(([key, label], i) => (
                        <div
                            key={key}
                            className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.06] last:border-0 animate-[rise_0.4s_cubic-bezier(0.16,1,0.3,1)_both]"
                            style={{ animationDelay: `${60 + i * 35}ms` }}
                        >
                            <span className="min-w-12 text-center font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] border border-white/25 text-osd">{key}</span>
                            <span className="text-sm text-white/85">{label}</span>
                        </div>
                    ))}
                </div>
                <div className="hidden md:block px-4 py-2 bg-white/5 font-mono text-[9px] tracking-[0.15em] text-white/45">
                    TECLADO: ← → ↑ ↓ · ENTER · ESC · P · I
                </div>
            </div>
        </div>
    );
}

export default function MonitorBody({
    powerOn,
    bootSequence,
    view,
    liveIndex,
    onLiveNext,
    onLivePrev,
    openLive,
    isSelfieMode,
    webcamStream,
    navHint,
    shutterTick,
    frames,
    galleryFocusIndex,
    setGalleryFocusIndex,
    gridMode,
    toggleGridMode,
    selectFilm,
    selectedFilm,
    handleBack,
    infoTab,
    setInfoTab,
}) {
    const videoRef = useRef(null);
    const [capture, setCapture] = useState(null);
    const lastTick = useRef(shutterTick);

    // Attach the webcam stream
    useEffect(() => {
        if (videoRef.current && webcamStream) {
            videoRef.current.srcObject = webcamStream;
            videoRef.current.play().catch(() => {});
        }
    }, [webcamStream]);

    // Selfie capture: grab the frame while the iris is shut, like a real exposure
    useEffect(() => {
        if (shutterTick === lastTick.current) return;
        lastTick.current = shutterTick;
        if (!isSelfieMode) return;
        const t = setTimeout(() => {
            const video = videoRef.current;
            if (!video || video.readyState < 2) return;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const c2d = canvas.getContext('2d');
            c2d.translate(canvas.width, 0);
            c2d.scale(-1, 1);
            c2d.drawImage(video, 0, 0);
            setCapture({ url: canvas.toDataURL('image/jpeg', 0.92), key: shutterTick });
        }, 110);
        return () => clearTimeout(t);
    }, [shutterTick, isSelfieMode]);

    // Hide the capture thumbnail after a while
    useEffect(() => {
        if (!capture) return;
        const t = setTimeout(() => setCapture(null), 6000);
        return () => clearTimeout(t);
    }, [capture]);

    const live = powerOn && !bootSequence;
    const film = FILMS[liveIndex];

    return (
        <div className="relative flex-1 min-h-0 w-full flex flex-col md:p-6 lg:p-8 z-10">
            {/* Monitor surround (desktop) */}
            <div className="relative flex-1 min-h-0 flex flex-col md:mat-paint md:rounded-[18px] md:p-3 md:shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_-1px_0_rgba(0,0,0,0.8)_inset,0_20px_40px_rgba(0,0,0,0.45)]">
                {/* ---------------- LCD ---------------- */}
                <div className="relative flex-1 min-h-0 bg-black overflow-hidden lcd-glass md:rounded-[8px] md:ring-1 md:ring-black md:shadow-[0_0_0_3px_#0b0b0b,0_0_0_4px_rgba(255,255,255,0.06),inset_0_0_18px_rgba(0,0,0,0.9)]">
                    {/* 1. Sensor feed */}
                    {webcamStream ? (
                        <video
                            ref={videoRef}
                            className={`absolute inset-0 w-full h-full object-cover transition-[filter,transform] duration-700 ${view !== 'viewfinder' ? 'blur-md brightness-[0.35]' : ''}`}
                            style={{ transform: 'scaleX(-1)' }}
                            autoPlay
                            muted
                            playsInline
                        />
                    ) : (
                        <LiveView index={liveIndex} active={live && view === 'viewfinder'} onNext={onLiveNext} dimmed={view !== 'viewfinder'} />
                    )}

                    {/* 2. OSD & menus */}
                    {live && (
                        <div className="absolute inset-0 z-10">
                            {view === 'viewfinder' && (
                                <Viewfinder
                                    film={film}
                                    index={liveIndex}
                                    total={FILMS.length}
                                    isSelfie={isSelfieMode}
                                    videoRef={videoRef}
                                    frames={frames}
                                    autoplay={!isSelfieMode}
                                    onOpen={openLive}
                                    onPrev={onLivePrev}
                                    onNext={onLiveNext}
                                />
                            )}
                            {view === 'gallery' && (
                                <Gallery
                                    galleryFocusIndex={galleryFocusIndex}
                                    onFocusIndex={setGalleryFocusIndex}
                                    gridMode={gridMode}
                                    toggleGridMode={toggleGridMode}
                                    selectFilm={selectFilm}
                                    handleBack={handleBack}
                                />
                            )}
                            {view === 'detail' && <FilmDetail selectedFilm={selectedFilm} handleBack={handleBack} />}
                            {view === 'info' && <SystemInfo handleBack={handleBack} tabIndex={infoTab} onTab={setInfoTab} />}
                        </div>
                    )}

                    {/* 3. Hints */}
                    {live && navHint && (
                        <div className="absolute inset-0 z-30 pointer-events-none">
                            {navHint === 'HELP_MENU' ? (
                                <HelpCard />
                            ) : (
                                <div className="absolute top-14 md:top-16 left-1/2 -translate-x-1/2 animate-[pop_0.3s_cubic-bezier(0.16,1,0.3,1)_both]">
                                    <div className="flex items-center gap-2 h-8 px-4 rounded-full bg-black/75 backdrop-blur-md border border-white/15 osd">
                                        <span className="w-1.5 h-1.5 rounded-full bg-fuji" />
                                        <span className="font-mono text-[11px] tracking-[0.2em] whitespace-nowrap">{navHint}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 4. Selfie capture thumbnail */}
                    {capture && view === 'viewfinder' && (
                        <a
                            key={capture.key}
                            href={capture.url}
                            download={`ALMUDENA_${String(capture.key).padStart(4, '0')}.jpg`}
                            className="absolute z-30 right-3 bottom-14 md:right-5 md:bottom-20 w-24 md:w-36 aspect-[4/3] rounded-[3px] overflow-hidden ring-2 ring-osd shadow-2xl group animate-[pop_0.5s_cubic-bezier(0.34,1.56,0.64,1)_0.2s_both]"
                        >
                            <img src={capture.url} alt="Captura" className="w-full h-full object-cover" />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-osd">
                                <Download size={18} />
                            </span>
                        </a>
                    )}

                    {/* 5. Shutter flash + iris */}
                    {shutterTick > 0 && (
                        <div key={shutterTick} className="absolute inset-0 z-[35] bg-white pointer-events-none" style={{ animation: 'flash 0.45s ease-out 0.12s both' }} />
                    )}
                    <Iris open={live} snapKey={shutterTick} className="z-[36]" />

                    {/* 6. Boot */}
                    {powerOn && bootSequence && <BootScreen />}

                    {/* 7. Panel off */}
                    <div className={`absolute inset-0 z-[45] bg-[#050505] pointer-events-none transition-opacity duration-700 ${powerOn ? 'opacity-0' : 'opacity-100 delay-300'}`} />

                    {/* 8. Physical panel: sub-pixels, grain, dust */}
                    <div className="absolute inset-0 z-50 pointer-events-none lcd-pixels opacity-40" />
                    <div className="absolute -inset-[20%] z-50 pointer-events-none film-grain opacity-[0.045] mix-blend-overlay" />
                    <div
                        className="absolute inset-0 z-50 pointer-events-none opacity-[0.08] mix-blend-screen"
                        style={{ backgroundImage: `url(${dirtImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                </div>

                {/* ---------------- CHIN (desktop) ---------------- */}
                <div className="hidden md:flex items-center justify-between h-7 mt-2 px-2">
                    <span className="text-[9px] font-bold tracking-[0.35em] engrave-dark" style={{ fontStretch: '120%' }}>
                        TILT LCD 3.0
                    </span>
                    {/* speaker grille */}
                    <span className="flex gap-[5px]">
                        {Array.from({ length: 7 }, (_, i) => (
                            <span key={i} className="w-[3px] h-[3px] rounded-full bg-black shadow-[0_1px_0_rgba(255,255,255,0.08)]" />
                        ))}
                    </span>
                    {/* card-access lamp */}
                    <span className="flex items-center gap-2">
                        <span
                            key={shutterTick}
                            className={`w-[6px] h-[6px] rounded-full ${powerOn ? 'bg-fuji' : 'bg-[#1d2a22]'}`}
                            style={powerOn ? { animation: 'blink 0.18s steps(1) 4', boxShadow: '0 0 6px rgba(47,211,122,0.7)' } : undefined}
                        />
                        <span className="text-[9px] font-bold tracking-[0.3em] engrave-dark">ACCESS</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
