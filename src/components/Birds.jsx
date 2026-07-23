/**
 * @file components/Birds.jsx
 * @description Renders minimalistic vector birds with flapping SVG wing paths and gentle vertical drift.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const Birds = React.memo(({ animated = true, count = 2 }) => {
  const shouldReduceMotion = useReducedMotion();
  const isAnimated = animated && !shouldReduceMotion;

  // Left wing bezier curve flapping animation
  const wingLeftVariants = {
    animate: isAnimated
      ? {
          d: [
            'M 0 0 Q -8 -8 -16 -2 Q -8 -2 0 0',
            'M 0 0 Q -8 2 -16 6 Q -8 0 0 0',
            'M 0 0 Q -8 -8 -16 -2 Q -8 -2 0 0',
          ],
          transition: {
            duration: 1.8,
            ease: 'easeInOut',
            repeat: Infinity,
          },
        }
      : { d: 'M 0 0 Q -8 -5 -16 -2 Q -8 -2 0 0' },
  };

  // Right wing bezier curve flapping animation
  const wingRightVariants = {
    animate: isAnimated
      ? {
          d: [
            'M 0 0 Q 8 -8 16 -2 Q 8 -2 0 0',
            'M 0 0 Q 8 2 16 6 Q 8 0 0 0',
            'M 0 0 Q 8 -8 16 -2 Q 8 -2 0 0',
          ],
          transition: {
            duration: 1.8,
            ease: 'easeInOut',
            repeat: Infinity,
          },
        }
      : { d: 'M 0 0 Q 8 -5 16 -2 Q 8 -2 0 0' },
  };

  // Gentle 2px vertical float for the bird position
  const birdFloatVariants = {
    animate: isAnimated
      ? {
          translateY: [-2, 2, -2],
          transition: {
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
          },
        }
      : { translateY: 0 },
  };

  const birdPositions = [
    { x: 492, y: 202, scale: 2.45 },
    { x: 516, y: 243, scale: 2.02 },
    { x: 374, y: 124, scale: 3.7 },
  ].slice(0, Math.min(count, 3));

  return (
    <g id="BirdLayer">
      {birdPositions.map((pos, index) => (
        <motion.g
          key={`bird-${index}`}
          variants={birdFloatVariants}
          animate="animate"
        >
          <g transform={`translate(${pos.x}, ${pos.y}) scale(${pos.scale})`}>
            <motion.path
              fill="#5cbccf"
              variants={wingLeftVariants}
              animate="animate"
            />
            <motion.path
              fill="#419bb0"
              variants={wingRightVariants}
              animate="animate"
            />
            <ellipse cx="0" cy="0" rx="1.5" ry="2.5" fill="#2d7c91" />
          </g>
        </motion.g>
      ))}
    </g>
  );
});

Birds.displayName = 'Birds';
