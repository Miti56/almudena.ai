import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FILMS } from './data/cameraData';
import CameraStyles from './components/ui/CameraStyles';
import MonitorBody from './components/layout/MonitorBody';
import GripControls from './components/layout/GripControls';

export default function CameraPortfolio() {
    const [view, setView] = useState('viewfinder');
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [time, setTime] = useState(new Date());
    const [isRecording, setIsRecording] = useState(true);
    const [activeButton, setActiveButton] = useState(null);
    const [bootSequence, setBootSequence] = useState(true);
    const [powerOn, setPowerOn] = useState(true);

    // Navigation State
    const [galleryFocusIndex, setGalleryFocusIndex] = useState(null);
    const [gridMode, setGridMode] = useState(2);

    // New Features State
    const [isSelfieMode, setIsSelfieMode] = useState(false);
    const [webcamStream, setWebcamStream] = useState(null);
    const [navHint, setNavHint] = useState(null);

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Boot
    useEffect(() => {
        if (powerOn && bootSequence) {
            const timer = setTimeout(() => setBootSequence(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [powerOn, bootSequence]);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    // --- Helper: Show All Instructions ---
    const showInstructions = () => {
        setNavHint('HELP_MENU');
        setTimeout(() => setNavHint(null), 3500);
    };

    // --- Helper: Stop Selfie Mode Cleanly ---
    // We use this to ensure the webcam is turned off whenever we leave the mode
    const stopSelfieMode = () => {
        if (webcamStream) {
            webcamStream.getTracks().forEach(track => track.stop());
        }
        setWebcamStream(null);
        setIsSelfieMode(false);
    };

    const togglePower = () => {
        if (!powerOn) {
            setBootSequence(true);
            setIsRecording(true);
            setPowerOn(true);
        } else {
            setIsRecording(false);
            setPowerOn(false);
            setView('viewfinder');
            setSelectedFilm(null);
            stopSelfieMode();
        }
    };

    // --- Selfie Logic ---
    const toggleSelfie = async () => {
        if (!powerOn) return;

        if (isSelfieMode) {
            // Turn off
            stopSelfieMode();
            setNavHint("LENS INPUT ACTIVE");
        } else {
            // Turn on
            // Ensure we are in viewfinder first
            setView('viewfinder');
            setSelectedFilm(null);

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
        // UPDATED: Check for selfie mode and stop it
        if (isSelfieMode) {
            stopSelfieMode();
        }

        if (view === 'gallery' || view === 'detail') {
            setView('viewfinder');
            setSelectedFilm(null);
        } else {
            setView('gallery');
            setGalleryFocusIndex(null);
        }
    };

    const toggleInfo = () => {
        // UPDATED: Check for selfie mode and stop it
        if (isSelfieMode) {
            stopSelfieMode();
        }

        setView(prev => prev === 'info' ? 'viewfinder' : 'info');
    };

    const handleDispBack = () => {
        // 1. If Selfie Mode is ON, turn it OFF
        if (isSelfieMode) {
            stopSelfieMode(); // Use helper
            setNavHint("LENS INPUT ACTIVE");
            setTimeout(() => setNavHint(null), 2000);
            return;
        }

        // 2. Standard Navigation
        if (view === 'detail') {
            setView('gallery');
            setSelectedFilm(null);
        }
        else if (view !== 'viewfinder') {
            setView('viewfinder');
            setSelectedFilm(null);
        }
        // 3. If in Viewfinder (Main Menu), Show Help Overlay
        else if (view === 'viewfinder') {
            showInstructions();
        }
    };

    const toggleGridMode = () => {
        setGridMode(prev => prev === 2 ? 3 : 2);
    };

    const handleDirection = (dir) => {
        // 1. Viewfinder Mode: Show Help Overlay
        if (view === 'viewfinder') {
            showInstructions();
            return;
        }

        // 2. Gallery Mode: Selection Logic
        if (view === 'gallery') {
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
        }
        else if (view === 'viewfinder') {
            showInstructions();
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
                    time={time}
                    isRecording={isRecording}
                    formatTime={formatTime}
                    galleryFocusIndex={galleryFocusIndex}
                    gridMode={gridMode}
                    toggleGridMode={toggleGridMode}
                    selectFilm={selectFilm}
                    selectedFilm={selectedFilm}
                    handleBack={handleDispBack}
                    webcamStream={webcamStream}
                    navHint={navHint}
                    toggleSelfie={toggleSelfie}
                />

                <GripControls
                    handlePress={handlePress}
                    handleDirection={handleDirection}
                    handleOk={handleOk}
                    toggleGallery={toggleGallery}
                    toggleInfo={toggleInfo}
                    togglePower={togglePower}
                    toggleSelfie={toggleSelfie}
                    isSelfieMode={isSelfieMode}
                    handleDispBack={handleDispBack}
                    activeButton={activeButton}
                    view={view}
                    powerOn={powerOn}
                />
            </div>
        </div>
    );
}