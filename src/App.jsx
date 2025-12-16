import React, { useState, useEffect, useCallback } from 'react';
import { FILMS } from './data/cameraData';
import CameraStyles from './components/ui/CameraStyles';
import MonitorBody from './components/layout/MonitorBody';
import GripControls from './components/layout/GripControls';

export default function CameraPortfolio() {
    const [view, setView] = useState('viewfinder'); // viewfinder, gallery, info, detail
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [time, setTime] = useState(new Date());
    const [isRecording, setIsRecording] = useState(true);
    const [activeButton, setActiveButton] = useState(null);
    const [bootSequence, setBootSequence] = useState(true);
    const [powerOn, setPowerOn] = useState(true);

    // Navigation State
    // 0: Standard, 1: Grids/Safe, 2: Clean, 3: Status Dashboard
    const [osdMode, setOsdMode] = useState(0);
    const [galleryFocusIndex, setGalleryFocusIndex] = useState(0);
    const [gridMode, setGridMode] = useState(2); // 2 for 2x2, 3 for 3x3

    // Clock Effect
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Boot Sequence Effect
    useEffect(() => {
        if (powerOn) {
            setBootSequence(true);
            const timer = setTimeout(() => setBootSequence(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [powerOn]);

    // Format Time
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const togglePower = () => {
        setPowerOn(!powerOn);
        if (powerOn) setIsRecording(false);
        else setIsRecording(true);
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
            setGalleryFocusIndex(0);
        }
    };

    const toggleInfo = () => {
        if (view === 'info') {
            setView('viewfinder');
        } else {
            setView('info');
        }
    };

    // DISP/BACK Button Logic
    const handleDispBack = () => {
        if (view === 'viewfinder') {
            // Cycle OSD modes: Standard -> Grids -> Clean -> Status Dashboard
            setOsdMode((prev) => (prev + 1) % 4);
        } else if (view === 'detail') {
            // Go back to Gallery
            setView('gallery');
            setSelectedFilm(null);
        } else {
            // Go back to Viewfinder (from Gallery or Info)
            setView('viewfinder');
            setSelectedFilm(null);
        }
    };

    const toggleGridMode = () => {
        setGridMode(prev => prev === 2 ? 3 : 2);
    };

    // D-Pad Navigation Logic
    // D-Pad Navigation Logic
    const handleDirection = (dir) => {
        if (view === 'gallery') {
            // FIX: Detect if we are on mobile (less than 768px matches Tailwind 'md')
            const isMobile = window.innerWidth < 768;

            // If mobile, effective columns is 1. If desktop, use the selected gridMode.
            const cols = isMobile ? 1 : gridMode;

            // Logic remains the same, but 'cols' is now dynamic based on screen size
            if (dir === 'left') setGalleryFocusIndex(prev => Math.max(0, prev - 1));
            if (dir === 'right') setGalleryFocusIndex(prev => Math.min(FILMS.length - 1, prev + 1));

            // Up/Down now respects the visual layout
            if (dir === 'down') setGalleryFocusIndex(prev => Math.min(FILMS.length - 1, prev + cols));
            if (dir === 'up') setGalleryFocusIndex(prev => Math.max(0, prev - cols));
        }
    }

    const handleOk = () => {
        if (view === 'gallery') {
            setSelectedFilm(FILMS[galleryFocusIndex]);
            setView('detail');
        } else if (view === 'viewfinder') {
            // Could open a quick menu in future
        }
    };

    const selectFilm = (film) => {
        setSelectedFilm(film);
        setView('detail');
    };

    return (
        <div className="h-screen w-full bg-[#121212] font-sans overflow-hidden select-none">
            <CameraStyles />
            <div className="relative w-full h-full texture-body flex flex-col md:flex-row overflow-hidden">
                {/* Subtle Gradient Overlay */}
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
                />

                <GripControls
                    handlePress={handlePress}
                    handleDirection={handleDirection}
                    handleOk={handleOk}
                    toggleGallery={toggleGallery}
                    toggleInfo={toggleInfo}
                    togglePower={togglePower}
                    handleDispBack={handleDispBack}
                    activeButton={activeButton}
                    view={view}
                    powerOn={powerOn}
                />
            </div>
        </div>
    );
}