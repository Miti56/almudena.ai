import React from 'react';
import { User, Clapperboard, AtSign, MapPin, FileDown, ArrowUpRight, Instagram, Linkedin, Globe, Film, CornerUpLeft } from 'lucide-react';
import { EXPERIENCE } from '../../data/cameraData';
import { INFO_TAB_COUNT } from '../../lib/camera';

const PROFILE = {
    name: 'Almudena Mirones Riotte',
    role: 'Meritoria de Dirección',
    location: 'Madrid',
    bio: 'Hola :)',
    cv: '/cv/CV_ALMUDENA_MIRONES_RIOTTE.pdf',
    socials: [
        { label: 'Instagram', handle: '@_almuu._', href: 'https://www.instagram.com/_almuu._/', icon: Instagram },
        { label: 'LinkedIn', handle: 'almudena-mirones-riotte', href: 'https://www.linkedin.com/in/almudena-mirones-riotte/', icon: Linkedin },
        { label: 'IMDb', handle: 'nm17673372', href: 'https://www.imdb.com/fr/name/nm17673372/', icon: Film },
        { label: 'Web', handle: 'almudena.art', href: 'https://almudena.art', icon: Globe },
    ],
};

const TABS = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'log', label: 'Experiencia', icon: Clapperboard },
    { id: 'contact', label: 'Contacto', icon: AtSign },
];

function Row({ children, className = '', ...props }) {
    return (
        <div
            className={`group flex items-center gap-4 px-3 md:px-4 py-3 border-b border-white/[0.07] hover:bg-osd hover:text-black transition-colors duration-150 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

function Profile() {
    return (
        <div className="grid md:grid-cols-[minmax(0,220px)_1fr] gap-5 md:gap-8 p-4 md:p-6">
            <div className="relative w-28 md:w-full aspect-[3/4] rounded-[3px] overflow-hidden ring-1 ring-white/10 group animate-[pop_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
                <img src="/images/almuPerfil.webp" alt={PROFILE.name} className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-[filter] duration-700" />
                <div className="absolute inset-x-0 bottom-0 p-2 flex justify-between font-mono text-[9px] text-osd bg-gradient-to-t from-black/80 to-transparent">
                    <span>ACROS</span>
                    <span>F1.4 · 1/125</span>
                </div>
            </div>
            <div className="flex flex-col animate-[rise_0.7s_cubic-bezier(0.16,1,0.3,1)_0.08s_both]">
                <h1 className="text-3xl md:text-5xl font-[800] uppercase leading-[0.92] text-white" style={{ fontStretch: '115%' }}>
                    {PROFILE.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                    <span className="font-serif italic text-lg text-white/90">{PROFILE.role}</span>
                    <span className="flex items-center gap-1 font-mono text-[11px] tracking-wider">
                        <MapPin size={12} /> {PROFILE.location.toUpperCase()}
                    </span>
                </div>
                <p className="mt-5 text-white/85 text-base md:text-lg leading-relaxed max-w-prose">{PROFILE.bio}</p>
                <a
                    href={PROFILE.cv}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 self-start inline-flex items-center gap-3 h-10 pl-3 pr-4 rounded-full bg-osd text-black text-xs font-bold tracking-[0.15em] uppercase hover:bg-white transition-colors"
                >
                    <FileDown size={16} /> Descargar CV
                </a>
            </div>
        </div>
    );
}

function Experience() {
    return (
        <div className="py-1">
            {EXPERIENCE.map((exp, i) => (
                <Row key={i} className="animate-[rise_0.5s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ animationDelay: `${i * 45}ms` }}>
                    <span className="font-mono text-[10px] text-white/35 group-hover:text-black/50 w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-white group-hover:text-black">{exp.role}</div>
                        <div className="text-xs text-white/55 group-hover:text-black/65 truncate">{exp.company}</div>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] md:text-[11px] text-fuji group-hover:text-fuji-deep text-right">{exp.year}</span>
                </Row>
            ))}
        </div>
    );
}

function Contact() {
    return (
        <div className="py-1">
            {PROFILE.socials.map(({ label, handle, href, icon: Icon }, i) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="block">
                    <Row className="animate-[rise_0.5s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ animationDelay: `${i * 45}ms` }}>
                        <Icon size={16} className="text-white/60 group-hover:text-black shrink-0" />
                        <span className="w-24 text-sm font-bold text-white group-hover:text-black">{label}</span>
                        <span className="flex-1 font-mono text-[11px] text-white/55 group-hover:text-black/65 truncate">{handle}</span>
                        <ArrowUpRight size={16} className="text-white/40 group-hover:text-black shrink-0" />
                    </Row>
                </a>
            ))}
            <a href={PROFILE.cv} download target="_blank" rel="noopener noreferrer" className="block">
                <Row>
                    <FileDown size={16} className="text-fuji group-hover:text-black shrink-0" />
                    <span className="w-24 text-sm font-bold text-white group-hover:text-black">CV</span>
                    <span className="flex-1 font-mono text-[11px] text-white/55 group-hover:text-black/65 truncate">PDF</span>
                    <ArrowUpRight size={16} className="text-white/40 group-hover:text-black shrink-0" />
                </Row>
            </a>
        </div>
    );
}

if (TABS.length !== INFO_TAB_COUNT) console.warn('INFO_TAB_COUNT is out of sync with SystemInfo tabs');

export default function SystemInfo({ handleBack, tabIndex, onTab }) {
    const current = tabIndex;
    const tab = TABS[current].id;

    return (
        <div className="absolute inset-0 z-40 flex flex-col bg-[#0b0b0b] text-white animate-[fade_0.3s_ease-out_both]">
            {/* Menu header */}
            <div className="shrink-0 h-11 md:h-12 flex items-center justify-between px-3 md:px-4 border-b border-white/10 bg-[#141414]">
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center h-6 px-2 rounded-[3px] bg-osd text-black text-[10px] font-[800] tracking-[0.15em]">MENU</span>
                    <span className="font-[800] uppercase tracking-[0.2em] text-sm" style={{ fontStretch: '115%' }}>
                        {TABS[current].label}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-white/50 tabular">
                        {current + 1}/{TABS.length}
                    </span>
                    <button onClick={handleBack} className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border border-white/15 text-[10px] font-bold tracking-[0.15em] hover:bg-white/10 transition-colors">
                        <CornerUpLeft size={12} /> BACK
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col md:flex-row">
                {/* Tabs: left rail on desktop, top strip on mobile */}
                <nav className="shrink-0 flex md:flex-col md:w-16 border-b md:border-b-0 md:border-r border-white/10 bg-[#101010]">
                    {TABS.map(({ id, label, icon: Icon }, i) => {
                        const active = id === tab;
                        return (
                            <button
                                key={id}
                                onClick={() => onTab(i)}
                                aria-label={label}
                                className={`relative flex-1 md:flex-none h-11 md:h-16 flex items-center justify-center transition-colors ${
                                    active ? 'bg-osd text-black' : 'text-white/45 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Icon size={18} />
                                {active && <span className="absolute md:hidden bottom-0 inset-x-0 h-[2px] bg-fuji" />}
                                {active && <span className="hidden md:block absolute right-0 inset-y-0 w-[3px] bg-fuji" />}
                            </button>
                        );
                    })}
                </nav>

                <div key={tab} className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
                    {tab === 'profile' && <Profile />}
                    {tab === 'log' && <Experience />}
                    {tab === 'contact' && <Contact />}
                </div>
            </div>

            {/* Button guide */}
            <div className="shrink-0 hidden md:flex items-center gap-6 h-9 px-4 border-t border-white/10 bg-[#141414] font-mono text-[10px] tracking-[0.15em] text-white/45">
                <span><span className="text-white/80">◀ ▶</span> SECCIÓN</span>
                <span><span className="text-white/80">DISP/BACK</span> SALIR</span>
                <span className="ml-auto">ALMUDENA · X-DIR</span>
            </div>
        </div>
    );
}
