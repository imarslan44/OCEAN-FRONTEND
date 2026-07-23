/**
 * @file components/Glow.jsx
 * @description Renders the soft radial background glow behind the iceberg.
 * Responds to subtle mouse movement and breathes with a low opacity loop.
 */

import React from 'react';
import { motion } from 'framer-motion';

export const Glow = React.memo(({ glowVariants, mouseX, mouseY }) => {
  return (
    <g id="GlowLayer">
      <defs>
        <radialGradient
          id="iceberg-ambient-glow"
          cx="50%"
          cy="45%"
          r="50%"
          fx="50%"
          fy="45%"
        >
          <stop offset="0%" stopColor="#1da8cc" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#0f628b" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#05263b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.circle
        cx={300}
        cy={300}
        r={220}
        fill="url(#iceberg-ambient-glow)"
        style={{
          x: mouseX,
          y: mouseY,
        }}
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />
    </g>
  );
});

Glow.displayName = 'Glow';