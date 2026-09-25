// Tiny synthesized camera sounds (no audio assets). Only ever called from user gestures.
let ctx = null;

function getCtx() {
    try {
        if (!ctx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            ctx = new AC();
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    } catch {
        return null;
    }
}

function tone(ac, freq, start, duration, gain) {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain, start + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(g).connect(ac.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
}

function click(ac, start, gain, cutoff) {
    const len = Math.floor(ac.sampleRate * 0.03);
    const buffer = ac.createBuffer(1, len, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = cutoff;
    filter.Q.value = 0.8;
    const g = ac.createGain();
    g.gain.value = gain;
    src.connect(filter).connect(g).connect(ac.destination);
    src.start(start);
}

/** Double "pi-pi" focus-confirm beep. */
export function afBeep() {
    const ac = getCtx();
    if (!ac) return;
    const t = ac.currentTime;
    tone(ac, 2900, t, 0.05, 0.03);
    tone(ac, 2900, t + 0.075, 0.05, 0.03);
}

/** Two-curtain mechanical shutter. */
export function shutterSound() {
    const ac = getCtx();
    if (!ac) return;
    const t = ac.currentTime;
    click(ac, t, 0.5, 2400);
    click(ac, t + 0.055, 0.35, 1600);
}

/** Soft detent tick for dials. */
export function tick() {
    const ac = getCtx();
    if (!ac) return;
    click(ac, ac.currentTime, 0.12, 5200);
}
