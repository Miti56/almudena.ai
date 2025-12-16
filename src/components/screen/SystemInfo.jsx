import React from 'react';
import {
    User,
    Download,
    Instagram,
    Linkedin,
    Clapperboard,
    FileText,
    ExternalLink,
    Aperture,
    MapPin
} from 'lucide-react';
import { SKILLS, EXPERIENCE } from '../../data/cameraData';

export default function SystemInfo({ handleBack, isVisible }) {

    // Placeholder data for the profile (You can move this to cameraData.js later)
    const PROFILE = {
        name: "ALMUDENA MIRONES RIOTTE",
        role: "DIRECTOR OF PHOTOGRAPHY",
        location: "Madrid / Paris",
        bio: "Visual storyteller obsessed with natural light and raw textures. Specializing in narrative fiction and documentary formats with a focus on intimate, character-driven visual styles.",
        socials: {
            instagram: "#",
            linkedin: "#",
            imdb: "#"
        }
    };

    return (
        <div className={`absolute inset-0 bg-[#0d0d0d] z-40 transition-transform duration-300 flex flex-col ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>

            {/* --- TOP HEADER (Menu Bar Style) --- */}
            <div className="bg-[#1a1a1a] p-3 border-b border-white/10 flex justify-between items-center shadow-lg shrink-0">
                <div className="flex items-center gap-2">
                    <div className="bg-green-500/20 p-1 rounded">
                        <User size={14} className="text-green-500" />
                    </div>
                    <span className="text-white/90 font-camera text-sm tracking-widest">OPERATOR PROFILE // <span className="text-green-500">ACTIVE</span></span>
                </div>
                <button
                    onClick={handleBack}
                    className="group flex items-center gap-2 px-3 py-1 bg-zinc-800 hover:bg-white/10 border border-white/10 rounded transition-all"
                >
                    <span className="text-[10px] text-white/60 group-hover:text-white font-camera">CLOSE MENU</span>
                    <span className="bg-white/20 text-white text-[10px] px-1.5 rounded font-mono">BACK</span>
                </button>
            </div>

            {/* --- MAIN CONTENT (Scrollable) --- */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 font-camera custom-scrollbar">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* --- LEFT COLUMN: IMAGE & ACTIONS (4 Cols) --- */}
                    <div className="md:col-span-4 flex flex-col gap-4">

                        {/* Profile Image Container with "Camera Overlay" effects */}
                        <div className="relative aspect-[3/4] w-full bg-zinc-900 rounded-sm border border-white/10 overflow-hidden group">
                            {/* The Image */}
                            <img
                                src="src/assets/almuPerfil.png"
                                alt="Profile"
                                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale hover:grayscale-0"
                            />

                            {/* Overlay UI: Focus Brackets */}
                            <div className="absolute inset-4 border border-white/20 opacity-50">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500"></div>
                                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500"></div>
                            </div>

                            {/* Overlay UI: Data */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                <div className="flex justify-between items-end">
                                    <div className="text-[10px] text-green-500 font-mono">
                                        ISO 800<br/>
                                        WB 5600K
                                    </div>
                                    <div className="flex items-center gap-1 text-red-500 animate-pulse">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <span className="text-[9px] font-bold tracking-widest">LIVE</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social / Contact Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            <SocialButton icon={Instagram} label="INSTAGRAM" href={PROFILE.socials.instagram} />
                            <SocialButton icon={Linkedin} label="LINKEDIN" href={PROFILE.socials.linkedin} />
                            <SocialButton icon={Clapperboard} label="IMDb" href={PROFILE.socials.imdb} />
                            <SocialButton icon={ExternalLink} label="VIMEO" href="#" />
                        </div>

                        {/* Download CV Button (Primary Action) */}
                        <button className="w-full bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/50 text-white p-4 flex items-center justify-between group transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <FileText className="text-green-500" size={20} />
                                <div className="text-left">
                                    <div className="text-xs font-bold tracking-widest group-hover:text-green-400">DOWNLOAD CV</div>
                                    <div className="text-[9px] text-white/40">PDF // 2.4 MB</div>
                                </div>
                            </div>
                            <Download size={16} className="text-white/30 group-hover:text-white group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>

                    {/* --- RIGHT COLUMN: INFO & STATS (8 Cols) --- */}
                    <div className="md:col-span-8 flex flex-col gap-8">

                        {/* Name Block */}
                        <div className="border-l-2 border-green-500 pl-6 py-2">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tighter">{PROFILE.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-green-500 font-mono uppercase tracking-widest">
                                <span>{PROFILE.role}</span>
                                <span className="text-zinc-600">|</span>
                                <span className="flex items-center gap-1 text-zinc-400"><MapPin size={12}/> {PROFILE.location}</span>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="bg-white/5 p-6 border border-white/5 relative overflow-hidden">
                            <Aperture className="absolute -right-4 -top-4 text-white/5 rotate-12" size={120} />
                            <h3 className="text-xs text-green-500 uppercase tracking-widest mb-3 font-bold">Operator Bio</h3>
                            <p className="text-white/80 text-lg leading-relaxed font-sans relative z-10">
                                {PROFILE.bio}
                            </p>
                        </div>

                        {/* Skills Matrix */}
                        <div>
                            <div className="flex items-center justify-between border-b border-white/10 mb-4 pb-2">
                                <h3 className="text-xs text-white/50 uppercase tracking-widest">Technical Parameters</h3>
                                <span className="text-[10px] text-green-500">CONFIG_LOADED</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {SKILLS.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs hover:border-green-500 hover:text-green-400 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Experience Log */}
                        <div>
                            <div className="flex items-center justify-between border-b border-white/10 mb-4 pb-2">
                                <h3 className="text-xs text-white/50 uppercase tracking-widest">Production Log</h3>
                                <span className="text-[10px] text-green-500">HISTORY_READ</span>
                            </div>
                            <div className="space-y-0">
                                {EXPERIENCE.map((exp, i) => (
                                    <div key={i} className="group flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-white/5 hover:bg-white/5 transition-colors px-2 -mx-2">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-sm tracking-wide group-hover:text-green-400 transition-colors">{exp.role}</span>
                                            <span className="text-zinc-500 text-xs uppercase">{exp.company}</span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 md:mt-0">
                                            <div className="h-px w-12 bg-zinc-800 hidden md:block"></div>
                                            <span className="font-mono text-green-500 text-xs bg-green-900/20 px-2 py-0.5 rounded border border-green-900/50">{exp.year}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer Status Bar */}
            <div className="bg-[#0a0a0a] border-t border-white/5 p-2 flex justify-between items-center text-[10px] text-zinc-600 font-mono">
                <span>SYS_ID: 8821-X</span>
                <span>BATTERY: 94%</span>
            </div>
        </div>
    );
}

// --- Helper Component for Social Buttons ---
function SocialButton({ icon: Icon, label, href }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-4 bg-[#151515] border border-white/5 hover:border-white/30 hover:bg-[#222] transition-all group"
        >
            <Icon size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
            <span className="text-[9px] font-bold text-zinc-600 group-hover:text-green-500 tracking-widest uppercase transition-colors">{label}</span>
        </a>
    );
}