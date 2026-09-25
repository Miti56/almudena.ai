import React, { useEffect, useRef } from 'react';

// A 9-blade lens iris drawn as a pinwheel around a rotating nonagon hole.
// Paths are written straight to the DOM each frame so animation never re-renders React.
const BLADES = 9;
const MAX_R = 96;
const FAR = 420;
const STEP = (2 * Math.PI) / BLADES;

const pt = (x, y) => `${x.toFixed(2)} ${y.toFixed(2)}`;

function bladePaths(a) {
    const r = a * MAX_R;
    const rot = (1 - a) * 1.25; // blades swirl as they close
    const v = [];
    const e = [];
    for (let i = 0; i < BLADES; i++) {
        const t = rot + i * STEP - Math.PI / 2;
        v.push([50 + r * Math.cos(t), 50 + r * Math.sin(t)]);
        const m = rot + (i + 0.5) * STEP - Math.PI / 2;
        e.push([-Math.sin(m), Math.cos(m)]); // direction of edge v[i] -> v[i+1]
    }
    const blades = [];
    for (let i = 0; i < BLADES; i++) {
        const a1 = v[(i + 1) % BLADES];
        const a2 = v[(i + 2) % BLADES];
        const d1 = e[i];
        const d2 = e[(i + 1) % BLADES];
        blades.push(
            `M${pt(...a1)} L${pt(a1[0] + d1[0] * FAR, a1[1] + d1[1] * FAR)} ` +
            `L${pt(a2[0] + d2[0] * FAR, a2[1] + d2[1] * FAR)} L${pt(...a2)} Z`
        );
    }
    const hole = `M${v.map((p) => pt(...p)).join(' L')} Z`;
    return { blades, hole };
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export default function Iris({ open, snapKey = 0, className = '' }) {
    const svgRef = useRef(null);
    const bladeRefs = useRef([]);
    const holeRef = useRef(null);
    const value = useRef(open ? 1 : 0);
    const frame = useRef(0);
    const lastSnap = useRef(snapKey);

    const draw = (a) => {
        value.current = a;
        const { blades, hole } = bladePaths(a);
        blades.forEach((d, i) => bladeRefs.current[i]?.setAttribute('d', d));
        holeRef.current?.setAttribute('d', hole);
        if (svgRef.current) svgRef.current.style.visibility = a >= 0.999 ? 'hidden' : 'visible';
    };

    const animate = (segments) => {
        cancelAnimationFrame(frame.current);
        let seg = 0;
        let from = value.current;
        let start = performance.now();
        const stepFn = (now) => {
            const { to, ms, ease } = segments[seg];
            const t = Math.min(1, (now - start) / ms);
            draw(from + (to - from) * ease(t));
            if (t < 1) {
                frame.current = requestAnimationFrame(stepFn);
            } else if (++seg < segments.length) {
                from = to;
                start = now;
                frame.current = requestAnimationFrame(stepFn);
            }
        };
        frame.current = requestAnimationFrame(stepFn);
    };

    useEffect(() => {
        draw(value.current);
        return () => cancelAnimationFrame(frame.current);
    }, []);

    useEffect(() => {
        animate([{ to: open ? 1 : 0, ms: open ? 1100 : 520, ease: easeInOut }]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        if (snapKey === lastSnap.current) return;
        lastSnap.current = snapKey;
        if (!open) return;
        animate([
            { to: 0, ms: 90, ease: easeOut },
            { to: 0, ms: 40, ease: easeOut },
            { to: 1, ms: 320, ease: easeOut },
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapKey]);

    return (
        <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
            className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="iris-sheen" cx="50" cy="50" r="70" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#3a3a3a" />
                    <stop offset="0.35" stopColor="#161616" />
                    <stop offset="1" stopColor="#070707" />
                </radialGradient>
            </defs>
            <g>
                {Array.from({ length: BLADES }, (_, i) => (
                    <path
                        key={i}
                        ref={(el) => (bladeRefs.current[i] = el)}
                        fill="url(#iris-sheen)"
                        fillOpacity={i % 2 ? 1 : 0.92}
                        stroke="#4a4a4a"
                        strokeOpacity="0.55"
                        strokeWidth="0.22"
                        strokeLinejoin="round"
                    />
                ))}
                <path ref={holeRef} fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.3" />
            </g>
        </svg>
    );
}
