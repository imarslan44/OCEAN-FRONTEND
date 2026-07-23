/**
 * @file components/Iceberg.jsx
 * @description Contains the vector artwork components for the top (above water)
 * and bottom (submerged keel) sections of the iceberg.
 */

import React from 'react';

// Above-water portion of the iceberg
export const IcebergTop = React.memo(() => {
  return (
    <g id="IcebergTop">
      {/* Main Peak Center Front */}
      <polygon points="300,120 250,230 300,300 350,230" fill="#ffffff" />
      <polygon points="300,120 350,230 300,300" fill="#d8f3f8" />
      <polygon points="300,120 250,230 300,300" fill="#bce9f3" />

      {/* Main Peak Left Shading */}
      <polygon points="300,120 250,230 220,300 180,300" fill="#7ed4e6" />
      <polygon points="250,230 220,300 300,300" fill="#63c6da" />

      {/* Left Peak */}
      <polygon points="235,160 190,240 220,300 250,230" fill="#eaf8fa" />
      <polygon points="235,160 180,300 190,240" fill="#9be1f0" />
      <polygon points="235,160 180,300 220,300" fill="#4fb2c9" />

      {/* Right Peak */}
      <polygon points="360,180 330,250 350,230" fill="#ffffff" />
      <polygon points="360,180 400,300 350,230" fill="#8edbe8" />
      <polygon points="350,230 400,300 300,300" fill="#3b8ea5" />

      {/* Base Highlights at Waterline */}
      <polygon points="180,300 220,300 200,285" fill="#e0f7fa" opacity="0.6" />
      <polygon points="300,300 350,230 380,300" fill="#45a3ba" />
    </g>
  );
});

IcebergTop.displayName = 'IcebergTop';

// Submerged portion of the iceberg
export const IcebergBottom = React.memo(() => {
  return (
    <g id="IcebergBottom">
      {/* Central Deep Keel */}
      <polygon points="300,300 305,510 255,430 230,300" fill="#0083a4" />
      <polygon points="300,300 305,510 335,420 375,300" fill="#0b4f71" />
      <polygon points="300,300 255,430 305,510" fill="#1da8cc" />

      {/* Submerged Left Section */}
      <polygon points="180,300 230,300 220,400 160,350" fill="#0f628b" />
      <polygon points="230,300 255,430 220,400" fill="#093f5d" />
      <polygon points="220,400 255,430 230,470 180,420" fill="#05263b" />

      {/* Deepest Point Tip (Vibrant Teal Highlight) */}
      <polygon points="255,430 305,510 280,480" fill="#1da8cc" />

      {/* Submerged Right Section */}
      <polygon points="375,300 420,300 395,390 335,420" fill="#157a9e" />
      <polygon points="375,300 335,420 300,300" fill="#0a3d59" />
      <polygon points="335,420 395,390 370,455 305,510" fill="#05263b" />
      <polygon points="395,390 420,300 410,380" fill="#0b4f71" />

      {/* Depth shading gradient layer */}
      <polygon
        points="180,300 420,300 305,510"
        fill="url(#submerged-depth-gradient)"
        opacity="0.35"
      />

      <defs>
        <linearGradient id="submerged-depth-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1da8cc" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#08334c" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#02131e" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </g>
  );
});

IcebergBottom.displayName = 'IcebergBottom';