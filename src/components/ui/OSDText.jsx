import React from 'react';

export default function OSDText({ children, className = "" }) {
    return (
        <span className={`font-mono text-xs md:text-sm text-green-400 drop-shadow-[0_2px_0_rgba(0,0,0,0.8)] ${className}`}>
      {children}
    </span>
    );
}