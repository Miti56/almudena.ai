import { useEffect, useState } from 'react';

const BINS = 48;
const W = 96;
const H = 54;
const cache = new Map();

function compute(source) {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const c2d = canvas.getContext('2d', { willReadFrequently: true });
    c2d.drawImage(source, 0, 0, W, H);
    const { data } = c2d.getImageData(0, 0, W, H);
    const r = new Array(BINS).fill(0);
    const g = new Array(BINS).fill(0);
    const b = new Array(BINS).fill(0);
    for (let i = 0; i < data.length; i += 4) {
        r[(data[i] * BINS) >> 8]++;
        g[(data[i + 1] * BINS) >> 8]++;
        b[(data[i + 2] * BINS) >> 8]++;
    }
    const smooth = (arr) => arr.map((_, i) => (arr[i - 1] ?? arr[i]) * 0.25 + arr[i] * 0.5 + (arr[i + 1] ?? arr[i]) * 0.25);
    const channels = [smooth(r), smooth(g), smooth(b)];
    const max = Math.max(...channels.flat()) || 1;
    // sqrt scaling reads closer to an in-camera histogram than linear
    return channels.map((arr) => arr.map((v) => Math.sqrt(v / max)));
}

/**
 * Real RGB histogram of the image at `src`, or of the live `videoRef` element when `live` is set.
 * Returns [r, g, b] arrays of 0..1 values, or null while loading.
 */
export default function useHistogram(src, videoRef, live) {
    const [liveHist, setLiveHist] = useState(null);
    const [loads, setLoaded] = useState(0);

    useEffect(() => {
        if (live) {
            const id = setInterval(() => {
                const video = videoRef?.current;
                if (video && video.readyState >= 2) {
                    try {
                        setLiveHist(compute(video));
                    } catch {
                        /* ignore frame read errors */
                    }
                }
            }, 350);
            return () => clearInterval(id);
        }
        if (!src || cache.has(src)) return;
        let cancelled = false;
        const img = new Image();
        img.onload = () => {
            try {
                cache.set(src, compute(img));
                if (!cancelled) setLoaded((n) => n + 1);
            } catch {
                /* decode failure */
            }
        };
        img.src = src;
        return () => {
            cancelled = true;
        };
    }, [src, live, videoRef]);

    if (live) return liveHist;
    // `loads` keeps this read reactive to async cache fills (the compiler memoizes on it)
    return loads >= 0 && src ? cache.get(src) || null : null;
}
