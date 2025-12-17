import React from 'react';
import { User, Download, Instagram, Linkedin, Clapperboard, FileText, ExternalLink, Aperture, MapPin } from 'lucide-react';
import { SKILLS, EXPERIENCE } from '../../data/cameraData';

export default function SystemInfo({ handleBack, isVisible }) {
    const PROFILE = {
        name: "ALMUDENA MIRONES",
        role: "DIRECTOR OF PHOTOGRAPHY",
        location: "Madrid / Paris",
        bio: "Visual storyteller obsessed with natural light and raw textures.",
        socials: { instagram: "#", linkedin: "#", imdb: "#" }
    };

    return (
        <div className={`absolute inset-0 bg-[#0d0d0d] z-40 transition-transform duration-300 flex flex-col ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>

            {/* Header */}
            <div className="bg-[#1a1a1a] p-2 md:p-3 border-b border-white/10 flex justify-between items-center shadow-lg shrink-0">
                <div className="flex items-center gap-2">
                    <div className="bg-green-500/20 p-1 rounded">
                        <User size={14} className="text-green-500" />
                    </div>
                    <span className="text-white/90 font-camera text-xs md:text-sm tracking-widest">OPERATOR PROFILE</span>
                </div>
                <button onClick={handleBack} className="bg-zinc-800 border border-white/10 px-2 py-1 rounded text-[10px] text-white">BACK</button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 font-camera custom-scrollbar">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">

                    {/* --- MOBILE COMPACT HEADER --- */}
                    <div className="md:hidden flex gap-4 items-center mb-2">
                        {/* Small Avatar for Mobile */}
                        <div className="w-20 h-20 shrink-0 bg-zinc-900 rounded border border-white/10 overflow-hidden relative">
                            <img src="./public/almuPerfil.png" className="w-full h-full object-cover grayscale" alt="Profile" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white leading-tight">{PROFILE.name}</h1>
                            <div className="text-[10px] text-green-500 tracking-widest mt-1">{PROFILE.role}</div>
                            <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1"><MapPin size={10}/> {PROFILE.location}</div>
                        </div>
                    </div>

                    {/* --- LEFT COLUMN (Desktop only for big image, Mobile for Buttons) --- */}
                    <div className="md:col-span-4 flex flex-col gap-4">

                        {/* Big Image - HIDDEN ON MOBILE */}
                        <div className="hidden md:block relative aspect-[3/4] w-full bg-zinc-900 rounded-sm border border-white/10 overflow-hidden group">
                            <img src="./public/almuPerfil.png" alt="Profile" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all grayscale" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                <div className="text-[10px] text-green-500 font-mono">ISO 800</div>
                            </div>
                        </div>

                        {/* Socials - Condensed on Mobile */}
                        <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
                            <SocialButton icon={Instagram} href={PROFILE.socials.instagram} />
                            <SocialButton icon={Linkedin} href={PROFILE.socials.linkedin} />
                            <SocialButton icon={Clapperboard} href={PROFILE.socials.imdb} />
                            <SocialButton icon={ExternalLink} href="#" />
                        </div>

                        <button className="w-full bg-white/5 hover:bg-green-500/20 border border-white/10 text-white p-3 flex items-center justify-center gap-2 group">
                            <FileText size={16} className="text-green-500"/>
                            <span className="text-xs font-bold tracking-widest">DOWNLOAD CV</span>
                        </button>
                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <div className="md:col-span-8 flex flex-col gap-6">

                        {/* Name Block - HIDDEN ON MOBILE (Shown in compact header instead) */}
                        <div className="hidden md:block border-l-2 border-green-500 pl-6 py-2">
                            <h1 className="text-5xl font-bold text-white mb-2 tracking-tighter">{PROFILE.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-green-500 font-mono uppercase tracking-widest">
                                <span>{PROFILE.role}</span>
                                <span className="flex items-center gap-1 text-zinc-400"><MapPin size={12}/> {PROFILE.location}</span>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="bg-white/5 p-4 border border-white/5 relative overflow-hidden">
                            <p className="text-white/80 text-sm md:text-lg leading-relaxed font-sans relative z-10">{PROFILE.bio}</p>
                        </div>

                        {/* Skills */}
                        <div>
                            <div className="flex items-center justify-between border-b border-white/10 mb-2 pb-1">
                                <h3 className="text-xs text-white/50 uppercase tracking-widest">Skills</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {SKILLS.map((skill, index) => (
                                    <span key={index} className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] md:text-xs">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Experience */}
                        <div className="pb-10 md:pb-0"> {/* Extra padding for mobile bottom */}
                            <div className="flex items-center justify-between border-b border-white/10 mb-2 pb-1">
                                <h3 className="text-xs text-white/50 uppercase tracking-widest">Log</h3>
                            </div>
                            <div className="space-y-0">
                                {EXPERIENCE.map((exp, i) => (
                                    <div key={i} className="flex flex-row items-center justify-between py-2 border-b border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-xs">{exp.role}</span>
                                            <span className="text-zinc-500 text-[10px] uppercase">{exp.company}</span>
                                        </div>
                                        <span className="font-mono text-green-500 text-[10px]">{exp.year}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function SocialButton({ icon: Icon, href }) {
    return (
        <a href={href} className="flex items-center justify-center p-3 bg-[#151515] border border-white/5 hover:bg-[#222]">
            <Icon size={16} className="text-zinc-500 hover:text-white" />
        </a>
    );
}