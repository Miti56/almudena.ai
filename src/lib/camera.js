// Film-simulation "look" shown in the OSD for each film. Purely decorative: images are never re-graded.
const SIMS = [
    { code: 'E', name: 'ETERNA' },
    { code: 'CC', name: 'CLASSIC CHROME' },
    { code: 'A', name: 'ACROS' },
    { code: 'NN', name: 'NOSTALGIC NEG.' },
    { code: 'CN', name: 'CLASSIC NEG.' },
    { code: 'EB', name: 'ETERNA BLEACH' },
    { code: 'PRO', name: 'PRO NEG. STD' },
];

export const simFor = (film) => SIMS[(film.id - 1) % SIMS.length];

// Frame-style file number, e.g. DSCF0003
export const fileNo = (film) => `DSCF${String(film.id).padStart(4, '0')}`;

// Exposure compensation shown on the OSD scale for each film (EV, thirds of a stop)
const EV = [-0.3, 0, 0.7, -1, 0.3, 0, -0.7];
export const evFor = (film) => EV[(film.id - 1) % EV.length];

// How long each film stays on the live view before advancing
export const AUTOPLAY_MS = 7000;

// Length of the tap-to-focus hunt; the AF box locks when it settles
export const FOCUS_MS = 420;

// Number of tabs in the INFO menu (SystemInfo), so the D-pad can page through them
export const INFO_TAB_COUNT = 3;
