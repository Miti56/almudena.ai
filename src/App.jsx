import React, { useState, useEffect, useCallback } from 'react';
import { FILMS } from './data/cameraData'; // Ensure this path is correct
import CameraStyles from './components/ui/CameraStyles';
import MonitorBody from './components/layout/MonitorBody';
import GripControls from './components/layout/GripControls';

export default function CameraPortfolio() {
    // ... (Keep all your existing State logic exactly the same: view, selectedFilm, time, etc.)
    const [view, setView] = useState('viewfinder');
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [time, setTime] = useState(new Date());
    const [isRecording, setIsRecording] = useState(true);
    const [activeButton, setActiveButton] = useState(null);
    const [bootSequence, setBootSequence] = useState(true);
    const [powerOn, setPowerOn] = useState(true);
    const [osdMode, setOsdMode] = useState(0);
    const [galleryFocusIndex, setGalleryFocusIndex] = useState(0);
    const [gridMode, setGridMode] = useState(2);

    // ... (Keep your existing useEffects and handlers: formatTime, togglePower, etc.)
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

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
        }
    };

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

    const handleDirection = (dir) => {
        if (view === 'gallery') {
            const isMobile = window.innerWidth < 768;
            const cols = isMobile ? 1 : gridMode;
            if (dir === 'left') setGalleryFocusIndex(prev => Math.max(0, prev - 1));
            if (dir === 'right') setGalleryFocusIndex(prev => Math.min(FILMS.length - 1, prev + 1));
            if (dir === 'down') setGalleryFocusIndex(prev => Math.min(FILMS.length - 1, prev + cols));
            if (dir === 'up') setGalleryFocusIndex(prev => Math.max(0, prev - cols));
        }
    }

    const handleOk = () => {
        if (view === 'gallery') {
            setSelectedFilm(FILMS[galleryFocusIndex]);
            setView('detail');
        }
    };

    const selectFilm = (film) => {
        setSelectedFilm(film);
        setView('detail');
    };

    return (
        // CHANGED: h-[100dvh] for mobile browsers, added touch-none to prevent drag-scrolling the app shell
        <div className="h-[100dvh] w-full bg-[#121212] font-sans overflow-hidden select-none touch-none">
            <CameraStyles />
            <div className="relative w-full h-full texture-body flex flex-col md:flex-row overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/60 pointer-events-none"></div>

                {/* MonitorBody takes remaining space */}
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

                {/* GripControls is fixed height on mobile or auto on desktop */}
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