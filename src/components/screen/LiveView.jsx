import React, { useEffect, useState } from 'react';
import { FILMS } from '../../data/cameraData';
import { AUTOPLAY_MS } from '../../lib/camera';

// The "sensor feed": film stills cross-dissolving with a slow Ken Burns push.
export default function LiveView({ index, active, onNext, dimmed }) {
    const [broken, setBroken] = useState({});

    useEffect(() => {
        if (!active) return;
        const id = setTimeout(onNext, AUTOPLAY_MS);
        return () => clearTimeout(id);
    }, [active, index, onNext]);

    return (
        <div
            className={`absolute inset-0 bg-[#050505] overflow-hidden transition-[filter,transform] duration-700 ease-out ${
                dimmed ? 'blur-md brightness-[0.35] scale-105' : ''
            }`}
        >
            {FILMS.map((film, i) => {
                const isActive = i === index;
                return (
                    <div
                        key={film.id}
                        className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
                        aria-hidden={!isActive}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${film.color}`} />
                        {!broken[film.id] && (
                            <img
                                src={film.src}
                                alt=""
                                draggable={false}
                                onError={() => setBroken((b) => ({ ...b, [film.id]: true }))}
                                className="absolute inset-0 w-full h-full object-cover will-change-transform"
                                style={{
                                    animation: isActive
                                        ? `${i % 2 ? 'kenburns-b' : 'kenburns-a'} ${AUTOPLAY_MS + 3000}ms linear both`
                                        : 'none',
                                }}
                            />
                        )}
                    </div>
                );
            })}

            {/* Lens character: vignette + gentle falloff at the bottom for OSD legibility */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-1/4 pointer-events-none bg-gradient-to-b from-black/50 to-transparent" />
        </div>
    );
}
