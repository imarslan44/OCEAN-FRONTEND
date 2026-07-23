/**
 * @file components/WaterLine.jsx
 * @description Renders the horizon cut line with a subtle 2px amplitude ripple effect.
 * Uses a linear opacity gradient to soften the edges.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const WaterLine = React.memo(({ animated = true }) => {
  const shouldReduceMotion = useReducedMotion();
  const isAnimated = animated && !shouldReduceMotion;

  // Path ripple animation sequence (2px max deflection)
  const pathVariants = {
    animate: isAnimated
      ? {
          d: [
            'M 120 300 Q 210 298 300 300 T 480 300',
            'M 120 300 Q 210 302 300 300 T 480 300',
            'M 120 300 Q 210 298 300 300 T 480 300',
          ],
          transition: {
            duration: 5,
            ease: 'easeInOut',
            repeat: Infinity,
          },
        }
      : { d: 'M 120 300 L 480 300' },
  };

  return (
    <g id="WaterLineLayer">
      <defs>
        <linearGradient id="waterline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="15%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="85%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Blurred background glow line */}
      <motion.path
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeOpacity="0.25"
        strokeLinecap="round"
        variants={pathVariants}
        animate="animate"
        style={{ filter: 'blur(2px)' }}
      />
      {/* Crisp foreground line */}
      <motion.path
        fill="none"
        stroke="url(#waterline-grad)"
        strokeWidth="1.25"
        strokeLinecap="round"
        variants={pathVariants}
        animate="animate"
      />
    </g>
  );
});

WaterLine.displayName = 'WaterLine';