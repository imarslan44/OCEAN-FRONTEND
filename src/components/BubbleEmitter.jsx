/**
 * @file components/BubbleEmitter.jsx
 * @description Renders active procedural bubbles and particle burst nodes inside the SVG canvas.
 * Recycles DOM nodes via onAnimationComplete callbacks.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useBubbleEmitter } from '../hooks/useBubbleEmitter';

const SingleBubble = React.memo(({ bubble, onComplete }) => {
  const isBurst = bubble.isBurst;
  const dotRadius = Math.max(1.8, bubble.size * 0.42);
  const highlightOffset = Math.max(0.7, bubble.size * 0.2);

  return (
    <motion.g
      initial={{
        opacity: 0,
        translateY: 0,
        translateX: 0,
        scale: 0.6,
      }}
      animate={{
        opacity: isBurst ? [0, 0.9, 0] : [0, 0.7, 0.8, 0],
        translateY: isBurst ? -35 : -140,
        translateX: [0, bubble.driftX, -bubble.driftX, bubble.driftX * 1.5],
        scale: isBurst ? [0.6, 1.4, 0] : [0.6, 1.1, 1.3, 1.6],
      }}
      transition={{
        duration: bubble.duration,
        delay: bubble.delay,
        ease: isBurst ? 'easeOut' : [0.25, 0.1, 0.25, 1],
      }}
      onAnimationComplete={() => onComplete(bubble.id)}
      style={{
        filter: isBurst ? 'drop-shadow(0px 0px 3px rgba(92,213,229,0.65))' : 'drop-shadow(0px 0px 4px rgba(92,213,229,0.8))',
      }}
    >
      <circle
        cx={bubble.x}
        cy={bubble.y}
        r={bubble.size}
        fill="#5cd5e5"
        fillOpacity={isBurst ? 0.38 : 0.28}
        stroke="#d9fbff"
        strokeWidth={isBurst ? 0.75 : 1.25}
        strokeOpacity={isBurst ? 1 : 0.9}
      />
      <circle
        cx={bubble.x - highlightOffset}
        cy={bubble.y - highlightOffset}
        r={dotRadius}
        fill="#ffffff"
        fillOpacity={isBurst ? 0.95 : 0.9}
      />
    </motion.g>
  );
});

SingleBubble.displayName = 'SingleBubble';

export const BubbleEmitter = React.memo(({ animated = true, density = 1 }) => {
  const shouldReduceMotion = useReducedMotion();
  const isAnimated = animated && !shouldReduceMotion;
  const { bubbles, removeBubble } = useBubbleEmitter({ animated: isAnimated, density });

  if (!isAnimated) return null;

  return (
    <g id="BubbleLayer">
      {bubbles.map((bubble) => (
        <SingleBubble key={bubble.id} bubble={bubble} onComplete={removeBubble} />
      ))}
    </g>
  );
});

BubbleEmitter.displayName = 'BubbleEmitter';
