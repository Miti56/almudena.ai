import React, { useEffect, useRef } from 'react';

// Running HH:MM:SS:FF timecode (24 fps). Writes to the DOM directly to avoid 24 re-renders a second.
export default function Timecode({ className = '', running = true }) {
    const ref = useRef(null);

    useEffect(() => {
        if (!running) return;
        let id;
        const pad = (n) => String(n).padStart(2, '0');
        const loop = () => {
            const d = new Date();
            const ff = Math.floor((d.getMilliseconds() / 1000) * 24);
            if (ref.current) {
                ref.current.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}:${pad(ff)}`;
            }
            id = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(id);
    }, [running]);

    return <span ref={ref} className={`font-mono tabular ${className}`}>00:00:00:00</span>;
}
