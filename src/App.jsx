import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FILMS } from './data/cameraData';
import { INFO_TAB_COUNT } from './lib/camera';
import { shutterSound } from './lib/sfx';
import MonitorBody from './components/layout/MonitorBody';
import GripControls from './components/layout/GripControls';

const BOOT_MS = 3200;

function TopPlate() {
    return (
        <div className="hidden md:flex relative shrink-0 h-12 mat-silver items-center px-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-2.5">
                <span className="w-[7px] h-[7px] bg-rec shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)]" />
                <span className="text-[15px] font-[800] uppercase tracking-[0.32em] engrave-light" style={{ fontStretch: '125%' }}>
                    Almudena
                </span>
            </div>
            {/* hot shoe */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-44 h-7 rounded-t-[3px] bg-gradient-to-b from-[#2a2a2a] to-[#111] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_-1px_0_rgba(0,0,0,0.4)] flex items-end justify-center pb-1.5 gap-1.5">
                {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className="w-[5px] h-[3px] rounded-[1px] bg-gradient-to-b from-[#d6b25e] to-[#8a6a28]" />
                ))}
            </div>
            <div className="ml-auto flex items-center gap-4 text-[10px] font-bold tracking-[0.3em] engrave-light" style={{ fontStretch: '115%' }}>
                <span>MIRONES RIOTTE</span>
                <span className="w-px h-3 bg-black/25" />
                <span>DIRECTORA · GUIONISTA</span>
            </div>
            {/* chamfer */}
            <div className="absolute inset-x-0 -bottom-[5px] h-[5px] bg-gradient-to-b from-[#6f6e69] to-[#1d1d1d] z-10" />
        </div>
    );
}

export default function CameraPortfolio() {
    const [view, setView] = useState('viewfinder');
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [activeButton, setActiveButton] = useState(null);
    const [bootSequence, setBootSequence] = useState(true);
    const [powerOn, setPowerOn] = useState(true);

    // Navigation
    const [liveIndex, setLiveIndex] = useState(0);
    const [galleryFocusIndex, setGalleryFocusIndex] = useState(null);
    const [gridMode, setGridMode] = useState(2);
    const [infoTab, setInfoTab] = useState(0);

    // Camera
    const [isSelfieMode, setIsSelfieMode] = useState(false);
    const [webcamStream, setWebcamStream] = useState(null);
    const [navHint, setNavHint] = useState(null);
    const [shutterTick, setShutterTick] = useState(0);
    const [frames, setFrames] = useState(842);

    const hintTimer = useRef(null);
    const pressTimer = useRef(null);

    // Boot
    useEffect(() => {
        if (powerOn && bootSequence) {
            const timer = setTimeout(() => setBootSequence(false), BOOT_MS);
            return () => clearTimeout(timer);
        }
    }, [powerOn, bootSequence]);

    const showHint = (msg, ms = 2000) => {
        clearTimeout(hintTimer.current);
        setNavHint(msg);
        hintTimer.current = setTimeout(() => setNavHint(null), ms);
    };
    const showInstructions = () => showHint('HELP_MENU', 3800);

    // Always release the webcam when leaving selfie mode
    const stopSelfieMode = () => {
        if (webcamStream) webcamStream.getTracks().forEach((track) => track.stop());
        setWebcamStream(null);
        setIsSelfieMode(false);
    };

    const nextLive = useCallback(() => setLiveIndex((i) => (i + 1) % FILMS.length), []);
    const prevLive = useCallback(() => setLiveIndex((i) => (i - 1 + FILMS.length) % FILMS.length), []);

    const openFilm = (film) => {
        setSelectedFilm(film);
        setView('detail');
    };
    const openLive = () => openFilm(FILMS[liveIndex]);

    const togglePower = () => {
        if (!powerOn) {
            setBootSequence(true);
            setPowerOn(true);
        } else {
            setPowerOn(false);
            setView('viewfinder');
            setSelectedFilm(null);
            setNavHint(null);
            stopSelfieMode();
        }
    };

    const startSelfie = async () => {
        setView('viewfinder');
        setSelectedFilm(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            setWebcamStream(stream);
            setIsSelfieMode(true);
            showHint('SELFIE MODE');
        } catch (err) {
            console.error('Camera access denied:', err);
            showHint('CAMERA ACCESS DENIED');
        }
    };

    const toggleSelfie = () => {
        if (!powerOn) return;
        if (isSelfieMode) {
            stopSelfieMode();
            showHint('LENS INPUT');
        } else {
            startSelfie();
        }
    };

    const handlePress = (btnName, action) => {
        if (!powerOn && btnName !== 'power') return;
        clearTimeout(pressTimer.current);
        setActiveButton(btnName);
        pressTimer.current = setTimeout(() => setActiveButton(null), 150);
        if (action) action();
    };

    const toggleGallery = () => {
        if (isSelfieMode) stopSelfieMode();
        if (view === 'gallery' || view === 'detail') {
            setView('viewfinder');
            setSelectedFilm(null);
        } else {
            setView('gallery');
            setGalleryFocusIndex(liveIndex);
        }
    };

    const toggleInfo = () => {
        if (isSelfieMode) stopSelfieMode();
        setView((prev) => (prev === 'info' ? 'viewfinder' : 'info'));
    };

    // Mode dial: jump straight to a mode
    const mode = isSelfieMode ? 'selfie' : view === 'gallery' || view === 'detail' ? 'play' : view === 'info' ? 'info' : 'live';
    const setMode = (next) => {
        if (!powerOn || next === mode) return;
        if (next === 'selfie') {
            startSelfie();
            return;
        }
        if (isSelfieMode) stopSelfieMode();
        setSelectedFilm(null);
        if (next === 'live') setView('viewfinder');
        if (next === 'info') setView('info');
        if (next === 'play') {
            setView('gallery');
            setGalleryFocusIndex(liveIndex);
        }
    };

    const handleDispBack = () => {
        if (isSelfieMode) {
            stopSelfieMode();
            showHint('LENS INPUT');
            return;
        }
        if (view === 'detail') {
            setView('gallery');
            setSelectedFilm(null);
        } else if (view !== 'viewfinder') {
            setView('viewfinder');
            setSelectedFilm(null);
        } else {
            showInstructions();
        }
    };

    // Like a real camera: a half-press from playback/menus returns to shooting; otherwise take a frame
    const handleShutter = () => {
        if (!powerOn || bootSequence) return;
        if (view !== 'viewfinder') {
            setView('viewfinder');
            setSelectedFilm(null);
            return;
        }
        shutterSound();
        setShutterTick((t) => t + 1);
        setFrames((f) => Math.max(0, f - 1));
        if (!isSelfieMode) setTimeout(nextLive, 110); // cut while the iris is shut
    };

    const toggleGridMode = () => setGridMode((prev) => (prev === 2 ? 3 : 2));

    const handleDirection = (dir) => {
        if (view === 'viewfinder') {
            if (!isSelfieMode && dir === 'left') prevLive();
            else if (!isSelfieMode && dir === 'right') nextLive();
            else showInstructions();
            return;
        }
        if (view === 'info') {
            if (dir === 'left') setInfoTab((t) => (t - 1 + INFO_TAB_COUNT) % INFO_TAB_COUNT);
            if (dir === 'right') setInfoTab((t) => (t + 1) % INFO_TAB_COUNT);
            return;
        }
        if (view === 'gallery') {
            if (galleryFocusIndex === null) {
                setGalleryFocusIndex(0);
                return;
            }
            const cols = window.innerWidth < 768 ? 1 : gridMode;
            if (dir === 'left') setGalleryFocusIndex((prev) => Math.max(0, prev - 1));
            if (dir === 'right') setGalleryFocusIndex((prev) => Math.min(FILMS.length - 1, prev + 1));
            if (dir === 'down') setGalleryFocusIndex((prev) => Math.min(FILMS.length - 1, prev + cols));
            if (dir === 'up') setGalleryFocusIndex((prev) => Math.max(0, prev - cols));
        }
    };

    const handleOk = () => {
        if (view === 'gallery' && galleryFocusIndex !== null) openFilm(FILMS[galleryFocusIndex]);
        else if (view === 'viewfinder') {
            if (isSelfieMode) handleShutter();
            else openLive();
        }
    };

    // Keyboard control (desktop)
    const onKey = useRef(null);
    useEffect(() => {
        onKey.current = (e) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const inPlayer = e.target instanceof HTMLVideoElement || view === 'detail';
            const dirs = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
            if (dirs[e.key] && !inPlayer) {
                e.preventDefault();
                handlePress(dirs[e.key], () => handleDirection(dirs[e.key]));
            } else if (e.key === 'Enter' && !inPlayer) {
                e.preventDefault();
                handlePress('ok', handleOk);
            } else if (e.key === 'Escape' || e.key === 'Backspace') {
                handlePress('back', handleDispBack);
            } else if (e.key === ' ' && !inPlayer) {
                e.preventDefault();
                handleShutter();
            } else if (e.key === 'p' || e.key === 'P') {
                handlePress('gallery', toggleGallery);
            } else if (e.key === 'i' || e.key === 'I') {
                handlePress('info', toggleInfo);
            }
        };
    });
    useEffect(() => {
        const listener = (e) => onKey.current?.(e);
        window.addEventListener('keydown', listener);
        return () => window.removeEventListener('keydown', listener);
    }, []);

    return (
        <div className="h-[100dvh] w-full studio-backdrop overflow-hidden select-none touch-none flex items-center justify-center md:p-5 lg:p-8">
            {/* Camera body */}
            <div className="relative w-full h-full md:max-w-[1680px] flex flex-col md:rounded-[26px] overflow-hidden bg-body md:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9),0_30px_60px_-30px_rgba(0,0,0,0.8),0_0_0_1px_rgba(0,0,0,0.9)] animate-[pop_0.8s_cubic-bezier(0.16,1,0.3,1)_both]">
                <TopPlate />

                <div className="relative flex-1 min-h-0 flex flex-col md:flex-row mat-leather">
                    <MonitorBody
                        powerOn={powerOn}
                        bootSequence={bootSequence}
                        view={view}
                        liveIndex={liveIndex}
                        onLiveNext={nextLive}
                        onLivePrev={prevLive}
                        openLive={openLive}
                        isSelfieMode={isSelfieMode}
                        webcamStream={webcamStream}
                        navHint={navHint}
                        shutterTick={shutterTick}
                        frames={frames}
                        galleryFocusIndex={galleryFocusIndex}
                        setGalleryFocusIndex={setGalleryFocusIndex}
                        gridMode={gridMode}
                        toggleGridMode={toggleGridMode}
                        selectFilm={openFilm}
                        selectedFilm={selectedFilm}
                        handleBack={handleDispBack}
                        infoTab={infoTab}
                        setInfoTab={setInfoTab}
                    />

                    <GripControls
                        handlePress={handlePress}
                        handleDirection={handleDirection}
                        handleOk={handleOk}
                        toggleGallery={toggleGallery}
                        toggleInfo={toggleInfo}
                        togglePower={togglePower}
                        toggleSelfie={toggleSelfie}
                        handleShutter={handleShutter}
                        setMode={setMode}
                        mode={mode}
                        isSelfieMode={isSelfieMode}
                        handleDispBack={handleDispBack}
                        activeButton={activeButton}
                        view={view}
                        powerOn={powerOn}
                    />
                </div>

                {/* body edge highlight */}
                <div className="hidden md:block absolute inset-0 rounded-[26px] pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_0_1px_rgba(255,255,255,0.04)] z-30" />
            </div>
        </div>
    );
}
