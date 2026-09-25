# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A portfolio site for filmmaker Almudena Mirones Riotte, built as a single-page React app that looks and behaves like a physical cinema camera: a monitor (screen) plus a grip with hardware-style buttons (power, D-pad, OK, gallery, info, selfie, DISP/back). UI copy and film data are mostly in Spanish.

## Commands

- `npm run dev`: Vite dev server with HMR
- `npm run build`: production build to `dist/`
- `npm run preview`: serve the built `dist/`
- `npm run lint`: ESLint (flat config in `eslint.config.js`)

There is no test suite and no TypeScript.

## Stack

- React 19 with **React Compiler** enabled through `babel-plugin-react-compiler` in `vite.config.js`. Manual `useMemo`/`useCallback` is mostly unnecessary. The compiler memoizes on props and state, so reads of module-level mutable data (like the histogram cache in `src/lib/useHistogram.js`) have to be tied to a state value to stay reactive.
- Tailwind CSS v4 through `@tailwindcss/vite`. There is no tailwind config: design tokens (`--color-fuji`, `--color-osd`, `--color-rec`, `--color-amber`, fonts), keyframes and material utilities (`mat-leather`, `mat-paint`, `mat-silver`, `mat-spun`, `knurl-*`, `engrave-*`, `osd`) all live in `src/index.css`. Materials are declared with `@utility` so they accept variants such as `md:mat-paint`.
- Fonts come from Google Fonts in `index.html`: Archivo (variable width; wide lettering uses `fontStretch`), JetBrains Mono for OSD numbers, and Instrument Serif for editorial text.
- Icons come from `lucide-react`.
- ESLint runs the react-hooks v7 compiler rules, including `set-state-in-effect`. Derive state during render, or set it from a timer or subscription callback, instead of setting it synchronously inside an effect.

## Architecture

The UI is a Fujifilm X-series style camera seen from the back: a silver top plate, a leatherette body, an LCD (`MonitorBody`) and a grip (`GripControls`). All user-facing brand text is made up ("ALMUDENA", "X-DIR"). Don't use real Fujifilm trademarks or logos.

**All app state lives in `src/App.jsx`**, with no router and no context. It holds:
- `view`: `'viewfinder' | 'gallery' | 'detail' | 'info'`. The mode dial position is derived from `view` plus `isSelfieMode`; `setMode()` jumps straight to a mode.
- `liveIndex`: the film shown in live view. `LiveView` auto-advances it, D-pad left/right changes it, and OK or a tap on the screen opens it.
- `shutterTick`: incremented on every shutter press. `Iris` snaps shut on each change, `MonitorBody` grabs a selfie frame while the iris is shut, and the access lamp blinks. From playback or menus, the shutter returns to live view, like a half-press on a real camera.
- power and boot state. `BOOT_MS` sets the splash length; the iris opens when `powerOn && !bootSequence`.
- selfie mode. Leaving it must go through `stopSelfieMode()` so the webcam tracks stop.
- `navHint`, set only through `showHint()`. The special value `'HELP_MENU'` shows the help card.
- `infoTab`, so the D-pad can page through the INFO menu tabs. `INFO_TAB_COUNT` in `src/lib/camera.js` must match the tabs in `SystemInfo`.
- keyboard control: a single `keydown` listener reads the latest handlers from a ref.

The same actions can be triggered by grip buttons, keyboard and on-screen taps, so navigation changes usually touch both the App handlers and the screen components. Every button press goes through `handlePress(name, action)`, which ignores input while powered off and briefly sets `activeButton` for the pressed look.

LCD layer order in `MonitorBody`, bottom to top:
1. `LiveView` (or the webcam feed)
2. the active screen (`Viewfinder` OSD, `Gallery`, `FilmDetail`, `SystemInfo`)
3. hints
4. shutter flash
5. `Iris`
6. `BootScreen`
7. the power-off panel
8. sub-pixel, grain and dust overlays

`src/lib/`:
- `camera.js`: decorative per-film film simulation, EV and file number, plus shared constants
- `useHistogram.js`: a real RGB histogram read from the image or the webcam through a canvas
- `sfx.js`: WebAudio shutter, AF beep and dial tick, synthesized so there are no audio files

Animations that run every frame (`Iris`, `Timecode`) write to the DOM through refs instead of calling setState.

**Content** is in `src/data/cameraData.jsx`:
- `FILMS`: title, descriptions, credits, poster `src` under `/images/*.webp`, gradient `color` (the fallback when an image fails to load), and a video `url`. Videos are hosted externally on `movies.almudena.art`; `url: 'n/a'` disables playback.
- `SKILLS` and `EXPERIENCE`, shown in the INFO menu. Profile, bio and social links are in `SystemInfo.jsx`.

## Assets and deploy

- Static assets are in `public/`: poster images (WebP), the CV PDF at `public/cv/`, and the favicon. `public/images/convert.sh` converts PNG/JPG to WebP with `cwebp -q 75`; add new images as WebP.
- The site deploys to Netlify. `netlify.toml` is kept in `public/`, so it gets copied into `dist/`. It sets up the SPA fallback and long cache headers.
- Video playback in `FilmDetail` depends on `playsInline` and native `controls` for Safari/iOS. Don't put overlays over the video that would capture pointer events.
