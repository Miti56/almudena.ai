import React from 'react';

export default function CameraStyles() {
    return (
        <style>
            {`
          @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
          .font-camera { font-family: 'Share Tech Mono', monospace; }
          
          
          .texture-body {
            background-color: #1a1a1a;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
          }
          .texture-leather {
            background-color: #0f0f0f;
            background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
          }
          .scanline {
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.3));
            background-size: 100% 3px;
          }
          .screen-pixel {
             background-image: radial-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.4) 100%);
             background-size: 3px 3px;
          }
          /* Custom scrollbar for webkit */
          .scrollbar-thin::-webkit-scrollbar { width: 6px; }
          .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
          .scrollbar-thin::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 3px; }
      `}
        </style>
    );
}