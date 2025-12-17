import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FILMS } from './data/cameraData';
import CameraStyles from './components/ui/CameraStyles';
import MonitorBody from './components/layout/MonitorBody';
import GripControls from './components/layout/GripControls';

export default function CameraPortfolio() {
    const ACCESS_TOKEN = 'test'; // 👈 change this to anything

    const params = new URLSearchParams(window.location.search);
    const allowed =
        location.hostname === 'localhost' || params.get('access') === ACCESS_TOKEN;
        //params.get('access') === ACCESS_TOKEN;

    if (!allowed) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <h1 className="text-xl font-semibold">Access restricted</h1>
            </div>
        );
    }
    const [view, setView] = useState('viewfinder');
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [time, setTime] = useState(new Date());
    const [isRecording, setIsRecording] = useState(true);
    const [activeButton, setActiveButton] = useState(null);
    const [bootSequence, setBootSequence] = useState(true);
    const [powerOn, setPowerOn] = useState(true);

    // Navigation State
    const [osdMode, setOsdMode] = useState(0);
    const [galleryFocusIndex, setGalleryFocusIndex] = useState(null); // CHANGED: Start as null
    const [gridMode, setGridMode] = useState(2);

    // New Features State
    const [isSelfieMode, setIsSelfieMode] = useState(false);
    const [webcamStream, setWebcamStream] = useState(null);
    const [navHint, setNavHint] = useState(null); // For UI instructions

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Boot
    useEffect(() => {
        if (powerOn && bootSequence) {
            const timer = setTimeout(() => setBootSequence(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [powerOn, bootSequence]);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const togglePower = () => {
        if (!powerOn) {
            setBootSequence(true);
            setIsRecording(true);
            setPowerOn(true);
        } else {
            setIsRecording(false);
            setPowerOn(false);
            // Stop webcam if on
            if (webcamStream) {
                webcamStream.getTracks().forEach(track => track.stop());
                setWebcamStream(null);
                setIsSelfieMode(false);
            }
        }
    };

    // --- NEW: Selfie Logic ---
    const toggleSelfie = async () => {
        if (!powerOn) return;

        if (isSelfieMode) {
            // Turn off
            if (webcamStream) {
                webcamStream.getTracks().forEach(track => track.stop());
            }
            setWebcamStream(null);
            setIsSelfieMode(false);
            setNavHint("LENS INPUT ACTIVE");
        } else {
            // Turn on
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setWebcamStream(stream);
                setIsSelfieMode(true);
                setNavHint("SELFIE MODE ACTIVE");
            } catch (err) {
                console.error("Camera access denied:", err);
                setNavHint("CAMERA ACCESS DENIED");
            }
        }
        // Clear hint after 2s
        setTimeout(() => setNavHint(null), 2000);
    };

    // --- Navigation Logic ---

    const handlePress = useCallback((btnName, action) => {
        if (!powerOn && btnName !== 'power') return;
        setActiveButton(btnName);
        setTimeout(() => setActiveButton(null), 150);
        if (action) action();
    }, [powerOn]);

    const toggleGallery = () => {
        if (view === 'gallery' || view === 'detail') {
            setView('viewfinder');
            setSelectedFilm(null);
        } else {
            setView('gallery');
            setGalleryFocusIndex(null); // Reset selection when opening
        }
    };

    const toggleInfo = () => {
        setView(prev => prev === 'info' ? 'viewfinder' : 'info');
    };

    const handleDispBack = () => {
        if (view === 'viewfinder') {
            setOsdMode((prev) => (prev + 1) % 4);
        } else if (view === 'detail') {
            setView('gallery');
            setSelectedFilm(null);
        } else {
            setView('viewfinder');
            setSelectedFilm(null);
        }
    };

    const toggleGridMode = () => {
        setGridMode(prev => prev === 2 ? 3 : 2);
    };

    // Updated D-Pad Logic
    const handleDirection = (dir) => {
        // 1. Viewfinder Mode: Show Instructions
        if (view === 'viewfinder') {
            setNavHint("PRESS [PLAY] FOR GALLERY");
            setTimeout(() => setNavHint(null), 2000);
            return;
        }

        // 2. Gallery Mode: Selection Logic
        if (view === 'gallery') {
            // If nothing is selected yet, select the first one on any key press
            if (galleryFocusIndex === null) {
                setGalleryFocusIndex(0);
                return;
            }

            const isMobile = window.innerWidth < 768;
            const cols = isMobile ? 1 : gridMode;

            if (dir === 'left') setGalleryFocusIndex(prev => Math.max(0, prev - 1));
            if (dir === 'right') setGalleryFocusIndex(prev => Math.min(FILMS.length - 1, prev + 1));
            if (dir === 'down') setGalleryFocusIndex(prev => Math.min(FILMS.length - 1, prev + cols));
            if (dir === 'up') setGalleryFocusIndex(prev => Math.max(0, prev - cols));
        }
    }

    const handleOk = () => {
        if (view === 'gallery' && galleryFocusIndex !== null) {
            setSelectedFilm(FILMS[galleryFocusIndex]);
            setView('detail');
        } else if (view === 'viewfinder') {
            // Take photo logic could go here
            setNavHint("IMAGE CAPTURED");
            setTimeout(() => setNavHint(null), 1000);
        }
    };

    const selectFilm = (film) => {
        setSelectedFilm(film);
        setView('detail');
    };

    return (
        <div className="h-[100dvh] w-full bg-[#121212] font-sans overflow-hidden select-none touch-none">
            <CameraStyles />
            <div className="relative w-full h-full texture-body flex flex-col md:flex-row overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/60 pointer-events-none"></div>

                <MonitorBody
                    powerOn={powerOn}
                    bootSequence={bootSequence}
                    view={view}
                    osdMode={osdMode}
                    time={time}
                    isRecording={isRecording}
                    formatTime={formatTime}
                    galleryFocusIndex={galleryFocusIndex}
                    gridMode={gridMode}
                    toggleGridMode={toggleGridMode}
                    selectFilm={selectFilm}
                    selectedFilm={selectedFilm}
                    handleBack={handleDispBack}
                    webcamStream={webcamStream} // Pass stream
                    navHint={navHint} // Pass hint
                    toggleSelfie={toggleSelfie} // Pass toggle
                />

                <GripControls
                    handlePress={handlePress}
                    handleDirection={handleDirection}
                    handleOk={handleOk}
                    toggleGallery={toggleGallery}
                    toggleInfo={toggleInfo}
                    togglePower={togglePower}
                    toggleSelfie={toggleSelfie} // NEW PROP
                    isSelfieMode={isSelfieMode} // NEW PROP
                    handleDispBack={handleDispBack}
                    activeButton={activeButton}
                    view={view}
                    powerOn={powerOn}
                />
            </div>
        </div>
    );
}